# 🧠 Super MCQ - Universal Quiz Platform

![Repo Size](https://img.shields.io/github/repo-size/SilverLucFox/super-mcq?color=blue)
![HTML](https://img.shields.io/badge/HTML-%3C%2F%3E-orange?logo=html5)
![CSS](https://img.shields.io/badge/CSS-%3C%2F%3E-blue?logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-%3C%2F%3E-yellow?logo=javascript)
![Python](https://img.shields.io/badge/Python-Converter-blue?logo=python)
![Node.js](https://img.shields.io/badge/Node.js-Backend-brightgreen?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-Backend-green?logo=express)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

🚀 **Live Demo:** [https://super-mcq.onrender.com](https://super-mcq.onrender.com)

A comprehensive web-based Multiple Choice Question platform supporting multiple subjects with adaptive learning features. Built with modern web technologies and featuring an intelligent retry system for incorrect answers.

---

## 🎯 Key Features

### 🎓 **Learning & Assessment**

- ✅ **Multi-category quiz system** - Mathematics, Anatomy, IT, Security, Management, Marketing
- 🔄 **Adaptive learning** - Retry incorrect questions until mastered
- � **Real-time progress tracking** - Visual feedback on performance
- 🎯 **Focused practice** - Continue with wrong answers until perfect

### 🛠️ **Technical Features**

- 📱 **Fully responsive design** - Works seamlessly on desktop and mobile
- ⚡ **Fast loading** - Optimized performance with modern JavaScript
- 🧮 **Mathematical notation support** - KaTeX integration for math expressions
- 🎨 **Modern UI/UX** - Clean, intuitive interface with smooth animations
- 📁 **Easy content management** - Simple JSON-based question format

---

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js, Express.js, CORS
- **Math Rendering**: KaTeX for mathematical expressions
- **Styling**: Google Fonts (Outfit), Custom CSS Grid & Flexbox
- **Build Tools**: NPM, Native ES Modules
- **Conversion**: Python scripts for TXT-to-JSON conversion
- **Deployment**: Render.com compatible

---

## 📂 Project Structure

```
super-mcq/
├── 📁 conf/                    # Conversion utilities
│   ├── input.txt              # Sample question input
│   ├── libMaker.py            # Python converter script
│   └── output.json            # Generated output
├── 📁 lib/                    # Question libraries
│   ├── index.json             # Category index
│   ├── 📁 anatomy/            # Anatomy questions
│   │   ├── index.json         # Quiz list
│   │   ├── anatomy_full.json
│   │   ├── heart_anatomy.json
│   │   ├── intro_to_anatomy.json
│   │   ├── muscle_anatomy.json
│   │   └── skeleton_anatomy.json
│   ├── 📁 it/                 # IT questions
│   │   ├── index.json
│   │   └── Linux.json
│   ├── 📁 math/               # Mathematics questions
│   │   ├── index.json
│   │   └── Differential_Equations.json
│   ├── 📁 security/           # Security questions
│   │   ├── index.json
│   │   ├── Cyber.json
│   │   ├── Cyber_2.json
│   │   └── information_system_security.json
│   ├── 📁 management/         # Management questions
│   │   ├── index.json
│   │   └── management.json
│   └── 📁 marketing/          # Marketing questions
│       ├── index.json
│       └── marketing.json
├── 📁 public/                 # Frontend application
│   ├── 🏠 index.html          # Welcome page
│   ├── 📋 categories.html     # Category selection
│   ├── 📝 quiz-list.html      # Quiz selection
│   ├── 🎯 quiz.html           # Quiz interface
│   ├── 🎨 styles.css          # Main stylesheet
│   ├── ⚙️ app.js              # Category page logic
│   ├── 🔧 categories.js       # Category grid functionality
│   ├── 📊 quiz-list.js        # Quiz list functionality
│   ├── 🎮 quiz.js             # Main quiz logic
│   └── 📁 assets/             # Images and icons
│       ├── logo.png
│       ├── icon.png
│       └── favicon files...
├── 🔧 server.js               # Express.js server
├── 📦 package.json            # NPM dependencies
└── 📖 README.md               # This file
```

---

## 🚀 How to Use

### 1. Install and Run

```bash
npm install
npm start
```

Then open: [http://localhost:3000](http://localhost:3000)

### 2. Convert TXT to JSON (Optional)

Use the Python converter to create new question banks:

```bash
cd conf
python libMaker.py
```

**TXT Format (input.txt):**

```
Q1. What is the capital of France?
a) London
b) Paris
c) Berlin
d) Madrid
Answer: b) When a new product takes sales from an existing product within the same company

Q2. Which programming language is used for web development?
a) Python
b) Java
c) JavaScript
d) C++
Answer: c) JavaScript
```

_(Use Q1, Q2, etc. format with empty line between questions)_

---

## 🔧 TXT to JSON Converter

The `conf/libMaker.py` script converts structured text files to JSON format:

```python
import json
import re

def txt_to_json(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f if line.strip()]

    questions = []
    i = 0
    while i < len(lines):
        # Get question
        question_match = re.match(r'^Q\d+\.\s+(.*)', lines[i])
        if not question_match:
            i += 1
            continue

        question = question_match.group(1)
        options = {}
        for j in range(1, 5):
            opt_match = re.match(r'^([a-dA-D])[).]\s+(.*)', lines[i + j])
            if opt_match:
                key = opt_match.group(1).lower()
                value = opt_match.group(2)
                options[key] = value

        # Get answer
        answer_match = re.match(r'^Answer:\s*([a-dA-D])[).]?\s*(.*)', lines[i + 5])
        if answer_match:
            key = answer_match.group(1).lower()
            answer = f"{key}) {options.get(key, '')}"

        questions.append({
            "question": question,
            "options": options,
            "answer": answer
        })

        i += 6  # move to next block

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2)

    print(f"✔️ Converted {len(questions)} questions to {output_file}")
```

````

---

## 🌐 Web Interface Features

### 🎯 **Quiz Navigation System**
- **Welcome Page** - Beautiful landing page with feature highlights
- **Category Selection** - Visual grid of available subjects
- **Quiz List** - Browse available quizzes within each category
- **Quiz Interface** - Clean, focused environment for taking quizzes

### 💡 **Smart Question Handling**
- **Adaptive Learning** - Retry incorrect answers until mastered
- **Real-time Feedback** - Instant response validation
- **Progress Tracking** - Visual progress indicators and completion stats
- **Mathematical Support** - KaTeX rendering for equations and formulas

### 📱 **Responsive Design**
- **Mobile-First** - Optimized for all screen sizes
- **Touch-Friendly** - Easy navigation on mobile devices
- **Cross-Browser** - Compatible with modern browsers
- **Fast Loading** - Optimized assets and minimal dependencies

### 🎨 **Modern UI/UX**
- **Clean Interface** - Minimalist design focused on content
- **Smooth Animations** - Engaging transitions and feedback
- **Accessibility** - Keyboard navigation and screen reader support
- **Dark Theme** - Eye-friendly color scheme

---

## 📋 Available Categories

- **📊 Mathematics** - Differential Equations and advanced math concepts
- **🔬 Anatomy** - Human anatomy including heart, muscles, and skeletal system
- **💻 IT** - Linux system administration and technical concepts
- **🔒 Security** - Cybersecurity and information system security
- **📈 Management** - Business management principles and practices
- **📢 Marketing** - Marketing strategies and business development

---

## 🏗️ Architecture

### Backend (Node.js + Express)
- **RESTful API** - Clean endpoints for quiz data
- **Static File Serving** - Efficient delivery of frontend assets
- **CORS Support** - Cross-origin resource sharing enabled
- **Error Handling** - Robust error management

### Frontend (Vanilla JavaScript)
- **Modular Design** - Separate JS files for different functionalities
- **ES6+ Features** - Modern JavaScript with async/await
- **Local Storage** - Client-side state management
- **Progressive Enhancement** - Works without JavaScript for basic functionality

### Data Structure
```json
{
  "question": "What is the capital of France?",
  "options": {
    "a": "London",
    "b": "Paris",
    "c": "Berlin",
    "d": "Madrid"
  },
  "answer": "b) Paris"
}
````

---

## 🔧 Development Setup

### Prerequisites

- Node.js (v14 or higher)
- NPM (v6 or higher)
- Python 3.x (for converter script)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/SilverLucFox/super-mcq.git
cd super-mcq
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser to `http://localhost:3000`

### Adding New Questions

1. Create a new `.txt` file in the `conf/` directory
2. Follow the question format shown above
3. Run the converter: `python conf/libMaker.py`
4. Move the generated JSON file to the appropriate category folder in `lib/`
5. Update the category's `index.json` file to include the new quiz

---

## 🚀 Deployment

The application is deployed on Render.com and configured for:

- **Automatic Deployments** - Connected to GitHub for CI/CD
- **Environment Variables** - Production configurations
- **Static Asset Optimization** - Fast content delivery
- **HTTPS Support** - Secure connections

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**SilverFox**

- GitHub: [@SilverLucFox](https://github.com/SilverLucFox)
- Project Link: [https://github.com/SilverLucFox/super-mcq](https://github.com/SilverLucFox/super-mcq)

---

## 🙏 Acknowledgments

- **KaTeX** - For mathematical expression rendering
- **Google Fonts** - For the beautiful Outfit font family
- **Render.com** - For reliable hosting platform
