# coding: utf-8

import time
import pymysql
import requests
from pymongo import MongoClient


quit_url = 'http://192.168.10.16:8011/quit'
mongo_client = MongoClient('mongo')
db = mongo_client['log']


def connect_mysql():
    db =  pymysql.connect(host='mysql', user='lingtelli', passwd='lingtelli', db='croton', charset='utf8')
    db_cursor = db.cursor()
    db_cursor.execute('SET NAMES utf8;')
    db_cursor.execute('SET CHARACTER SET utf8;')
    db_cursor.execute('SET character_set_connection=utf8;')
    return db

def get_working_tasks():
    conn = connect_mysql()
    cur = conn.cursor()
    query_string = 'SELECT id, status FROM CrotonTemplate where status in ("stage1")'
    cur.execute(query_string)
    tasks = list(cur)
    cur.close()
    conn.close()
    return tasks


def monitor_clustering():
    task_status = {}
    while True:
        working_tasks = get_working_tasks()
        _tasks = []
        for task in working_tasks:
            task_id = task[0]
            status = task[1]
            _tasks.append(task_id)
            col_name = 'log_{}'.format(task_id)
            col = db[col_name]
            count = col.count()
            if task_id not in task_status:
                task_status[task_id] = count
                continue
            print('id:', task_id, '\tstatus:', status, '\tcount:', count)
            if count > task_status[task_id]:
                task_status[task_id] = count
            else:
                res = requests.put('{}/{}'.format(quit_url, task_id))
                print('task {} should be terminated.'.format(task_id))

        diff = list(set(task_status.keys()) - set(_tasks))
        for _id in diff:
            del task_status[_id]
            print('task {} finished clustering'.format(_id))


        time.sleep(600)



if __name__ == '__main__':
    monitor_clustering()
