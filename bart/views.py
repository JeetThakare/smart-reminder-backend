from django.shortcuts import render
from django.http import JsonResponse
import requests
import json

# Create your views here.
BARTAPIS = {'STATIONS':'http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y',
            'STATIONDETAIL':'http://api.bart.gov/api/stn.aspx?cmd=stninfo&orig={}&key=MW9S-E7SL-26DU-VV8V&json=y',
            'TRPIS':'http://api.bart.gov/api/sched.aspx?cmd=depart&orig={}&dest={}&date=now&key=MW9S-E7SL-26DU-VV8V&b=0&a=4&l=1&json=y',
            }


def index(request):
    return render(request,'index2.html')


def stations(request):
    resp = {}
    try:
        response = requests.get(BARTAPIS['STATIONS'])
        json_resp = json.loads(response.text)
        resp = {'data':json_resp['root']['stations'], 'success':True}
    except Exception:
        resp = {'data':[], 'success':False}
    return JsonResponse(resp)

def station(request, source):
    resp = {}
    try:
        if not source:
            resp = {'success':False, 'error':"No source found"}
            # raise ValueError("No source found")
        else:
            response = requests.get(BARTAPIS['STATIONDETAIL'].format(source))
            json_resp = json.loads(response.text)
            resp = {'data':json_resp['root']['stations']['station'], 'success':True}
    except Exception:
        resp = {'data':[], 'success':False}
    return JsonResponse(resp)

def trips(request, source, dest):
    print(source,dest)
    resp = {}
    try:
        if not source or not dest:
            resp = {'success':False, 'error':"No source/dest found"}
        else:
            response = requests.get(BARTAPIS['TRPIS'].format(source, dest))
            json_resp = json.loads(response.text)
            resp = {'data':json_resp['root']['schedule'], 'success':True}
    except Exception:
        resp = {'data':[], 'success':False}
    # print(resp)
    return JsonResponse(resp)