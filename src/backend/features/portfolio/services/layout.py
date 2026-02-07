import logging
import random

from django.core.cache import cache
from django.db.models import F

from ..models.project import Project

logger = logging.getLogger(__name__)

# Bento layout patterns for 6 items per page.
# Slot order maps to project weight order (heaviest project gets first slot).

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
        Returns data for a specific page (slide) from cache.
        Builds and caches a new layout for the entire category on cache miss.
        """
        cache_key = f"portfolio:layout:v3:{category_slug}"
        layout_data = cache.get(cache_key)

        if not layout_data:
            logger.debug("Cache miss for %s, building layout", cache_key)
            layout_data = LayoutService._build_and_cache_layout(category_slug)
            cache.set(cache_key, layout_data, CACHE_TIMEOUT)
        else:
            logger.debug("Cache hit for %s", cache_key)

        total_pages = len(layout_data['pages'])
        
        if page_number < 1 or page_number > total_pages:
            logger.debug("Page %d out of range (total: %d)", page_number, total_pages)
            return None, total_pages

        page_items = layout_data['pages'][page_number - 1]['items']
        
        return page_items, total_pages

    @staticmethod
    def _build_and_cache_layout(category_slug):
        """
        Builds layout structure for an entire category:
        loads projects, calculates weight, sorts, paginates, applies bento patterns.
        """
        # Используем новый менеджер active() и with_weight()
        # include_order=True, так как внутри категории важна ручная сортировка
        projects = Project.objects.active().filter(
            category__slug=category_slug
        ).select_related(
            'style_visual'
        ).prefetch_related(
            'tags'
        ).with_weight(
            include_order=True
        ).order_by('-weight', '-created_at')
        
        logger.debug("Found %d projects for category %s", projects.count(), category_slug)

        # Convert ORM objects to dicts for Redis cache (pickle-safe, no lazy queries)
        projects_data = []
        for p in projects:
            projects_data.append({
                'id': p.id,
                'title': p.title,
                'description': p.description,
                'status': p.status,
                'project_type': p.get_project_type_display(),
                'link_github': p.link_github,
                'link_demo': p.link_demo,
                'tags': [{'name': t.name, 'category': t.category} for t in p.tags.all()[:3]],
                'style_visual': p.style_visual.css_class if p.style_visual else 'visual-theme-ghost',
            })

        chunk_size = 6
        pages = []

        if not projects_data:
             return {'pages': []}
        
        for i in range(0, len(projects_data), chunk_size):
            chunk = projects_data[i : i + chunk_size]
            
            # Pick bento pattern: random for full pages, uniform for partial
            if len(chunk) == chunk_size:
                pattern_key = random.choice(['standard', 'twin_giants', 'uniform', 'chaos'])
            else:
                pattern_key = 'uniform'

            pattern = PATTERNS[pattern_key]
            
            # Assign size classes from pattern slots to projects (by weight order)
            for idx, project in enumerate(chunk):
                if idx < len(pattern['slots']):
                    project['layout_class'] = pattern['slots'][idx]
                else:
                    project['layout_class'] = 'size-m'

            pages.append({
                'pattern_name': pattern['name'],
                'items': chunk
            })

        return {'pages': pages}
