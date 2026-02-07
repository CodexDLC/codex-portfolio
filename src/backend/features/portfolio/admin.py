from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import Category, Project

@admin.register(Category)
class CategoryAdmin(TranslationAdmin):
    list_display = ('name', 'slug', 'section_title', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'section_title')

@admin.register(Project)
class ProjectAdmin(TranslationAdmin):
    list_display = ('title', 'category', 'status', 'project_type', 'views_count', 'likes_count', 'is_featured', 'is_active', 'order')
    list_filter = ('category', 'status', 'project_type', 'is_featured', 'is_active', 'tags')
    search_fields = ('title', 'description', 'slug')
    list_editable = ('order', 'is_active', 'is_featured')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('tags',)
    
    fieldsets = (
        ('Main Info', {
            'fields': ('category', 'title', 'slug', 'is_active', 'order')
        }),
        ('Content', {
            'fields': ('description', 'content')
        }),
        ('Visual', {
            'fields': ('style_visual',) 
        }),
        ('Meta', {
            'fields': ('status', 'project_type', 'tags')
        }),
        ('Links', {
            'fields': ('link_demo', 'link_github')
        }),
        ('Stats', {
            'fields': ('views_count', 'likes_count', 'is_featured')
        }),
    )
