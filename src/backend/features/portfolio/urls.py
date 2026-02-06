from django.urls import path
from .views import PortfolioIndexView, PortfolioFragmentView

app_name = 'portfolio'

urlpatterns = [
    # Главная страница портфолио (Shell)
    path('', PortfolioIndexView.as_view(), name='index'),
    
    # HTMX фрагмент: возвращает только сетку проектов для категории
    path('fragments/<slug:category_slug>/', PortfolioFragmentView.as_view(), name='fragment'),
]
