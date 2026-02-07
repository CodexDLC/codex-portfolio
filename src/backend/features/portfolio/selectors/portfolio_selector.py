import logging

from django.shortcuts import get_object_or_404

from ..models.category import Category
from ..services.layout import LayoutService

logger = logging.getLogger(__name__)


def get_portfolio_context(category_slug=None, page_number=1):
    """
    Returns context for the portfolio page:
    - active_category: Current category object
    - projects: List of project dicts (with sizes and data) for the current page
    - categories: All active categories (for tabs)
    - page_obj: Page object mock (for template pagination)
    """
    categories = Category.objects.filter(is_active=True).order_by('order')

    if category_slug:
        active_category = get_object_or_404(Category, slug=category_slug)
    else:
        active_category = categories.first()

    logger.debug("Active category: %s", active_category)

    projects = []
    total_pages = 1
    has_next = False
    has_previous = False

    if active_category:
        try:
            page_number = int(page_number)
        except (ValueError, TypeError):
            page_number = 1

        projects, total_pages = LayoutService.get_page_data(active_category.slug, page_number)
        logger.debug("LayoutService returned %d projects for page %d (total: %d)",
                      len(projects) if projects else 0, page_number, total_pages)

        if projects is None:
            projects = []
            
        has_next = page_number < total_pages
        has_previous = page_number > 1
    
    page_obj = PageObjMock(page_number, has_next, has_previous, total_pages)

    return {
        'active_category': active_category,
        'projects': projects,
        'page_obj': page_obj,
        'categories': categories,
    }


class PageObjMock:
    def __init__(self, number, has_next, has_previous, total_pages):
        self.number = number
        self.has_next = has_next
        self.has_previous = has_previous
        self.paginator = type('PaginatorMock', (), {'num_pages': total_pages})()
        
    def next_page_number(self):
        return self.number + 1
        
    def previous_page_number(self):
        return self.number - 1
