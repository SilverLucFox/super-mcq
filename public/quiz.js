// Quiz Page JavaScript

// Global state
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

    // First convert common latex-style commands if they don't have $ delimiters already
    if (text.includes('\\') && !text.includes('$')) {
        return `$${text}$`;
    }

    let processed = text;

    // Add math delimiters to equations and math expressions that don't have them yet
    const needsDelimiters = [
        // Equalities with variables
        /([a-zA-Z][a-zA-Z0-9]*\s*=\s*[^.,;!?<>\n]+)/g,

        // Derivatives
        /([a-zA-Z]+\/[a-zA-Z]+)/g,

        // Functions
        /([a-zA-Z]\s*\([a-zA-Z]\)\s*=\s*[^.,;!?<>\n]+)/g,

        // Greek letters
        /\b([α-ωΑ-Ω])\b/g,

        // Common math functions
        /\b(sin|cos|tan|log|ln)\s*\([^\)]+\)/g,

        // Fractions
        /(\d+\/\d+)/g
    ];

    needsDelimiters.forEach(pattern => {
        processed = processed.replace(pattern, match => {
            // Don't add delimiters if already within $ or $$ delimiters
            if (match.includes('$')) return match;
            return `$${match}$`;
        });
    });

    return processed;
}

// Initialize quiz
function initQuiz() {
    // Get selected category from localStorage
    const cat = localStorage.getItem('selectedCategory');

    if (!cat) {
        // No category selected, redirect to categories page
        window.location.href = 'categories.html';
        return;
    }

    categoryName = cat.replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    categoryTitle.textContent = categoryName;

    // Load questions
    loadQuestions(cat);

    // Set up event listeners
    submitBtn.addEventListener('click', checkAnswer);
    resetBtn.addEventListener('click', resetQuiz);
    newCategoryBtn.addEventListener('click', () => {
        window.location.href = 'categories.html';
    });
    retryBtn.addEventListener('click', resetQuiz);
}

// Load questions from the selected category
async function loadQuestions(category) {
    try {
        questionArea.innerHTML = '<div class="loading-spinner">Loading questions...</div>';

        const res = await fetch(`/lib/${category}.json`);

        if (!res.ok) {
            throw new Error('Failed to load questions');
        }

        selectedCategory = await res.json();

        // Start with all questions as incorrect
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

// Render the current question
function renderQuestion() {
    if (incorrectQuestions.length === 0) {
        // All questions answered correctly
        completionMessage.style.display = 'block';
        questionArea.style.display = 'none';
        submitBtn.style.display = 'none';
        return;
    }

    completionMessage.style.display = 'none';
    questionArea.style.display = 'block';
    submitBtn.style.display = 'block';

    const q = incorrectQuestions[currentQuestionIndex];

    // Build options HTML with proper math formatting
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

    // Render math expressions with KaTeX
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

// Check the selected answer
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

        // Remove the correctly answered question from incorrectQuestions
        incorrectQuestions.splice(currentQuestionIndex, 1);
    } else {
        feedback.innerHTML = `<p class="incorrect">Incorrect! The correct answer is ${correctKey}.</p>`;

        // Move to next question
        currentQuestionIndex = (currentQuestionIndex + 1) % incorrectQuestions.length;
    }

    updateProgress();

    // Short delay before showing next question
    setTimeout(() => {
        renderQuestion();
    }, 1200);
}

// Update progress display
function updateProgress() {
    const total = selectedCategory.length;
    const pct = Math.round((correctAnswers / total) * 100);

    progressText.textContent = `Progress: ${pct}% (${correctAnswers}/${total})`;
}

// Reset the current quiz
function resetQuiz() {
    // Reset all variables
    incorrectQuestions = [...selectedCategory];
    currentQuestionIndex = 0;
    correctAnswers = 0;

    // Update UI
    updateProgress();
    renderQuestion();

    // Hide completion message
    completionMessage.style.display = 'none';
    questionArea.style.display = 'block';
    submitBtn.style.display = 'block';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initQuiz);