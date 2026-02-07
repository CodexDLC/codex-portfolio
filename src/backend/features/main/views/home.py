from django.views.generic import TemplateView
from django.db.models import F
from ...portfolio.models import Category, Project

class MainView(TemplateView):
    template_name = "home/home.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # 1. Получаем категории
        categories = Category.objects.filter(is_active=True).order_by('order')
        
        top_projects = []
        
        # 2. Берем топ-1 из каждой категории
        for cat in categories:
            project = Project.objects.filter(
                category=cat, 
                is_active=True
            ).annotate(
                weight=F('views_count') + F('likes_count') * 5
            ).order_by('-weight').first()
            
            if project:
                # Сохраняем вес для сортировки
                project._weight = project.views_count + project.likes_count * 5
                top_projects.append(project)
                
        # 3. Сортируем эти проекты между собой по весу (самый крутой -> XL)
        top_projects.sort(key=lambda p: getattr(p, '_weight', 0), reverse=True)
        
        # Ограничиваем 5 штуками (оставляем место для ссылки)
        top_projects = top_projects[:5]
        
        # 4. Паттерн Standard: XL, L, L, L, M, M
        slots = ['size-xl', 'size-l', 'size-l', 'size-l', 'size-m', 'size-m']
        
        bento_items = []
        
        # 5. Заполняем проектами
        for i, proj in enumerate(top_projects):
            item = {
                'title': proj.title,
                'description': proj.description,
                'project_type': proj.get_project_type_display(),
                'style_visual': proj.style_visual.css_class if proj.style_visual else 'visual-theme-ghost',
                'tags': [{'name': t.name, 'category': t.category} for t in proj.tags.all()[:2]],
                'slug': proj.slug,
                'link_github': proj.link_github,
                'layout_class': slots[i],
                'is_project': True
            }
            bento_items.append(item)
            
        # 6. Добавляем карточку-ссылку "View All"
        if len(bento_items) < 6:
            idx = len(bento_items)
            link_card = {
                'title': 'System Registry',
                'description': 'Access full project database.',
                'project_type': 'ROOT',
                'style_visual': 'visual-theme-gold',
                'layout_class': slots[idx],
                'is_link': True,
                'url': '/portfolio/' # Ссылка на портфолио
            }
            bento_items.append(link_card)
            
        context['bento_items'] = bento_items
        return context
