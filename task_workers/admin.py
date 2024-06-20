from django.contrib import admin
from .models import WorkCategory, Tasker

class WorkCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

class TaskerAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone_number','aadhar_number', 'city', 'state', 'service_charge')
    search_fields = ('full_name', 'phone_number','aadhar_number', 'city', 'state')
    list_filter = ('city', 'state')
    filter_horizontal = ('tasks',)

admin.site.register(WorkCategory, WorkCategoryAdmin)
admin.site.register(Tasker, TaskerAdmin)
