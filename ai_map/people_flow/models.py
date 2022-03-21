from django.db import models

# Create your models here.

class Population(models.Model):
    mesh1kmid = models.CharField(max_length=100)
    prefcode = models.IntegerField()
    citycode = models.IntegerField()
    year = models.IntegerField()
    month = models.IntegerField()
    dayflag = models.IntegerField()
    timezone = models.IntegerField()
    population = models.IntegerField()
    lon_center = models.FloatField()
    lat_center = models.FloatField()
    lon_max = models.FloatField()
    lat_max = models.FloatField()
    lon_min = models.FloatField()
    lat_min = models.FloatField()
