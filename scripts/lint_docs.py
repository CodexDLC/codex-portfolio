import os
import re
import sys

def check_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    errors = []
    in_raw_block = False
    
    # Паттерн для поиска Liquid-тегов
    # Ищем {{ или {%, но игнорируем, если это часть {% raw %} или {% endraw %}
    liquid_pattern = re.compile(r'(\{\{.*?\}\}|\{%.*?%\})')

    for i, line in enumerate(lines):
        line_num = i + 1
        stripped_line = line.strip()

        # 1. Обработка блоков {% raw %} ... {% endraw %}
        # Если строка содержит начало блока
        if '{% raw %}' in line:
            # Если в этой же строке есть конец блока, то это inline-блок, состояние не меняем
            if '{% endraw %}' in line:
                continue
            else:
                in_raw_block = True
                continue
        
        # Если строка содержит конец блока
        if '{% endraw %}' in line:
            in_raw_block = False
            continue

        # Если мы внутри блока raw, пропускаем проверки
        if in_raw_block:
            continue

        # 2. Поиск опасных тегов в обычной строке
        matches = liquid_pattern.findall(line)
        for match in matches:
            # Игнорируем сами теги raw/endraw (если они попали в match)
            if 'raw %}' in match:
                continue
            
            # Если мы здесь, значит найден тег {{ ... }} или {% ... %} вне блока raw
            errors.append(f"Line {line_num}: Unescaped Liquid tag found: {match}")

    return errors

def main():
    # Определяем корень проекта (на уровень выше скрипта)
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    docs_dir = os.path.join(project_root, 'docs')
    
    has_errors = False
    checked_files = 0
    
    print(f"🔍 Scanning documentation in {docs_dir}...")
    print("-" * 50)
    
    for root, _, files in os.walk(docs_dir):
        for file in files:
            if file.endswith('.md'):
                checked_files += 1
                path = os.path.join(root, file)
                try:
                    file_errors = check_file(path)
                    
                    if file_errors:
                        has_errors = True
                        rel_path = os.path.relpath(path, project_root)
                        print(f"\n❌ {rel_path}")
                        for err in file_errors:
                            print(f"  {err}")
                except Exception as e:
                    print(f"⚠️ Could not read {file}: {e}")

    print("-" * 50)
    if has_errors:
        print(f"💥 Issues found in {checked_files} files! Jekyll build will fail.")
        sys.exit(1)
    else:
        print(f"✅ Checked {checked_files} files. No Liquid syntax errors found.")
        sys.exit(0)

if __name__ == "__main__":
    main()
