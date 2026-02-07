import logging

from django.views.generic import TemplateView
from django.shortcuts import render

from .selectors.portfolio_selector import get_portfolio_context

logger = logging.getLogger(__name__)


class PortfolioView(TemplateView):
    template_name = "portfolio/portfolio.html"

    def get(self, request, *args, **kwargs):
        category_slug = request.GET.get('category')
        page_number = request.GET.get('page', 1)

        logger.debug("Request: category=%s, page=%s, htmx=%s", category_slug, page_number, request.headers.get('HX-Request'))

        context = get_portfolio_context(category_slug, page_number)

        if context.get('active_category'):
            context['active_category_slug'] = context['active_category'].slug

        # Return partial template for HTMX requests, full page otherwise
        if request.headers.get('HX-Request') == 'true':
            return render(request, "portfolio/includes/grid.html", context)

        return render(request, self.template_name, context)
