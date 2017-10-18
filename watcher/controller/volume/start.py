import time
import redis
import pymysql
from aliyun import Aliyun
from flask import Flask, request, jsonify

application = Flask(__name__)


# task: 按下分析按鈕後，尚未被機器領養前
# job: 被機器領養處理中

status_code = {
    0: 'vm built',
    2: 'preprocessing_raw_data',
    3: 'clustering_step1',
    4: 'clustering_step2',
    5: 'writing result to db',
    6: 'done'
}

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

def check_serving_status(task_id):
    conn = connect_mysql()
    cur = conn.cursor()
    query_string = 'SELECT raw_count from CrotonTemplate WHERE id = {};'.format(task_id)
    cur.execute(query_string)
    task_row_count = list(cur)[0][0]
    
    cur = conn.cursor()
    query_string = 'SELECT SUM(raw_count), COUNT(*) from CrotonTemplate WHERE status in ("building", "stage1", "stage2");'
    cur.execute(query_string)

    row = list(cur)[0]
    processing_row_count = row[0]
    processing_vm_count = row[1]

    if processing_row_count is None:
        processing_row_count = 0

    if (processing_row_count + task_row_count > 6000001):
        return 'Maximum row count exceeded. Currently {}.'.format(processing_row_count)
    if (processing_vm_count > 6):
        return 'Maximum instance count exceeded. Currently {}.'.format(processing_vm_count)
    else:
        return 'available'


@application.route('/tasks/<int:task_id>', methods=['POST'])
def add_task(task_id):
    """
        Receive job from websit, then add task to redis queue.

        Argus:
            task_id: Id of the task, int.
    """

    cthr = request.args.get('cthr')
    gthr = request.args.get('gthr')
    hash_key = 'job.{}'.format(task_id) 

    #redis_server.hset(hash_key, 'task_id', task_id)
    redis_server.hset(hash_key, 'cthr', cthr)
    redis_server.hset(hash_key, 'gthr', gthr)
    redis_server.lpush('queue:jobs', task_id)

    update_sql_status(task_id, 'queuing')

    return jsonify({
        'status': 'OK',
    })


@application.route('/tasks/<int:task_id>', methods=['GET'])
def scale_instance(task_id):
    serving_status = check_serving_status(task_id)

    if serving_status != 'available':
        return jsonify({
            'status': 'Queuing',
            'message': serving_status
        })

    update_sql_status(task_id, 'building')
    resp = aliyun_scale_up()
    print('msg from aliyun_scale_up:', resp)
    return jsonify(resp)


@application.route('/tasks/<int:task_id>', methods=['DELETE'])
def del_task(task_id):
    """
        Receive job from websit and delete task from redis queue.

        Argus:
            task_id: Id of the task, int.
        Returns:
            resp: Add success, bool.
    """
    resp = redis_server.lrem('queue:jobs', num=1, value=task_id)
    hash_key = 'job.{}'.format(task_id) 
    redis_server.delete(hash_key)
    return jsonify(redis_server.lrange('queue:jobs', 0, -1))


@application.route('/jobs/<string:instance_id>', methods=['POST'])
def check_in(instance_id):
    """
        Receive call from scaled instance and assign job.

        Argus:
            instance_id: Instance id of the instance, str.
        Returns:
            status: Status statement, str.
            task_id: Task id for the instance, int.
    """
    task_id = redis_server.rpop('queue:jobs')
    if task_id is None:
        return jsonify({'status': 'Error', 'message': 'No jobs in queue'})

    start_time = request.args.get('start_time')

    hash_key = "job.{}".format(task_id)
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
    """
        Receive call from scaled instance and shut instance down.

        Argus:
            instance_id: Instance id of the instance, str.
        Returns:
            activity_id: Activity if of the shutdown event, str.
    """
    action = request.args.get('action')
    end_time = request.args.get('end_time')

    hash_key = "job.{}".format(task_id)
    redis_server.hset(hash_key, 'end', end_time)
    instance_id = redis_server.hget(hash_key, 'instance')

    if action == 'checkout':
        status = 'analyze'
    elif action == 'check':
        status = 'stage2'
    update_sql_status(task_id, status)
 
    if action == 'checkout':
        aliyun_scale_down(instance_id)

        task_id = redis_server.rpop('queue:jobs')
        if task_id:
            time.sleep(60)
            scale_instance(task_id)
    return jsonify({'status': 'OK'})


@application.route('/quit/<string:task_id>', methods=['PUT'])
def force_quit(task_id):
    hash_key = "job.{}".format(task_id)
    instance_id = redis_server.hget(hash_key, 'instance')

    update_sql_status(task_id, 'Error')
    stop_instance(instance_id)

    return jsonify({
        'status': 'OK',
        'message': 'Shutting down instance.'
    })


@application.route('/jobs', methods=['GET'])
def list_jobs():
    job_dict = {}
    for job in redis_server.keys():
        if job.startswith("job"):
            job_dict[job] = redis_server.hgetall(job)
    return jsonify(job_dict)


@application.route('/tasks', methods=['GET'])
def list_queues():
    return jsonify({
        'size': len(redis_server.lrange('queue:jobs', 0, -1)),
        'members': redis_server.lrange('queue:jobs', 0, -1)
    })


@application.route('/jobs/<string:task_id>', methods=['GET'])
def get_job_detail(task_id):
    hash_key = "job.{}".format(task_id)
    try:
        cthr = redis_server.hget(hash_key, 'cthr')
        gthr = redis_server.hget(hash_key, 'gthr')
        msg = {'status': 'OK', 'cthr': cthr, 'gthr': gthr}
    except:
        msg = {'status': 'Error', 'message': 'No such job in queue.'}
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


