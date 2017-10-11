#-*- coding: utf-8 -*-
from django.http import HttpResponseRedirect
import requests
import pymysql
import json
from datetime import datetime
from django.shortcuts import render
from django.http import StreamingHttpResponse
from django.http import HttpResponse
from django.template import loader
from django.contrib import messages
import subprocess
import os
import pytz
from datetime import datetime, timedelta

from pathlib import Path
from django.templatetags.static import static

PROJECT_DIR = Path(__file__).resolve().parent.parent
BASE = os.path.dirname(os.path.abspath(__file__))

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

def connect_mysql():
    #db =  pymysql.connect(host='localhost', user='lingtelli', passwd='lingtellimi4ma3', db='croton', charset='utf8')
    db =  pymysql.connect(host='mysql', user='lingtelli', passwd='lingtelli', db='croton', charset='utf8')
    #db =  pymysql.connect(host='192.168.10.116', user='lingtelli', passwd='lingtelli', db='croton', charset='utf8')
    dbc = db.cursor()
    dbc.execute('SET NAMES utf8;')
    dbc.execute('SET CHARACTER SET utf8;')
    dbc.execute('SET character_set_connection=utf8;')
    return db

def get_current_index(cur):
    cur.execute("select `AUTO_INCREMENT` from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA = 'croton' and TABLE_NAME = 'CrotonTemplate'")
    for row in cur:
        return row[0]+1

# not working
def is_utf8(path):
    command = "file %s" % path
    procs = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE,)
    file_detail = procs.communicate()[0].decode()
    if 'UTF' not in file_detail:
        return False
    else:
        return True

def handle_uploaded_file(f, path):
    print('in handle, path:', path)
    with open(path, 'wb+') as dest:
        for chunk in f.chunks():
            dest.write(chunk)
    return True
    #return is_utf8(path)

def is_valid_csv(dir_id):
    resp = requests.get('http://118.178.253.10/check_format/' + str(dir_id)).text
    print("resp of is_valid_csv", resp)
    if 'OK' in resp:
        return True
    else:
        return False

def insert_db(conn, index, name, count):
    conn.cursor().execute("insert into CrotonTemplate (id, name, lang, raw_count, status) values (%s, %s, %s, %s, %s)", (index, name, 'zhcn', count, 'init_cluster'))
    conn.commit()

def get_dest_path(fname, index):
    dest_path = str(PROJECT_DIR) + static('data/' + str(index) + '/' + fname)
    return dest_path
    return os.path.join(BASE,'data/'+str(index)+'/'+fname)

def check(request):
    return HttpResponse("Error:")

def crotonNum(request, num):
    # View code here...
    return render(request, 'croton_index.html', {"foo": "bar"},
        content_type="text/html")

def croton(request):
    # View code here...
    t = loader.get_template('croton_index.html')
    c = {'foo': 'bar'}
    return HttpResponse(t.render(c, request),
        content_type="text/html")

def croton_test(request):
    # View code here...
    t = loader.get_template('croton_index_test.html')
    c = {'foo': 'bar'}
    return HttpResponse(t.render(c, request),
        content_type="text/html")

def create_post(request):
    if request.method == 'POST':
        post_text = request.POST.get('text')
        response_data = {}

        #post = Post(text=post_text, author=request.user)
        #post.save()

        response_data['result'] = 'Create post successful!'
        response_data['post_text'] = post_text
        #response_data['postpk'] = post.pk
        #response_data['text'] = post.text
        #response_data['created'] = post.created.strftime('%B %d, %Y %I:%M %p')
        #response_data['author'] = post.author.username

        return HttpResponse(
            json.dumps(response_data),
            content_type="application/json"
        )
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )

def big_file_download(request):
    # do something...
    def file_iterator(file_name, chunk_size=512):
        with open(file_name) as f:
            while True:
                c = f.read(chunk_size)
                if c:
                    yield c
                else:
                    break
    if request.method == 'GET':
        the_file_name = request.POST.get('name')
        response = StreamingHttpResponse(file_iterator(the_file_name))

        return response

def upload(request):
    conn = connect_mysql()
    index = get_current_index(conn.cursor())
    raw_utf_flag = True
    role_utf_flag = True
    pov_utf_flag = True
    pov_csv_flag = True

    if request.method == 'POST':
        rawdata = request.FILES['rawdata']
        role = request.FILES.get('role', None)
        pov = request.FILES.get('pov', None)
        name = request.POST.get('name')

        if rawdata is None:
            return HttpResponse('upload fail!')
        #dest_path = os.path.join(BASE,'data/'+str(index)+'/')
        dest_path = str(PROJECT_DIR) + static('data/' + str(index) + '/')
        if not os.path.exists(dest_path):
            os.makedirs(dest_path)

        raw_utf_flag = handle_uploaded_file(rawdata, get_dest_path('rawdata.csv', index))
        if role is not None:
            role_utf_flag = handle_uploaded_file(role, get_dest_path('role.csv', index))
        if pov is not None:
            pov_utf_flag = handle_uploaded_file(pov, get_dest_path('pov.csv', index))
            pov_csv_flag = is_valid_csv(index) 

        if not raw_utf_flag:
            messages.info(request, 'rawdata上傳失敗，請重新上傳符合UTF-8格式之檔案')
        if not role_utf_flag:
            messages.info(request, 'role上傳失敗，請重新上傳符合UTF-8格式之檔案')
        if not pov_utf_flag:
            messages.info(request, 'pov上傳失敗，請重新上傳符合UTF-8格式之檔案')
        if not pov_csv_flag:
            messages.info(request, 'pov上傳失敗，請重新上傳符合CSV格式之檔案')

        if raw_utf_flag and role_utf_flag and pov_utf_flag and pov_csv_flag:
            insert_db(conn, index, name, sum(1 for row in open(get_dest_path('rawdata.csv', index))))
        return HttpResponseRedirect('/setup/')

    return render(request, 'upload.html', content_type='text/html')

