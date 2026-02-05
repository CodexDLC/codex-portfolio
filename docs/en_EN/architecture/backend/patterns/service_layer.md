# 🧠 Service Layer Pattern

[⬅️ Back](../README.md) | [🏠 Docs Root](../../../../README.md)

> **GOAL:** Keep `views.py` thin and logic testable.
> **RULE:** Views should only handle HTTP (request/response). Logic goes here.

## 1. The Separation

We split business logic into two distinct types of functions: **Selectors** and **Services**.

| Type | Path | Purpose | Side Effects? |
| :--- | :--- | :--- | :--- |
| **Selectors** | `apps/*/selectors.py` | Fetching data (Reading). | ❌ NO (ReadOnly) |
| **Services** | `apps/*/services.py` | Changing data (Writing). | ✅ YES (Create/Update) |

## 2. Selectors (Reading)

Functions that return QuerySets, Lists, or DTOs. They never modify the DB.

```python
# apps/portfolio/selectors.py

def get_featured_projects() -> QuerySet[Project]:
    """Returns all visible featured projects ordered by priority."""
    return Project.objects.filter(
        is_featured=True,
        is_visible=True
    ).select_related('category')
```

## 3. Services (Writing)

Functions that handle use-cases. They take raw arguments, validate them, and perform the action.

```python
# apps/main/services.py

def create_contact_message(*, name: str, email: str, text: str) -> ContactMessage:
    """Creates a message and triggers email notification."""
    msg = ContactMessage.objects.create(
        name=name,
        email=email,
        text=text
    )
    
    # Logic for email sending goes here (or triggers a task)
    email_service.send_notification(msg)
    
    return msg
```

## 4. Usage in Views

The View simply calls the service/selector.

```python
class HomeView(TemplateView):
    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        # Usage
        ctx['projects'] = get_featured_projects()
        return ctx
```