# coding: utf-8

import json
from pymongo import MongoClient
from flask import Flask, request
application = Flask(__name__)

@application.route('/log/<string:task_id>', methods=['POST'])
def log(task_id):
    data = json.loads(json.dumps(request.form))
    client = MongoClient('mongo')
    db = client['log']
    col_name = 'log_{}'.format(task_id)
    col = db[col_name]
    insert_result = col.insert_one(data)
    inserted_id = insert_result.inserted_id
    return str(inserted_id)
    


if __name__ == '__main__':
    application.run(host='0.0.0.0', port=3000, debug=True)
