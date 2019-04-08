from django.urls import path

from . import views

urlpatterns = [
    # /bart/
    path('', views.index, name='index'),
    # ex: /bart/station/12TH/
    path('station/<source>/', views.station, name='station'),
    # ex: /bart/staions/
    path('stations/', views.stations, name='stations'),
    # ex: /bart/trips/12th/14th
    path('trips/<source>/<dest>', views.trips, name='vote'),
]