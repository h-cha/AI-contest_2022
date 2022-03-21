from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from .models import Population
import csv
from io import TextIOWrapper, StringIO

# Create your views here.

def index(request):
    return render(request, 'people_flow/index.html')

def route(request):
    return render(request, 'people_flow/route.html')

def upload(request):
    if 'csv' in request.FILES:
        form_data = TextIOWrapper(request.FILES['csv'].file, encoding='utf-8')
        csv_file = csv.reader(form_data)
        for line in csv_file:
            population = Population.objects.create(mesh1kmid = line[0],prefcode = line[1],citycode = line[2],year = line[3],month = line[4],dayflag = line[5],timezone = line[6],population = line[7],lon_center = line[8],lat_center = line[9],lon_max = line[10],lat_max = line[11],lon_min = line[12],lat_min = line[13])
            population.save()

        return render(request, 'people_flow/upload.html')

    else:
        return render(request, 'people_flow/upload.html')