from flask import Flask, jsonify, request
import pymysql
application = Flask(__name__)


def connect_db():
  return pymysql.connect(host='mysql', user='lingtelli', password='lingtelli', db='croton', 
                         cursorclass=pymysql.cursors.DictCursor, charset='utf8')

@application.route('/')
def hello():
    return 'Hello World'

@application.route('/list', methods=['GET'])
def list():
  conn = connect_db()
  cursor = conn.cursor()
  cursor.execute('USE croton')

  template_id = request.args.get('tid')
  sql_str = 'select count(*) from CrotonGroup where template_id in ({})'.format(template_id)
  cursor.execute(sql_str)
  data = cursor.fetchall()
  return jsonify({'size': data})

@application.route('/tables', methods=['GET'])
def get_tables():
  conn = connect_db()
  cursor = conn.cursor()
  cursor.execute('USE croton')
  cursor.execute('SHOW TABLES')
  tables = cursor.fetchall()
  tables = list(tables)
  return jsonify({'tables': tables})

@application.route('/databases', methods=['GET'])
def get_databases():
  conn = connect_db()
  cursor = conn.cursor()
  cursor.execute('SHOW DATABASES')
  dbs = cursor.fetchall()
  dbs = list(dbs)
  return jsonify({'databases': dbs})

@application.route('/add', methods=['GET'])
def add():
  template_id = request.args.get('tid')
  keyword = request.args.get('keyword')
  role = request.args.get('role')
  sentence = request.args.get('sentence')
  total = request.args.get('total')

  conn = connect_db()
  cursor = conn.cursor()
  cursor.execute('USE croton')
  print("args: \n template_id: {}\n keyword: {}\n role: {}\n sentence: {}\n total: {}".format(template_id, keyword, role, sentence, total))
  sql_str = "INSERT INTO CrotonGroup (template_id, keyword, role, sentence, total) VALUES ({}, '{}', '{}', '{}', {});".format(int(template_id), keyword, role, sentence, int(total))
  print("SQL string:\n {}".format(sql_str))
  cursor.execute(sql_str)
  resp = cursor.fetchall()
  return jsonify({'response': resp, 'sql_str': sql_str})

@application.route('/auto_add_record', methods=['GET'])
def auto_add_record():
  conn = connect_db()
  cursor = conn.cursor()
  cursor.execute('USE croton')
  sql_str = "INSERT INTO CrotonGroup (template_id, keyword, role, sentence, total) VALUES (9999, 'ha', 'ha', 'ha', 9999);"
  print("SQL string:\n {}".format(sql_str))
  cursor.execute(sql_str)
  conn.commit()
  resp = cursor.fetchall()
  return jsonify({'response': resp, 'sql_str': sql_str})




if __name__ == "__main__":
    application.run(host='0.0.0.0', port=8000, debug=True)

