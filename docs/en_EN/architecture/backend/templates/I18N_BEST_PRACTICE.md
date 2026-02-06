# 🌐 i18n Best Practice & Architecture

[⬅️ Back](../README.md) | [🏠 Docs Root](../../../../../README.md)

## Language Support

**Supported Languages:** EN (English), RU (Русский), DE (Deutsch)
**Default Language:** EN
**Direction:** LTR only (no RTL support currently)

## Language Selection Flow

```
User visits site
  ↓
Check Accept-Language header (browser settings)
  ↓
Match against LANGUAGES list (EN, RU, DE)
  ↓
If match found → Use selected language
  ↓
If no match → Fallback to EN
  ↓
Store in Django session / cookie for future visits
```

### Django Configuration

```python
# settings.py

LANGUAGE_CODE = 'en'  # Default

LANGUAGES = [
    ('en', 'English'),
    ('ru', 'Русский'),
    ('de', 'Deutsch'),
]

LOCALE_PATHS = [
    BASE_DIR / 'locale',
]

USE_I18N = True

MIDDLEWARE = [
    # ... other middleware
    'django.middleware.locale.LocaleMiddleware',  # Must be after Session
    # ... other middleware
]
```

## Backend i18n (Django)

### Using gettext_lazy in Python Code

```python
# views.py

from django.utils.translation import gettext_lazy as _

def contact_view(request):
    context = {
        'title': _('page_contact_title'),
        'form_label': _('contact_form_name'),
    }
    return render(request, 'contact.html', context)
```

### In Django Templates

```django
{% raw %}{% load i18n %}

<!-- Simple translation -->
<h1>{% trans "hero_title" %}</h1>

<!-- Alternative syntax -->
<h1>{% translate "hero_title" %}</h1>

<!-- With translation context (for disambiguating same words) -->
<button>{% trans "submit" context="form" %}</button>

<!-- Plural handling -->
{% blocktrans count counter=items %}
    You have 1 item.
{% plural %}
    You have {{ counter }} items.
{% endblocktrans %}

<!-- With variables -->
{% blocktrans with name=user.first_name %}
    Hello {{ name }}, welcome to CodexDLC!
{% endblocktrans %}{% endraw %}
```

### Generating `.po` Files

```bash
# Extract all translation strings from code and templates
python cli.py makemessages -l en -l ru -l de

# Compile .mo files for production (faster lookup)
python cli.py compilemessages
```

Generated files:

```
locale/
├── en/LC_MESSAGES/
│   ├── django.po      (English source file)
│   └── django.mo      (Compiled)
├── ru/LC_MESSAGES/
│   ├── django.po      (Russian translations)
│   └── django.mo      (Compiled)
└── de/LC_MESSAGES/
    ├── django.po      (German translations)
    └── django.mo      (Compiled)
```

## Frontend i18n (JavaScript)

### Loading Translations in Templates

```django
<script>
    const CURRENT_LANG = "{% raw %}{{ LANGUAGE_CODE }}{% endraw %}";
</script>

<!-- Load appropriate i18n JSON -->
<script>
    fetch(`/static/i18n/${CURRENT_LANG}.json`)
        .then(r => r.json())
        .then(data => {
            window.translations = data;
        });
</script>
```

### Helper Function

```javascript
// In base.js or global scope
function t(key) {
    if (!window.translations) {
        return key;  // Fallback if translations not loaded
    }
    return window.translations[key] || key;
}

// Usage
const welcomeText = t('hero_title');
console.log(welcomeText);  // Output: "Welcome to CodexDLC" (EN) or "Добро пожаловать в CodexDLC" (RU)
```

### Dynamic Text in JS

```javascript
// Logo animation
const parts = [
    { text: t('slogan_developers'), color: "var(--color-gold)" },
    { text: t('slogan_life'), color: "var(--color-ivory)" },
    { text: t('slogan_cycle'), color: "var(--color-blue)" },
];

// Tab labels (portfolio.js)
const tabNames = {
    'business': t('tab_business'),
    'ecosystem': t('tab_ecosystem'),
    'tech': t('tab_tech'),
    'research': t('tab_research'),
};
```

### JSON File Structure

