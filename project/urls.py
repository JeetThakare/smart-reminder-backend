from django.urls import path

from . import views

urlpatterns = [
    # /bart/
    path('', views.index, name='index'),
    # ex: /project/reminders
    path('reminders/', views.reminders, name='reminders'),
    # ex: /project/createreminder
    path('createreminder', views.createreminders, name='createreminders'),
]