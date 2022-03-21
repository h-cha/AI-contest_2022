from django.urls import path
from . import views
urlpatterns = [
    # path('', views.index, name='index'),
    path('', views.route, name='route'),
    path('upload/', views.upload, name='upload'),
]
