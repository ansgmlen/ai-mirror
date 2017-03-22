from tkinter import *
import urllib.request
import json
import requests
import datetime
import threading
from time import gmtime, strftime, strptime

class Helper:
        
    def getDate(event):
        Now = datetime.datetime.today().strftime('%m/%d/%Y')
        Day = datetime.datetime.strptime(Now, '%m/%d/%Y').strftime('%A')
        return Now + ' ' + Day

    def set_interval(func, sec):
        def func_wrapper():
            set_interval(func, sec)
            func()
        t = threading.Timer(sec, func_wrapper)
        t.start()
        return t

    def getTime(event):
        hour = datetime.datetime.now().time().hour
        minute = datetime.datetime.now().time().minute
        second = datetime.datetime.now().time().second
        currentTime = str(hour) + ':' + str(minute)

        strTime = datetime.datetime.strptime(currentTime, "%H:%M") ## change string format
        t = strTime.strftime("%I:%M %p") ## change format       
        
        return t
        

HelperService = Helper()



##def set_interval(func, sec):
##    def func_wrapper():
##        set_interval(func, sec)
##        func()
##    t = threading.Timer(sec, func_wrapper)
##    t.start()
##    return t


##def getDate():
##    Now = datetime.datetime.today().strftime('%m/%d/%Y')
##    Day = datetime.datetime.strptime(Now, '%m/%d/%Y').strftime('%A')
##    #Time = datetime.datetime.now().time().hour
##    print(datetime.datetime.now().hour)

##    return Now + ' ' + Day
#
#def getTime():
    #Time = datetime.datetime.now()#/time()
#    hour = datetime.datetime.now().hour
#    mins = datetime.datetime.now().miniute
    
#    print(hour + ' '+ mins)
#    return hour + ' '+ mins
