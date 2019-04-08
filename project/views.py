from django.shortcuts import render
from project.models import *
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


latitude = '37.35'
longitude = '-121.95'
apiKey = 'eb10e6ea8a3098b4318b606204d932c7'

# Create your views here.

def index(request):
    return render(request,'indexproj.html')

def reminders(request):
    reminders = Reminders.get_all_reminders()
    wreminder = getWeatherReminder()
    if wreminder:
        reminders.append(wreminder)
    return JsonResponse({'data':reminders})

@csrf_exempt 
def createreminders(request):
    print(request.body)
    req_data = json.loads(request.body)
    reminder = req_data.get("reminder", "")
    print(reminder)
    show_on = datetime.strptime(req_data.get("show_on"), "%d-%b-%Y")
    created = Reminders.createreminder(reminder, show_on)
    if created:
        return JsonResponse({'data':Reminders.get_all_reminders(), 'status':True})
    return JsonResponse({'data':Reminders.get_all_reminders(), 'status':False})


def getWeatherReminder():
    config = Config.getConfig()
    code = 0
    if config:
        code = config.weather_code//100
    else:
        url = 'http://api.openweathermap.org/data/2.5/weather?lat='+latitude +'&lon='+longitude+'&APPID='+apiKey+'&units=metric'
        resp = requests.get(url)
        json_resp = json.loads(resp.text)
        code = int(json_resp['weather'][0]['id'])
    
    print(code)
    wreminder = None
    if code == 5:
        wreminder = {'id':100,'reminder': "Carry Umbrella", 'type':1}
    return wreminder