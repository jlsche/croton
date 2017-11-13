import time
import redis
import pymysql
from aliyun import Aliyun
from flask import Flask, request, jsonify

application = Flask(__name__)


redis_server = redis.Redis(host='redis', db=0, charset="utf-8", decode_responses=True)

def connect_mysql():
    db = pymysql.connect(host='mysql', user='lingtelli', passwd='lingtelli', db='croton', charset='utf8')
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

def get_queuing_tasks():
    ''' Get tasks that are in `queuing` status from sql db.
    '''
    conn = connect_mysql()
    cur = conn.cursor()
    query_string = 'SELECT id from CrotonTemplate WHERE status = "queuing" ORDER BY create_time;'
    cur.execute(query_string)
    queue = [x[0] for x in cur]
    return queue

def pop_building_task():
    ''' Return the first task that is in "building" status.
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
    ''' Check if the task should be excuted based on 2 conditions:
        1.  Number of currently scaled instances should be less than 6.
        2.  Number of currently processing row count plus row count of new task should be 
            less than 6 millions.
    '''
    conn = connect_mysql()
    cur = conn.cursor()
    query_string = 'SELECT raw_count from CrotonTemplate WHERE id = {};'.format(task_id)
    cur.execute(query_string)
    task_row_count = list(cur)[0][0]
    
    if num_row_processing is None:
        num_row_processing = 0
    if (num_row_processing + task_row_count > 6000000):
        return 'Maximum row count exceeded.'
    if (num_scaled_instance >= 6):
        return 'Maximum instance count exceeded.'
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
        if resp['status'] == 'Failed':
            data = {'status': 'Queuing', 'message': 'Failed scaling up.'}
        else:
            update_sql_status(task_id, 'building')
            data = {'status': 'OK'}
    else:
        data = {'status': 'Queuing', 'message': affordable_msg}
    return jsonify(data)


@application.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """ Delete task from redis and scaled down the instance.
        Note: The request will come from the '刪除' button from /setup.
    """
    hash_key = "task.{}".format(task_id)
    instance_id = redis_server.hget(hash_key, 'instance')

    if instance_id:
        aliyun_scale_down(instance_id)

    if hash_key:
        redis_server.delete(hash_key)

    return jsonify({
        'status': 'OK',
        'message': 'task {} deleted.'
    })


@application.route('/jobs/<string:instance_id>', methods=['POST'])
def checkin(instance_id):
    """ The scaled instance will call this api to adopt a task.
    """
    task_id = pop_building_task()
    if task_id is None:
        aliyun_scale_down(instance_id)
        return jsonify({'status': 'Error', 'message': 'No task in queue'})

    start_time = request.args.get('start')
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


@application.route('/jobs/<string:instance_id>', methods=['PUT'])
def checkout(instance_id):
    """ The scaled instance will call this api to update clustering status.
    """
    task_id = request.args.get('task_id')
    action = request.args.get('action')
    end_time = request.args.get('end')

    hash_key = "task.{}".format(task_id)

    if action == 'check':
        update_sql_status(task_id, 'stage2')
        redis_server.hset(hash_key, 'end1', end_time)
    elif action == 'checkout':
        update_sql_status(task_id, 'analyze')
        redis_server.hset(hash_key, 'end2', end_time)
 
        aliyun_scale_down(instance_id)
        queuing_tasks = get_queuing_tasks()
        if len(queuing_tasks) > 0:
            time.sleep(120)
            start(queuing_tasks[0])
    return jsonify({'status': 'OK'})


@application.route('/tasks/<string:task_id>', methods=['PUT'])
def interrupt_task(task_id):
    ''' Set status to `Error` and scaled down the instance.
        Note: The request will come from belayer.
    '''
    hash_key = "task.{}".format(task_id)
    instance_id = redis_server.hget(hash_key, 'instance')

    update_sql_status(task_id, 'Error')
    aliyun_scale_down(instance_id)

    queuing_tasks = get_queuing_tasks()
    if len(queuing_tasks) > 0:
        time.sleep(120)
        start(queuing_tasks[0])

    return jsonify({
        'status': 'OK',
        'message': 'task {} deleted.'
    })


@application.route('/tasks', methods=['GET'])
def list_tasks():
    task_dict = {}
    keys = [k for k in redis_server.keys() if k != 'crackit']
    for k in keys:
        task_dict[k] = redis_server.hgetall(k)
    return jsonify({'data': task_dict})


@application.route('/tasks/<string:task_id>', methods=['GET'])
def get_task_detail(task_id):
    hash_key = "task.{}".format(task_id)
    try:
        instance = redis_server.hget(hash_key, 'instance')
        cthr = redis_server.get(hash_key, 'cthr')
        gthr = redis_server.get(hash_key, 'gthr')
        start = redis_server.get(hash_key, 'start')
        end1 = redis_server.get(hash_key, 'end1')
        end2 = redis_server.get(hash_key, 'end2')
        data = {'cthr': cthr, 'gthr': gthr, 'start': start, 'end1': end1, 'end2': end2, 'instance': instance}
        msg = {'status': 'OK', 'data': data}
    except:
        msg = {'status': 'Error', 'message': 'No such task in queue.'}
    finally:
        return jsonify(msg)


def aliyun_scale_up():
    counter = 0
    resp_obj = {'status': 'Failed'}
    while True:
        if counter > 10:
            break
        aliyun_action = Aliyun('ExecuteScalingRule')
        action_resp = aliyun_action.request()
        if 'Code' in action_resp:
            time.sleep(60)
            counter += 1
        else:
            resp_obj['status'] = 'Successed'
            break
    return resp_obj

def aliyun_scale_down(instance_id):
    counter = 0
    resp_obj = {'status': 'Failed'}
    while True:
        if counter > 10:
            break
        aliyun_action = Aliyun('RemoveInstances', instance_id)
        action_resp = aliyun_action.request()
        if 'Code' in action_resp:
            time.sleep(60)
            counter += 1
        else:
            resp_obj['status'] = 'Successed'
            break
    return resp_obj


if __name__ == '__main__':
    application.run(host='0.0.0.0', port=8011, debug=True)


