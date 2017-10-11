from django.conf.urls import include, url
from django.contrib import admin
from console import views as croton_view

urlpatterns = [
	url(r'^$', croton_view.croton),
    url(r'^console/', croton_view.index),
    url(r'^croton/$', croton_view.croton),
    url(r'^croton_test/$', croton_view.croton_test),
    url(r'^croton/([\d])+/$', croton_view.crotonNum),
    url(r'^data/$', croton_view.upload),
    url(r'^setup/$', croton_view.setup),
    url (r'^croton/post/$', croton_view.create_post),
    url (r'^croton/rawdata/$', croton_view.big_file_download),
    url(r'^admin/', admin.site.urls),
]
