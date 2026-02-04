from django.views.generic import TemplateView

# Create your views here.



class MainView(TemplateView):
    template_name = "home.html"




class ExperienceView(TemplateView):
    template_name = "experience.html"



class ContactView(TemplateView):
    template_name = "contact.html"
    