def setup(request):
    conn = connect_mysql()
    cur = conn.cursor()
    cur.execute("select * from CrotonTemplate order by create_time desc")
    templates = []
    processing_templates = []
    #base_url = 'http://localhost:3006/'
    base_url = 'http://118.178.253.10:3006/'
    watcher_url = 'http://192.168.10.16:8011/tasks'

    if request.method == 'POST':
        idx = request.POST.get('idx')
        atype = request.POST.get('type')
        tname = request.POST.get('name')
        dir_path = os.path.join(BASE, 'data/'+str(idx)+'/')
        if atype == "start_cluster":
            cthr = request.POST.get('cthr');
            gthr = request.POST.get('gthr');
            request_url = '{}/{}?cthr={}&gthr={}'.format(watcher_url, str(idx), cthr, gthr)
            res = requests.put(request_url)

            if res.json().get('status') == 'Error':
                print('Error when starting task {}, message: {}'.format(idx, res.json()))
                messages.info(request, res.json().get('message'))

            #res = requests.get(base_url + 'startClustering?csvfile=' + dir_path + 'rawdata.csv&clusterthreshold='+str(cthr)+'&groupthreshold='+str(gthr))
            #open(dir_path + "init", 'a+').close()
            print(base_url + 'startClustering?csvfile=' + dir_path + 'rawdata.csv')
            print(res.json())
        elif atype == "build_cluster":
            # no need this one
            res = requests.get(base_url + 'dumpMysql?template_id=' + str(idx))
            open(dir_path + "build", "a+").close()
            print(base_url + 'dumpMysql?template_id=' + str(idx))
            print(res.text)
        elif atype == "analyze":
            res = requests.get(base_url + 'newRecord?template_id=' + str(idx) + "&record=" + request.POST.get('record'))
            #open(dir_path + "analyze", "a+").close()
            print(base_url + 'newRecord?template_id=' + str(idx) + "&record=" + request.POST.get('record'))
            print(res.text)
        elif atype == "delete":
            print('delete')
            cur = conn.cursor()
            cur.execute("delete from CrotonTemplate where id = " + str(idx))
            conn.commit()
            request_url = '{}/{}'.format(watcher_url, str(idx))
            res = requests.delete(request_url)
        elif atype == "shift":
            print('shift', dir_path)
            res = requests.get(base_url + 'taskshift?task_path=' + dir_path)
            print(res.text)
        return HttpResponseRedirect('/setup/')

    #processing_queue = json.loads(requests.get(base_url + 'queueorder').text)['neworder']
    #processing_queue = [int(x[len(BASE)+6: -1]) for x in processing_queue]
    processing_queue = []

    for row in cur:
        item = {}
        item["index"] = row[0]
        item["name"] = row[1]
        #item["time"] = row[4]
        item["row"] = row[5]
        item["p_order"] = 0 # queue order in of the item if it's processing
        item["status"] = row[6]
    
        date_object = pytz.timezone('Asia/Shanghai').localize(row[4])
        #date_object = date_object + timedelta(hours=8)
        #item["time"] = date_object.strftime('%Y{y}%m{m}%d{d} %H:%M:%S').format(y=u'年'.encode('utf8'), m=u'月'.encode('utf8'), d=u'日'.encode('utf8'))
        item["time"] = date_object.strftime('%Y{y}%m{m}%d{d} %H:%M:%S').format(y='/', m='/', d='/')

        dir_path = os.path.join(BASE, 'data/'+str(row[0])+'/')

        
        """
        if os.path.exists(dir_path + "error.log"):
            with open(dir_path + 'error.log', 'r') as elog:
                data=elog.read().replace('\n', '')
                item["action"] = data
        elif not os.path.exists(dir_path + "cluster_result.csv"):
            if not os.path.isfile(dir_path + "init"):
                item["action"] = "init_cluster"
                #open(dir_path + "init", 'a+').close()
            else:
                item["action"] = "wait_cluster"
        elif not os.path.exists(dir_path + 'cluster_finish'):
            if not os.path.isfile(dir_path + "build"):
                item["action"] = "build_cluster"
                #open(dir_path + "build", "a+").close()
            else:
                item["action"] = "wait_build"
        else:
            if not os.path.isfile(dir_path + "analyze"):
                item["action"] = "analyze"
                #open(dir_path + "analyze", "a+").close()
            else:
                item["action"] = "done"
        """
        item["action"] = item["status"]

        '''
        if item['index'] in processing_queue:
            item['p_flag'] = processing_queue.index(item['index'])
            processing_templates.append(item)
        else:
            templates.append(item)
        '''
        templates.append(item)

    templates = fix_order(processing_templates, processing_queue, templates)
    return render(request, 'setup.html', {"templates": templates}, content_type='text/html')

def fix_order(p_templates, que, templates):
    if len(que) > 1:
        p_templates.sort(key=lambda x: que.index(x['index']))
    return p_templates + templates


"""


$.ajax({
    url : "../post/", // the endpoint
    method : "POST", // http method
    data : {
        text : "test to post !!! ",
        csrfmiddlewaretoken : csrf

    }, // data sent with the post request

    // handle a successful response
    success : function(json) {
        
        console.log(json); // log the returned json to the console
        console.log("success"); // another sanity check
    },

    // handle a non-successful response
    error : function(xhr,errmsg,err) {
        $('body').html(xhr.responseText); // add the error to the dom
    }
});


"""
