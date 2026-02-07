import random
from django.core.cache import cache
from django.db.models import F
from ..models.project import Project

# --- BENTO PATTERNS ---
# Определяем схемы раскладки для 6 элементов.
# Порядок размеров важен для визуальной сетки.
# ВНИМАНИЕ: Порядок проектов (по весу) накладывается на этот порядок слотов.
# Если слот 2 - маленький, то 2-й по важности проект будет маленьким.

PATTERNS = {
    'standard': {
        'name': 'Standard',
        'slots': ['size-xl', 'size-l', 'size-l', 'size-l', 'size-m', 'size-m']
    },
    'twin_giants': {
        'name': 'Twin Giants',
        # FIX: Updated order to match debug template (XL, M, M, XL, M, M)
        'slots': ['size-xl', 'size-m', 'size-m', 'size-xl', 'size-m', 'size-m']
    },
    'uniform': {
        'name': 'Uniform',
        'slots': ['size-l', 'size-l', 'size-l', 'size-l', 'size-l', 'size-l']
    },
    'chaos': {
        'name': 'Chaos Mix',
        # FIX: Updated order to match debug template (M, L, XL, M, L, L)
        'slots': ['size-m', 'size-l', 'size-xl', 'size-m', 'size-l', 'size-l'] 
    }
}

CACHE_TIMEOUT = 3600 # 1 hour

class LayoutService:
    @staticmethod
    def get_page_data(category_slug, page_number):
        """
        Возвращает данные для конкретной страницы (слайда) из кэша.
        Если кэша нет, генерирует новый лейаут для всей категории.
        """
        # FIX: Changed cache key version to invalidate old empty cache
        cache_key = f"portfolio:layout:v3:{category_slug}" # v3 for new patterns
        layout_data = cache.get(cache_key)

        if not layout_data:
            print(f"[LayoutService] Cache miss for {cache_key}. Building layout...")
            layout_data = LayoutService._build_and_cache_layout(category_slug)
            cache.set(cache_key, layout_data, CACHE_TIMEOUT)
        else:
            print(f"[LayoutService] Cache hit for {cache_key}")

        # Пагинация из кэшированных данных
        # layout_data['pages'] - это список списков (страниц)
        total_pages = len(layout_data['pages'])
        
        if page_number < 1 or page_number > total_pages:
            print(f"[LayoutService] Page {page_number} out of range (Total: {total_pages})")
            return None, total_pages # Страница не найдена

        # Индекс массива 0-based
        page_items = layout_data['pages'][page_number - 1]['items']
        
        return page_items, total_pages

    @staticmethod
    def _build_and_cache_layout(category_slug):
        """
        Генерирует структуру для всей категории:
        1. Загружает проекты из БД.
        2. Считает вес.
        3. Сортирует.
        4. Разбивает на страницы.
        5. Применяет паттерны.
        6. Сериализует данные для кэша.
        """
        # 1. Загрузка и расчет веса
        # Вес = views + likes*5 + order*10 + is_featured*100
        projects = Project.objects.filter(
            category__slug=category_slug, 
            is_active=True
        ).annotate(
            weight=F('views_count') + F('likes_count') * 5 + F('order') * 10
        ).order_by('-is_featured', '-weight', '-created_at')
        
        print(f"[LayoutService] Found {projects.count()} projects for category {category_slug}")

        # Преобразуем в список словарей сразу, чтобы не хранить ORM объекты в кэше (это плохо для pickle)
        # И чтобы не делать запросы в БД при чтении кэша.
        projects_data = []
        for p in projects:
            projects_data.append({
                'id': p.id,
                'title': p.title,
                'description': p.description, # Short desc
                'status': p.status,
                'project_type': p.get_project_type_display(),
                'link_github': p.link_github,
                'link_demo': p.link_demo,
                'tags': [{'name': t.name, 'category': t.category} for t in p.tags.all()[:3]], # Top 3 tags
                'style_visual': p.style_visual.css_class if p.style_visual else 'visual-theme-ghost',
                # style_layout мы назначим сами
            })

        # 2. Разбиение на страницы (Chunks of 6)
        chunk_size = 6
        pages = []
        
        # Если проектов 0, создаем пустую страницу или возвращаем пустой список
        if not projects_data:
             return {'pages': []}
        
        for i in range(0, len(projects_data), chunk_size):
            chunk = projects_data[i : i + chunk_size]
            
            # Если проектов меньше 6, добиваем филлерами (пока просто оставим как есть, Grid справится или добавим позже)
            # TODO: Add fillers logic here if needed
            
            # 3. Выбор паттерна
            pattern_key = 'standard' # Default
            
            # Простая эвристика: если страница полная (6 шт), выбираем случайно
            if len(chunk) == 6:
                # FIX: Added 'chaos' to random choice
                pattern_key = random.choice(['standard', 'twin_giants', 'uniform', 'chaos'])
            else:
                # Если неполная, лучше Uniform (L), они лучше заполняют дыры
                pattern_key = 'uniform'

            pattern = PATTERNS[pattern_key]
            
            # 4. Назначение размеров
            # Мы предполагаем, что chunk уже отсортирован по важности (так как projects_data отсортирован)
            # Поэтому просто мапим слоты паттерна на проекты по порядку.
            
            for idx, project in enumerate(chunk):
                # Если проектов меньше, чем слотов, берем слот по индексу (или дефолт)
                if idx < len(pattern['slots']):
                    project['layout_class'] = pattern['slots'][idx]
                else:
                    project['layout_class'] = 'size-m' # Fallback

            pages.append({
                'pattern_name': pattern['name'],
                'items': chunk
            })

        return {'pages': pages}
