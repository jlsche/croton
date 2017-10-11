FROM frolvlad/alpine-python3:latest

MAINTAINER jlsche <jlsche@lingtelli.com.com>

#RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple redis
#RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple flask
#RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pymysql
#RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pymongo
#RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple requests

RUN pip install redis
RUN pip install flask
RUN pip install pymysql
RUN pip install pymongo
RUN pip install requests

ADD volume /code	
WORKDIR /code


