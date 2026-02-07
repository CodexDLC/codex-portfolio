from django.views.generic import TemplateView
from django.shortcuts import render
from .selectors.portfolio_selector import get_portfolio_context
import logging

logger = logging.getLogger(__name__)

class PortfolioView(TemplateView):
    template_name = "portfolio/portfolio.html"

    def get(self, request, *args, **kwargs):
        # 1. Получаем параметры из запроса
        category_slug = request.GET.get('category')
        page_number = request.GET.get('page', 1)
        
        print(f"[PortfolioView] Request: category={category_slug}, page={page_number}, htmx={request.headers.get('HX-Request')}")

        # 2. Получаем контекст через селектор (он сам сходит в Redis/LayoutService)
        context = get_portfolio_context(category_slug, page_number)
        
        # Добавляем active_category_slug для подсветки табов (если он не пришел из селектора явно)
        if context.get('active_category'):
            context['active_category_slug'] = context['active_category'].slug

        # 3. Выбираем шаблон в зависимости от типа запроса (HTMX или обычный)
        # FIX: Use headers check instead of request.htmx to avoid dependency issues or IDE warnings
        if request.headers.get('HX-Request') == 'true':
            # Если это HTMX запрос (клик по табу или пагинация), отдаем только сетку
            return render(request, "portfolio/includes/grid.html", context)
        
        # Иначе отдаем полную страницу
        return render(request, self.template_name, context)
