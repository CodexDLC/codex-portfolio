# 🧪 Testing Standards

[⬅️ Back](README.md) | [🏠 Docs Root](../../../README.md)

> **TOOL:** `pytest` + `pytest-django`
> **GOAL:** High confidence, fast feedback.

## 1. Configuration

* **File:** `pyproject.toml`
* **Pattern:** We look for files named `test_*.py` or `*_test.py`.

## 2. Structure

Tests mimic the app structure.

```text
src/backend/apps/portfolio/
├── tests/
│   ├── __init__.py
│   ├── test_models.py      # Test constraints/methods
│   ├── test_selectors.py   # Test queries
│   └── test_views.py       # Test HTTP status/Integration
```

## 3. Rules

### A. Use Fixtures, Not Mocks (Mostly)
For Database tests, use `pytest.mark.django_db`. Create real objects using Model Factories (e.g. `baker.make` or `factory_boy`) to keep tests clean.

### B. Test the Service Layer
Focus testing on `services.py` and `selectors.py`. If these work, the Views (which are just glue) will likely work too.

### C. Example

```python
import pytest
from apps.portfolio.models import Project

@pytest.mark.django_db
def test_create_project_slug_generation():
    """Ensure slug is auto-generated from title."""
    project = Project.objects.create(title="My Cool App")
    assert project.slug == "my-cool-app"
```