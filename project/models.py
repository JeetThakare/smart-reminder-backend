from django.db import models
from datetime import datetime
import requests
import json

# Create your models here.

class Config(models.Model):
    weather_code = models.IntegerField()

    def __str__(self):
        return str(self.weather_code)
    
    @staticmethod
    def getConfig():
        return Config.objects.first()
        
class Reminders(models.Model):
    reminder = models.CharField(max_length=50)
    show_on = models.DateField()
    user_id = models.IntegerField()

    def __str__(self):
        return self.reminder

    @staticmethod
    def get_all_reminders():
        data = None
        try:
            today = datetime.today().date()
            print(today)
            remiders = Reminders.objects.filter(show_on=today)#.values()
            print(remiders)
            # print('----------------------')
            # print(remiders[0])
            data = [{'id':r.id,'reminder': r.reminder, 'type':''} for r in remiders]
            print(data)
        except Exception as e:
            print(str(e))
            return []
        return data
    
    @staticmethod
    def createreminder(reminder, show_on):
        try:
            new = Reminders()
            new.reminder = reminder
            new.show_on = show_on
            new.user_id = 1
            new.save()
        except Exception as e:
            print(str(e))
            return False
        return True
