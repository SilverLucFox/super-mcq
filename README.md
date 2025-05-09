# 🧠 Universal MCQ Game

![Repo Size](https://img.shields.io/github/repo-size/SilverLucFox/super-mcq?color=blue)
![HTML](https://img.shields.io/badge/HTML-%3C%2F%3E-orange?logo=html5)
![CSS](https://img.shields.io/badge/CSS-%3C%2F%3E-blue?logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-%3C%2F%3E-yellow?logo=javascript)
![Python](https://img.shields.io/badge/Python-Converter-blue?logo=python)
![Node.js](https://img.shields.io/badge/Node.js-Backend-brightgreen?logo=node.js)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

A web-based Multiple Choice Question game system that works with any subject. Includes a TXT-to-JSON converter for easy question bank creation.

---

## 🎯 Features

- ✅ Subject-agnostic MCQ system  
- 📁 TXT-to-JSON converter for question banks  
- 🎨 Clean and responsive design  
- 📈 Progress tracking  
- 🔄 Retry incorrect questions  

---

## 🛠️ Technologies Used

- **HTML/CSS/JS** – Core game interface  
- **Python** – TXT to JSON converter  
- **Node.js** – Local server  

---

## 📂 File Structure

```
super-mcq/
├── conf/         # Conversion scripts
│   ├── input.txt
│   ├── libMaker.cpy
│   └── output.json
├── lib/               # Question banks (JSON files)
├── public/            # Frontend files
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── server.js          # Local development server
```

---

## 🚀 How to Use

### 1. Convert TXT to JSON

```bash
python converter/txt_to_json.py input.txt lib/YourCategory.json
```

**TXT Format:**
```
What is the capital of France?
a) London
b) Paris
c) Berlin
d) Madrid
Answer: b
```

*(Use an empty line between questions)*

---

### 2. Run the Game

```bash
npm install
node server.js
```

Then open: [http://localhost:3000](http://localhost:3000)

---

## 🔧 TXT to JSON Converter (Sample Script)

```python
import json
import re
import sys

def convert_txt_to_json(input_file, output_file):
    with open(input_file, 'r') as f:
        content = f.read().strip()
    
    questions = []
    blocks = re.split(r'\n\s*\n', content)
    
    for block in blocks:
        lines = [line.strip() for line in block.split('\n') if line.strip()]
        if len(lines) < 6:
            continue
        
        question = {
            "question": lines[0],
            "options": {},
            "answer": ""
        }

        for line in lines[1:5]:
            match = re.match(r'^([a-d])[).]\s*(.+)$', line, re.IGNORECASE)
            if match:
                question['options'][match.group(1).lower()] = match.group(2)

        answer_match = re.search(r'Answer:\s*([a-d])', lines[-1], re.IGNORECASE)
        if answer_match:
            correct = answer_match.group(1).lower()
            question['answer'] = f"{correct}) {question['options'][correct]}"
        
        questions.append(question)

    with open(output_file, 'w') as f:
        json.dump(questions, f, indent=2)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python txt_to_json.py <input.txt> <output.json>")
        sys.exit(1)
    convert_txt_to_json(sys.argv[1], sys.argv[2])
```

---

## 🌐 Web Interface Features

### ✅ Dynamic Category Loading

- Automatically detects all JSON files in `/lib`
- Dropdown selector for available question banks

### 💡 Smart Question Handling

- Retry incorrect answers
- Track progress and give instant feedback

### 📱 Responsive Design

- Works on desktop and mobile  
- Keyboard-accessible navigation  

---

## 💡 Example Workflow

**Create `history.txt`:**
```
Who invented the telephone?
a) Thomas Edison
b) Alexander Graham Bell
c) Nikola Tesla
d) Guglielmo Marconi
Answer: b

When did WWII end?
a) 1943
b) 1944
c) 1945
d) 1946
Answer: c
```

**Convert to JSON:**
```bash
python converter/txt_to_json.py history.txt lib/History.json
```

✅ The new **History** category will automatically appear in the web interface!

---

## 📜 License

This project is licensed under the MIT License.
