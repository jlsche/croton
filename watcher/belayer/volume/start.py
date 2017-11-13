# coding: utf-8

import time
import pymysql
import requests
from pymongo import MongoClient


#interrupt_url = 'http://192.168.10.16:8011/tasks'
interrupt_url = 'http://172.16.124.42:8011/tasks'
mongo_client = MongoClient('mongo')
db = mongo_client['log']


def connect_mysql():
    db = pymysql.connect(host='mysql', user='lingtelli', passwd='lingtelli', db='croton', charset='utf8')
    db_cursor = db.cursor()
    db_cursor.execute('SET NAMES utf8;')
    db_cursor.execute('SET CHARACTER SET utf8;')
    db_cursor.execute('SET character_set_connection=utf8;')
    return db

def get_stage1_tasks():
    conn = connect_mysql()
    cur = conn.cursor()
    query_string = 'SELECT id, status FROM CrotonTemplate where status in ("stage1")'
    cur.execute(query_string)
    tasks = list(cur)
    cur.close()
    conn.close()
    return tasks


def monitor_clustering(interval=1800):
    ''' Check if stage1 clustering is working by examing the log count.
        If the log count doesn't increment in a time interval,
        the function will call the interrupt api to stop the instance.
    '''
    task_log_count_dict = {}
    while True:
        stage1_tasks = get_stage1_tasks()
        current_monitoring_tasks = []
        for task in stage1_tasks:
            task_id = task[0]
            status = task[1]
            current_monitoring_tasks.append(task_id)
            col_name = 'log_{}'.format(task_id)
            col = db[col_name]
            log_count = col.count()

            # task just started clustering
            if task_id not in task_log_count_dict:
                task_log_count_dict[task_id] = log_count
                continue

            # task being monitoring
            if log_count > task_log_count_dict[task_id]:
                task_log_count_dict[task_id] = log_count
            else:
                res = requests.put('{}/{}'.format(interrupt_url, task_id))
                print('task {} should be interrupted.'.format(task_id))

        # Remove tasks finished clustering stage1
        diff = list(set(task_log_count_dict.keys()) - set(current_monitoring_tasks))
        for _id in diff:
            del task_log_count_dict[_id]
            print('task {} finished clustering'.format(_id))
        time.sleep(interval)



if __name__ == '__main__':
    monitor_clustering()
