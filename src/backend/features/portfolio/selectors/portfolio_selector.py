from django.shortcuts import get_object_or_404
from ..models.category import Category
from ..services.layout import LayoutService

def get_portfolio_context(category_slug=None, page_number=1):
    """
    Возвращает контекст для страницы портфолио:
    - active_category: Текущая категория (объект)
    - projects: Список словарей проектов (с размерами и данными) для текущей страницы
    - categories: Список всех активных категорий (для табов)
    - page_obj: Имитация объекта страницы (для пагинации в шаблоне)
    """
    
    # 1. Получаем все активные категории для меню
    categories = Category.objects.filter(is_active=True).order_by('order')
    print(f"[Selector] Found {categories.count()} active categories")
    
    # 2. Определяем активную категорию
    if category_slug:
        active_category = get_object_or_404(Category, slug=category_slug)
    else:
        # Если слаг не передан, берем первую по сортировке
        active_category = categories.first()
        
    print(f"[Selector] Active category: {active_category}")
        
    # 3. Получаем данные страницы через LayoutService (из Redis)
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
        print(f"[Selector] LayoutService returned {len(projects) if projects else 0} projects for page {page_number} (Total pages: {total_pages})")
        
        if projects is None: # Страница не найдена
            projects = []
            
        has_next = page_number < total_pages
        has_previous = page_number > 1
    
    page_obj = PageObjMock(page_number, has_next, has_previous, total_pages)
    
    return {
        'active_category': active_category,
        'projects': projects, # Это теперь список словарей, а не QuerySet!
        'page_obj': page_obj,
        'categories': categories,
    }

# FIX: Moved class outside of function for cleaner code
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
