// Global variables for quiz state
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

// Populate categories from lib folder
async function populateCategoryDropdown() {
    try {
        const response = await fetch('/lib');
        if (!response.ok) throw new Error('Failed to load categories');
        const files = await response.json();

        const categories = files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', ''));

        categorySelect.innerHTML = '<option value="" disabled selected>Select a category</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        questionArea.innerHTML = '<p class="error">Error loading categories. Please try again later.</p>';
    }
}

// Initialize quiz with selected category
async function startQuiz() {
    try {
        const selectedValue = categorySelect.value;
        if (!selectedValue) return;

        const response = await fetch(`/lib/${selectedValue}.json`);
        if (!response.ok) throw new Error('Failed to load questions');

        selectedCategory = await response.json();
        incorrectQuestions = [...selectedCategory];
        currentQuestionIndex = 0;
        correctAnswers = 0;

        submitBtn.disabled = false;
        startBtn.disabled = true;
        categorySelect.disabled = true;
        updateProgress();
        renderQuestion(currentQuestionIndex);
    } catch (error) {
        console.error('Error starting quiz:', error);
        questionArea.innerHTML = '<p class="error">Failed to load questions. Please try again.</p>';
    }
}

// Render current question
function renderQuestion(index) {
    if (incorrectQuestions.length === 0) {
        questionArea.innerHTML = '<p class="correct">All questions answered correctly!<br>Well done!</p>';
        submitBtn.disabled = true;
        return;
    }

    const q = incorrectQuestions[index];
    questionArea.innerHTML = `
        <div class="question">
            <h3>Q${index + 1}: ${q.question}</h3>
            <ul class="options">
                ${Object.entries(q.options).map(([key, value]) => `
                    <li>
                        <label>
                            <input type="radio" name="question-${index}" value="${key}">
                            ${key}: ${value}
                        </label>
                    </li>
                `).join('')}
            </ul>
            <div id="feedback"></div>
        </div>
    `;
    questionCount.textContent = `Question ${index + 1} of ${incorrectQuestions.length}`;
}

// Check selected answer
function checkAnswer() {
    const selectedOption = document.querySelector(`input[name="question-${currentQuestionIndex}"]:checked`);
    const feedback = document.getElementById('feedback');

    if (!selectedOption) {
        feedback.innerHTML = '<p class="incorrect">Please select an answer before submitting.</p>';
        return;
    }

    const selectedValue = selectedOption.value;
    const correctAnswer = incorrectQuestions[currentQuestionIndex].answer[0];

    if (selectedValue === correctAnswer) {
        feedback.innerHTML = '<p class="correct">Correct!</p>';
        correctAnswers++;
        incorrectQuestions.splice(currentQuestionIndex, 1);
    } else {
        feedback.innerHTML = `<p class="incorrect">Incorrect! The correct answer is ${correctAnswer}.</p>`;
        currentQuestionIndex = (currentQuestionIndex + 1) % incorrectQuestions.length;
    }

    updateProgress();
    setTimeout(() => {
        if (incorrectQuestions.length > 0) {
            currentQuestionIndex = currentQuestionIndex % incorrectQuestions.length;
            renderQuestion(currentQuestionIndex);
        } else {
            renderQuestion(0);
        }
    }, 1500);
}

// Update progress display
function updateProgress() {
    const progress = Math.round((correctAnswers / selectedCategory.length) * 100);
    progressText.textContent = `Progress: ${progress}% (${correctAnswers}/${selectedCategory.length})`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', populateCategoryDropdown);
startBtn.addEventListener('click', startQuiz);
submitBtn.addEventListener('click', checkAnswer);

const mobileToggle = document.getElementById('mobile-toggle');
const showMenuBtn = document.getElementById('show-menu');
const sidebar = document.querySelector('.sidebar');

// Toggle sidebar visibility
mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('visible');
});

// Start Quiz button handler modifications
startBtn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
        sidebar.classList.add('hidden');
        mobileToggle.style.display = 'none';
        document.querySelector('.main-area').classList.add('fullscreen');
    }
});

// When quiz ends (add this to your quiz completion logic)
function handleQuizCompletion() {
    if (window.innerWidth <= 768) {
        showMenuBtn.style.display = 'block';
    }
}

// Show menu button handler
showMenuBtn.addEventListener('click', () => {
    sidebar.classList.add('visible');
    showMenuBtn.style.display = 'none';
    document.querySelector('.main-area').classList.remove('fullscreen');
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('visible', 'hidden');
        mobileToggle.style.display = 'none';
        showMenuBtn.style.display = 'none';
    } else {
        mobileToggle.style.display = 'block';
    }
});