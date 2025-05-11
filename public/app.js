// Global state
let selectedCategory = [];
let incorrectQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;

// DOM elements
const progressText = document.getElementById('progress');
const questionCount = document.getElementById('question-count');
const questionArea = document.getElementById('question-area');
const submitBtn = document.getElementById('submit-btn');
const categorySelect = document.getElementById('category-select');
const startBtn = document.getElementById('start-btn');

// Populate category dropdown from /lib
async function populateCategoryDropdown() {
    try {
        const res = await fetch('/lib');
        if (!res.ok) throw new Error('Failed to load categories');
        const files = await res.json();

        const categories = files
            .filter(f => f.endsWith('.json'))
            .map(f => f.replace('.json', ''));

        categorySelect.innerHTML =
            '<option value="" disabled selected>Select category</option>' +
            categories.map(c => `<option value="${c}">${c}</option>`).join('');
    } catch (err) {
        console.error(err);
        questionArea.innerHTML =
            '<p class="error">Error loading categories. Please try again later.</p>';
    }
}

// Start the quiz
async function startQuiz() {
    const cat = categorySelect.value;
    if (!cat) return;

    try {
        const res = await fetch(`/lib/${cat}.json`);
        if (!res.ok) throw new Error('Failed to load questions');
        selectedCategory = await res.json();
    } catch (err) {
        console.error(err);
        questionArea.innerHTML =
            '<p class="error">Failed to load questions. Please try again.</p>';
        return;
    }

    incorrectQuestions = [...selectedCategory];
    currentQuestionIndex = 0;
    correctAnswers = 0;

    submitBtn.disabled = false;
    startBtn.disabled = true;
    categorySelect.disabled = true;

    updateProgress();
    renderQuestion();
}

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

// Render the current question
function renderQuestion() {
    if (incorrectQuestions.length === 0) {
        questionArea.innerHTML =
            '<p class="correct">All questions answered correctly!<br/>Well done!</p>';
        submitBtn.disabled = true;
        handleQuizCompletion();
        return;
    }

    const q = incorrectQuestions[currentQuestionIndex];
    const correctKey = q.answer.split(')')[0];

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
    
    questionCount.textContent =
        `Question ${currentQuestionIndex + 1} of ${incorrectQuestions.length}`;

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
        feedback.innerHTML =
            '<p class="incorrect">Please select an answer before submitting.</p>';
        return;
    }

    const q = incorrectQuestions[currentQuestionIndex];
    const correctKey = q.answer.split(')')[0];

    if (chosen.value === correctKey) {
        feedback.innerHTML = '<p class="correct">Correct!</p>';
        correctAnswers++;
        incorrectQuestions.splice(currentQuestionIndex, 1);
    } else {
        feedback.innerHTML =
            `<p class="incorrect">Incorrect! The correct answer is ${correctKey}.</p>`;
        currentQuestionIndex =
            (currentQuestionIndex + 1) % incorrectQuestions.length;
    }

    updateProgress();

    setTimeout(() => {
        if (incorrectQuestions.length) {
            currentQuestionIndex %= incorrectQuestions.length;
            renderQuestion();
        } else {
            renderQuestion();
        }
    }, 1200);
}

// Update progress display
function updateProgress() {
    const pct = Math.round(
        (correctAnswers / selectedCategory.length) * 100
    );
    progressText.textContent =
        `Progress: ${pct}% (${correctAnswers}/${selectedCategory.length})`;
}

// Quiz completion for mobile
function handleQuizCompletion() {
    const showMenuBtn = document.getElementById('show-menu');
    if (window.innerWidth <= 768) {
        showMenuBtn.style.display = 'block';
    }
}

// Mobile sidebar toggles
const mobileToggle = document.getElementById('mobile-toggle');
const showMenuBtn = document.getElementById('show-menu');
const sidebar = document.querySelector('.sidebar');

mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('visible');
});

showMenuBtn.addEventListener('click', () => {
    sidebar.classList.add('visible');
    showMenuBtn.style.display = 'none';
    document.querySelector('.main-area').classList.remove('fullscreen');
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('visible');
        mobileToggle.style.display = 'none';
        showMenuBtn.style.display = 'none';
    } else {
        mobileToggle.style.display = 'block';
    }
});

// Event listeners
document.addEventListener('DOMContentLoaded', populateCategoryDropdown);
startBtn.addEventListener('click', startQuiz);
submitBtn.addEventListener('click', checkAnswer);