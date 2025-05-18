let selectedCategory = [];
let incorrectQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let categoryName = '';

// DOM elements
const categoryTitle = document.getElementById('category-title');
const progressText = document.getElementById('progress');
const questionCount = document.getElementById('question-count');
const questionArea = document.getElementById('question-area');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const newCategoryBtn = document.getElementById('new-category-btn');
const completionMessage = document.getElementById('completion-message');
const retryBtn = document.getElementById('retry-btn');

// Helper: prepare text with math delimiters
function prepareForKatex(text) {
    if (!text) return '';

    if (text.includes('\\') && !text.includes('$')) {
        return `$${text}$`;
    }

    let processed = text;
    const needsDelimiters = [
        /([a-zA-Z][a-zA-Z0-9]*\s*=\s*[^.,;!?<>\n]+)/g,
        /([a-zA-Z]+\/[a-zA-Z]+)/g,
        /([a-zA-Z]\s*\([a-zA-Z]\)\s*=\s*[^.,;!?<>\n]+)/g,
        /\b([α-ωΑ-Ω])\b/g,
        /\b(sin|cos|tan|log|ln)\s*\([^\)]+\)/g,
        /(\d+\/\d+)/g
    ];

    needsDelimiters.forEach(pattern => {
        processed = processed.replace(pattern, match => {
            if (match.includes('$')) return match;
            return `$${match}$`;
        });
    });

    return processed;
}

// Initialize quiz
function initQuiz() {
    const cat = localStorage.getItem('selectedCategory');
    const file = localStorage.getItem('selectedQuizFile');

    if (!cat || !file) {
        window.location.href = 'categories.html';
        return;
    }

    categoryName = cat.replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    categoryTitle.textContent = categoryName;

    loadQuestions(cat, file);

    submitBtn.addEventListener('click', checkAnswer);
    resetBtn.addEventListener('click', resetQuiz);
    newCategoryBtn.addEventListener('click', () => {
        window.location.href = 'categories.html';
    });
    retryBtn.addEventListener('click', resetQuiz);
}

// Load questions
async function loadQuestions(category, quizFile) {
    try {
        questionArea.innerHTML = '<div class="loading-spinner">Loading questions...</div>';

        const res = await fetch(`/lib/${category}/${quizFile}`);

        if (!res.ok) {
            throw new Error('Failed to load questions');
        }

        selectedCategory = await res.json();
        incorrectQuestions = [...selectedCategory];
        currentQuestionIndex = 0;
        correctAnswers = 0;

        updateProgress();
        renderQuestion();

    } catch (err) {
        console.error('Error loading questions:', err);
        questionArea.innerHTML = `
      <div class="error-message">
        <p>Failed to load questions. Please try again.</p>
        <button onclick="window.location.reload()">Retry</button>
      </div>
    `;
    }
}

// Render question
function renderQuestion() {
    if (incorrectQuestions.length === 0) {
        completionMessage.style.display = 'block';
        questionArea.style.display = 'none';
        submitBtn.style.display = 'none';
        return;
    }

    completionMessage.style.display = 'none';
    questionArea.style.display = 'block';
    submitBtn.style.display = 'block';

    const q = incorrectQuestions[currentQuestionIndex];

    const optsHtml = Object.entries(q.options).map(([key, val]) => `
    <li>
      <label>
        <input
          type="radio"
          name="q${currentQuestionIndex}"
          value="${key}"
        />
        <span class="option-text">${key}) ${prepareForKatex(val)}</span>
      </label>
    </li>
  `).join('');

    questionArea.innerHTML = `
    <div class="question">
      <h3 class="question-text">
        Q${currentQuestionIndex + 1}: ${prepareForKatex(q.question)}
      </h3>
      <ul class="options">${optsHtml}</ul>
      <div id="feedback"></div>
    </div>
  `;

    questionCount.textContent = `Question ${currentQuestionIndex + 1} of ${incorrectQuestions.length}`;

    try {
        if (typeof renderMathInElement === 'function') {
            setTimeout(() => {
                renderMathInElement(questionArea, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false }
                    ],
                    throwOnError: false
                });
            }, 50);
        }
    } catch (e) {
        console.error("KaTeX rendering error:", e);
    }
}

// Check answer
function checkAnswer() {
    const selector = `input[name="q${currentQuestionIndex}"]:checked`;
    const chosen = document.querySelector(selector);
    const feedback = document.getElementById('feedback');

    if (!chosen) {
        feedback.innerHTML = '<p class="incorrect">Please select an answer before submitting.</p>';
        return;
    }

    const q = incorrectQuestions[currentQuestionIndex];
    const correctKey = q.answer.split(')')[0];

    if (chosen.value === correctKey) {
        feedback.innerHTML = '<p class="correct">Correct!</p>';
        correctAnswers++;
        incorrectQuestions.splice(currentQuestionIndex, 1);
    } else {
        feedback.innerHTML = `<p class="incorrect">Incorrect! The correct answer is ${correctKey}.</p>`;
        currentQuestionIndex = (currentQuestionIndex + 1) % incorrectQuestions.length;
    }

    updateProgress();

    setTimeout(() => {
        renderQuestion();
    }, 1200);
}

// Update progress
function updateProgress() {
    const total = selectedCategory.length;
    const pct = Math.round((correctAnswers / total) * 100);
    progressText.textContent = `Progress: ${pct}% (${correctAnswers}/${total})`;
}

// Reset quiz
function resetQuiz() {
    incorrectQuestions = [...selectedCategory];
    currentQuestionIndex = 0;
    correctAnswers = 0;
    updateProgress();
    renderQuestion();
    completionMessage.style.display = 'none';
    questionArea.style.display = 'block';
    submitBtn.style.display = 'block';
}

// Init
document.addEventListener('DOMContentLoaded', initQuiz);
