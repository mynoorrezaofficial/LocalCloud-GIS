
with open('frontend/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

def check_balance(file_content):
    stack = []
    pairs = {'{': '}', '(': ')', '[': ']'}
    lines = file_content.splitlines()
    
    in_string = False
    string_char = ''
    
    for line_no, line in enumerate(lines, 1):
        if '//' in line:
            line = line.split('//')[0]
        
        i = 0
        while i < len(line):
            char = line[i]
            
            if in_string:
                if char == string_char and (i == 0 or line[i-1] != '\\'):
                    in_string = False
            else:
                if char in ("'", '"', '`'):
                    in_string = True
                    string_char = char
                elif char in pairs:
                    stack.append((char, line_no))
                elif char in pairs.values():
                    if not stack:
                        print(f"Extra closing '{char}' at line {line_no}")
                        return False
                    opening, op_line = stack.pop()
                    if pairs[opening] != char:
                        print(f"Mismatched pair: '{opening}' at line {op_line} with '{char}' at line {line_no}")
                        return False
            i += 1
    
    if stack:
        for opening, line_no in stack:
            print(f"Unmatched opening '{opening}' at line {line_no}")
        return False
    
    return True

if check_balance(content):
    print("Syntax balance check PASSED")
else:
    print("Syntax balance check FAILED")
