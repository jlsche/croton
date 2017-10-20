import time
import redis
import pymysql
from aliyun import Aliyun
from flask import Flask, request, jsonify

application = Flask(__name__)


redis_server = redis.Redis(host='redis', db=0, charset="utf-8", decode_responses=True)

def connect_mysql():
    db =  pymysql.connect(host='mysql', user='lingtelli', passwd='lingtelli', db='croton', charset='utf8')
    db_cursor = db.cursor()
    db_cursor.execute('SET NAMES utf8;')
    db_cursor.execute('SET CHARACTER SET utf8;')
    db_cursor.execute('SET character_set_connection=utf8;')
    return db

def update_sql_status(task_id, status):
    conn = connect_mysql()
    update_string = "UPDATE CrotonTemplate SET status = '{}' WHERE id = '{}'".format(status, task_id)
    conn.cursor().execute(update_string)
    conn.commit()

def get_task_queue():
    conn = connect_mysql()
    cur = conn.cursor()
    query_string = 'SELECT id from CrotonTemplate WHERE status = "queuing" ORDER BY create_time;'
    cur.execute(query_string)
    queue = [x[0] for x in cur]
    return queue

def pop_task():
    ''' Return the first task with status "building".
    '''
    conn = connect_mysql()
    cur = conn.cursor()
    query_string = 'SELECT id from CrotonTemplate WHERE status = "building" ORDER BY create_time LIMIT 1;'
    cur.execute(query_string)
    try:
        task_id = list(cur)[0][0]
    except IndexError:
        task_id = None
    return task_id

def serving_status():
    ''' Return currently processing row count and number of instance scaled.
    '''
    conn = connect_mysql()
    cur = conn.cursor()
    query_string = 'SELECT SUM(raw_count), COUNT(*) from CrotonTemplate WHERE status in ("building", "stage1", "stage2");'
    cur.execute(query_string)

    row = list(cur)[0]
    num_row_processing = row[0]
    num_scaled_instance = row[1]
    return num_row_processing, num_scaled_instance

def check_affordable(task_id, num_row_processing, num_scaled_instance):
    conn = connect_mysql()
    cur = conn.cursor()
    query_string = 'SELECT raw_count from CrotonTemplate WHERE id = {};'.format(task_id)
    cur.execute(query_string)
    task_row_count = list(cur)[0][0]
    
    if num_row_processing is None:
        num_row_processing = 0
    if (num_row_processing + task_row_count > 6000000):
        return 'Maximum row count exceeded. Currently {}.'.format(num_row_processing)
    if (num_scaled_instance >= 6):
        return 'Maximum instance count exceeded. Currently {}.'.format(num_scaled_instance)
    else:
        return 'available'


@application.route('/tasks/<int:task_id>', methods=['POST'])
def add_task(task_id):
    # write task detail to redis set
    cthr = request.args.get('cthr')
    gthr = request.args.get('gthr')

    hash_key = 'task.{}'.format(task_id) 
    redis_server.hset(hash_key, 'cthr', cthr)
    redis_server.hset(hash_key, 'gthr', gthr)

    # update task status
    update_sql_status(task_id, 'queuing')

    return jsonify({
        'status': 'OK',
    })

@application.route('/start/<int:task_id>', methods=['GET'])
def start(task_id):
    num_row_processing, num_scaled_instance = serving_status()
    affordable_msg = check_affordable(task_id, num_row_processing, num_scaled_instance)

    data = {}
    if affordable_msg == 'available':
        resp = aliyun_scale_up()
        update_sql_status(task_id, 'building')
        data = {'status': 'OK'}
    else:
        data = {'status': 'Queuing', 'message': affordable_msg}
    return jsonify(data)


@application.route('/tasks/<int:task_id>', methods=['DELETE'])
def del_task(task_id):
    """ Receive task from websit and delete task from redis queue.

        Argus:
            task_id: Id of the task, int.
        Returns:
            resp: Add success, bool.
    """
    hash_key = 'task.{}'.format(task_id) 
    redis_server.delete(hash_key)
    return jsonify({'status': 'OK', 'message': 'Job Deleted'})


@application.route('/jobs/<string:instance_id>', methods=['POST'])
def check_in(instance_id):
    """ The scaled instance will call this api to adopt a task.
    """
    task_id = pop_task()
    if task_id is None:
        aliyun_scale_down(instance_id)
        return jsonify({'status': 'Error', 'message': 'No task in queue'})

    start_time = request.args.get('start_time')
    hash_key = "task.{}".format(task_id)

    redis_server.hset(hash_key, 'instance', instance_id)
    redis_server.hset(hash_key, 'start', start_time)

    cthr = redis_server.hget(hash_key, 'cthr')
    gthr = redis_server.hget(hash_key, 'gthr')

    update_sql_status(task_id, 'stage1')

    return jsonify({
        'status': 'OK',
        'id': task_id,
        'cthr': float(cthr),
        'gthr': float(gthr)
    })


@application.route('/jobs/<string:task_id>', methods=['PUT'])
def check_out(task_id):
    """ The scaled instance will call this api to update clustering status.
    """
    action = request.args.get('action')
    end_time = request.args.get('end_time')

    hash_key = "task.{}".format(task_id)
    instance_id = redis_server.hget(hash_key, 'instance')

    if action == 'check':
        update_sql_status(task_id, 'stage2')
        redis_server.hset(hash_key, 'end', end_time)
    elif action == 'checkout':
        update_sql_status(task_id, 'analyze')
        redis_server.delete(hash_key)
 
        aliyun_scale_down(instance_id)
        task_queue = get_task_queue()
        if len(task_queue) > 0:
            time.sleep(60)
            start(task_queue[0])
    return jsonify({'status': 'OK'})


@application.route('/tasks/<string:task_id>', methods=['PUT'])
def delete_task(task_id):
    hash_key = "task.{}".format(task_id)
    instance_id = redis_server.hget(hash_key, 'instance')

    update_sql_status(task_id, 'Error')
    aliyun_scale_down(instance_id)

    return jsonify({
        'status': 'OK',
        'message': 'task {} deleted.'
    })


@application.route('/tasks', methods=['GET'])
def list_tasks():
    task_dict = {}
    for hash_key in redis_server.keys():
        task_dict[hash_key] = redis_server.hgetall(hash_key)
    return jsonify({'status': 'OK', 'data': task_dict})


@application.route('/tasks/<string:task_id>', methods=['GET'])
def get_task_detail(task_id):
    hash_key = "task.{}".format(task_id)
    try:
        data = redis_server.hgetall(hash_key)
        msg = {'status': 'OK', 'data': data}
    except:
        msg = {'status': 'Error', 'message': 'No such task in queue.'}
    finally:
        return jsonify(msg)


@application.route('/status/<string:task_id>', methods=['GET'])
def get_task_status(task_id):
    obj_name = 'status:{}'.format(task_id)
    return redis_server.get(obj_name)


def aliyun_scale_up():
    aliyun_action = Aliyun('ExecuteScalingRule')
    resp = aliyun_action.request()
    return resp

def aliyun_scale_down(instance_id):
    aliyun_action = Aliyun('RemoveInstances', instance_id)
    aliyun_action.request()



if __name__ == '__main__':
    application.run(host='0.0.0.0', port=8011, debug=True)