```
static/i18n/
├── en.json  { "nav_home": "Home", "hero_title": "Welcome...", ... }
├── ru.json  { "nav_home": "Главная", "hero_title": "Добро пожаловать...", ... }
└── de.json  { "nav_home": "Startseite", "hero_title": "Willkommen...", ... }
```

See [I18N_KEYS.md](I18N_KEYS.md) for complete key reference.

## Migration Strategy

### Phase 1: Initial Setup

1. Extract all strings to [I18N_KEYS.md](I18N_KEYS.md)
2. Create `.po` skeleton files
3. Create JSON files in `static/i18n/`

### Phase 2: Django Template Migration

```django
<!-- Before -->
<a href="/portfolio">Portfolio</a>

<!-- After -->
<a href="{% raw %}{% url 'portfolio' %}{% endraw %}">{% raw %}{% trans "nav_portfolio" %}{% endraw %}</a>
```

### Phase 3: JavaScript Cleanup

```javascript
// Before
const text = "Developer's";

// After
const text = t('slogan_developers');
```

### Phase 4: Translation (AI Agents)

- AI agent translates `.po` files (EN → RU, DE)
- AI agent generates JSON files with translations

## Fallback & Error Handling

### Missing Keys

**Django Template:**

```django
{% raw %}{% trans "nonexistent_key" %}{% endraw %}
<!-- Output: "nonexistent_key" (visible so you know it's untranslated) -->
```

**JavaScript:**

```javascript
t('nonexistent_key')
// Returns: "nonexistent_key"
```

### Language Not Available

```python
# If user's Accept-Language is "fr" (French, not supported)
# Django automatically falls back to EN
```

### Partial Translation

```
.po file has 100 strings
Only 80 translated to RU
Missing 20 strings → Django shows EN fallback
```

## Testing i18n

### Django Shell

```bash
python cli.py shell
>>> from django.utils import translation
>>> translation.activate('ru')
>>> from django.utils.translation import gettext as _
>>> print(_('nav_home'))  # Should print "Главная"
```

### Browser DevTools

```javascript
// In console
CURRENT_LANG  // "en" or "ru" or "de"
t('nav_home')  // Get translation
```

### Switch Language (for testing)

```
URL: http://localhost:8000/?lang=ru
Django middleware switches to Russian
JSON loads `i18n/ru.json`
```

## Pluralization

### Django

```django
{% raw %}{% blocktrans count items=items|length %}
    You have 1 project.
{% plural %}
    You have {{ items }} projects.
{% endblocktrans %}{% endraw %}
```

### In `.po` file

```
msgid "You have 1 project."
msgid_plural "You have %(items)d projects."
msgstr[0] "У вас есть 1 проект."
msgstr[1] "У вас есть %(items)d проекта."
msgstr[2] "У вас есть %(items)d проектов."
```

## Performance

### Caching Translations

```python
# settings.py

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}

# Auto-cache translations after compilation
# Cache invalidated when running makemessages
```

### Frontend Caching

```javascript
// Cache translations in localStorage
if (localStorage.getItem(`translations_${CURRENT_LANG}`)) {
    window.translations = JSON.parse(localStorage.getItem(`translations_${CURRENT_LANG}`));
} else {
    fetch(`/static/i18n/${CURRENT_LANG}.json`)
        .then(r => r.json())
        .then(data => {
            window.translations = data;
            localStorage.setItem(`translations_${CURRENT_LANG}`, JSON.stringify(data));
        });
}
```

## Common Pitfalls

1. **Hardcoded strings in templates** → Always use `{% raw %}{% trans %}{% endraw %}`
2. **String concatenation** → Use `.format()` or template variables instead
3. **Forgetting to run `makemessages`** → New strings won't be extracted
4. **JSON key mismatches** → Keep [I18N_KEYS.md](I18N_KEYS.md) in sync
5. **Not testing all languages** → Test EN, RU, DE on every change

## Adding a New Language

1. Add to `LANGUAGES` in `settings.py`
2. Run `python manage.py makemessages -l <lang_code>`
3. Create `static/i18n/<lang_code>.json`
4. AI agent translates `.po` file
5. Run `python manage.py compilemessages`

## Future Enhancements

- [ ] Add language switcher UI (dropdown in header)
- [ ] Support cookie-based language selection
- [ ] SEO: Generate language-specific sitemaps
- [ ] RTL support (Arabic, Hebrew) if needed
- [ ] Crowdin integration for professional translations
