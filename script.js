
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

// Populate categories in the dropdown
function populateCategoryDropdown() {
    const categories = [
        { name: "Heart", data: heart },
        { name: "Intro", data: intro },
        { name: "Skeleton", data: skeleton },
        { name: "Muscle", data: muscle }
    ];

    categorySelect.innerHTML = `<option value="" disabled selected>Select a category</option>`;

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// Initialize quiz with the selected category
function startQuiz() {
    const selectedValue = categorySelect.value;
    const categories = { Heart: heart, Intro: intro, Skeleton: skeleton, Muscle: muscle };
    
    selectedCategory = categories[selectedValue];
    incorrectQuestions = [...selectedCategory];
    currentQuestionIndex = 0;
    correctAnswers = 0;
    
    updateProgress();
    renderQuestion(currentQuestionIndex);
}

// Render question
function renderQuestion(index) {
    if (incorrectQuestions.length === 0) {
        questionArea.innerHTML = `<p class="correct">All questions are answered correctly!<br/>Well done!</p>`;
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
    submitBtn.disabled = false; // Enable submit button
}

// Check answer
function checkAnswer() {
    const selectedOption = document.querySelector(`input[name="question-${currentQuestionIndex}"]:checked`);
    const feedback = document.getElementById('feedback');
    
    if (!selectedOption) {
        feedback.innerHTML = `<p class="incorrect">Please select an answer before submitting.</p>`;
        return;
    }

    const selectedValue = selectedOption.value.trim();
    const correctAnswer = incorrectQuestions[currentQuestionIndex].answer[0].trim();

    if (selectedValue === correctAnswer) {
        feedback.innerHTML = `<p class="correct">Correct!</p>`;
        correctAnswers++;
        incorrectQuestions.splice(currentQuestionIndex, 1);
    } else {
        feedback.innerHTML = `<p class="incorrect">Incorrect! The correct answer is ${correctAnswer}.</p>`;
        currentQuestionIndex++;
    }

    updateProgress();
    setTimeout(() => {
        currentQuestionIndex = currentQuestionIndex % incorrectQuestions.length;
        renderQuestion(currentQuestionIndex);
    }, 3000);
}

// Update progress
function updateProgress() {
    const totalQuestions = selectedCategory.length;
    const progressPercentage = Math.round((correctAnswers / totalQuestions) * 100);
    progressText.textContent = `Progress: ${progressPercentage}%`;
}

// Event listeners
submitBtn.addEventListener('click', checkAnswer);
categorySelect.addEventListener('change', startQuiz);

// Initialize quiz by populating category dropdown when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    populateCategoryDropdown();
    
    // Add event listener to the start button
    document.getElementById('start-btn').addEventListener('click', startQuiz);
});