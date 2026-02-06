
from django.urls import path
from .views import MainView, ExperienceView, ContactView




urlpatterns = [
    path("", MainView.as_view(), name="home"),
    path("experience/", ExperienceView.as_view(), name="experience"),
    path("contact/", ContactView.as_view(), name="contact"),
]
