from modeltranslation.translator import register, TranslationOptions
from .models import Category, Project

@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ('section_title',)

@register(Project)
class ProjectTranslationOptions(TranslationOptions):
    fields = ('title', 'description', 'content')
