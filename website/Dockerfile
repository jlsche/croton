FROM frolvlad/alpine-python3:latest

MAINTAINER jlsche <jlsche@lingtelli.com>

#RUN pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple django
#RUN pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple django-cors-headers
#RUN pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple requests
#RUN pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple pymysql
#RUN pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple flask
#RUN pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple pymongo

RUN pip3 install django
RUN pip3 install django-cors-headers
RUN pip3 install requests
RUN pip3 install pymysql
RUN pip3 install flask
RUN pip3 install pymongo

ADD volume/django /code
WORKDIR /code

#RUN mkdir -p /home/website
#RUN mkdir -p /home/logServer

#ADD django /home/website/
#ADD logServer /home/logServer/

#EXPOSE 8000
#EXPOSE 3000

#CMD ["python3", "/home/website/run.py"]
#CMD ["python3", "/home/website/manage.py runserver 0.0.0.0:8000"]

