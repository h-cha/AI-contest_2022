from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

# Create your views here.

def index(request):
    return render(request, 'people_flow/index.html')

def route(request):
    return render(request, 'people_flow/route.html')