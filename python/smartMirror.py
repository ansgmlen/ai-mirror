#!/usr/bin/env python
# -*- coding: utf-8 -*-
from tkinter import *
import urllib.request
import json
import requests
import datetime

from services.helper import * #this is how to import another file

##print(getDate())

## openweathermap api : https://home.openweathermap.org/api_keys
## key ba6bea63055e16232cde72d76b13baca

##this is how to make json object ##
#configs = json.loads('{"__type__":"Config", "basedUrl":"http://api.openweathermap.org/data/2.5/weather?","weatherApiKey":"ba6bea63055e16232cde72d76b13baca"}')
config = {"basedUrl":"http://api.openweathermap.org/data/2.5/weather?","weatherApiKey":"ba6bea63055e16232cde72d76b13baca"}

#print(configs['weatherApiKey'])
#print(configs['basedUrl'])
#print(HelperService.getTime())

class App:


    def __init__(self, master):

        frame = Frame(master)
        frame.pack()

##        self.frameDate = Frame(master, bg='red', width=100,height=100)
##        self.frameDate.pack(side=LEFT)

##        self.frameTemp = Frame(master, bg='blue',width=100,height=100)
##        self.frameTemp.pack(side=LEFT)

        self.labelDate = Label(master,text= HelperService.getDate())
        self.labelDate.pack(side=RIGHT)

        self.labelTime = Label(master, text=HelperService.getTime())
        self.labelTime.pack(side=LEFT)

        self.labelTemp = Label(master, text='Tempurature')
        self.labelTemp.pack()


##
##        self.button = Button(frame, text="QUIT", fg="red", command=frame.quit)
##        self.button.pack(side=LEFT)
##
##        self.btnWeather = Button(frame, text="Weather", command=self.getWeather)
##        self.btnWeather.pack(side=LEFT)




        self.getWeather()


    def getWeather(self):
        url = config['basedUrl'] + 'zip=76005,us&units=imperial&appid=' + config['weatherApiKey']

        data = requests.get(url=url)
        #print(data.json())
        jsonData = data.json() ##This is how to make json

        self.labelTemp['text'] = str(jsonData['main']['temp']) + '°'#°this is how to assign val


    def openCalendar(self):
        print('config: ' + config['basedUrl'])



root = Tk()
##root.resizable(width=False,height=False)
##root.geometry('{}x{}'.format(500, 500))

app = App(root)

root.mainloop()
root.destroy()
