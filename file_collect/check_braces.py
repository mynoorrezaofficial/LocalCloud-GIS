
with open('frontend/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

stack = []
for i, char in enumerate(content):
    if char == '{':
        stack.append(i)
    elif char == '}':
        if not stack:
            print(f"Extra closing brace at index {i}")
        else:
            stack.pop()

if stack:
    for pos in stack:
        # Find line number
        line_no = content[:pos].count('\n') + 1
        print(f"Unmatched opening brace at line {line_no}")
else:
    print("Braces are balanced")
