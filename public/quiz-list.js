// Function to format quiz names for display
function formatQuizName(filename) {
    return filename
        .replace('.json', '')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Populate quiz list grid
document.addEventListener('DOMContentLoaded', async () => {
    const quizList = document.getElementById('quiz-list');
    const category = localStorage.getItem('selectedCategory');

    if (!category) {
        location.href = 'categories.html';
        return;
    }

    const displayName = category
        .replace(/-/g, ' ')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    // Update page title dynamically
    document.querySelector('.categories-header h1').textContent = `🧠 ${displayName} Quizzes`;

    try {
        const response = await fetch(`/lib/${category}/index.json`);

        if (!response.ok) {
            throw new Error('index.json not found');
        }

        const quizzes = await response.json();

        if (!Array.isArray(quizzes) || quizzes.length === 0) {
            quizList.innerHTML = `
        <div class="category-loading">
          No quizzes found in this category. Please check back later.
        </div>
      `;
            return;
        }

        // Create quiz cards with the same structure as category cards
        quizList.innerHTML = quizzes.map(file => {
            const quizName = formatQuizName(file);

            return `
        <div class="category-card" data-file="${file}">
          <div class="category-icon">📝</div>
          <h3 class="category-title">${quizName}</h3>
          <p class="category-description">Test your knowledge on ${quizName}</p>
          <div class="category-start">Start Quiz</div>
        </div>
      `;
        }).join('');

        // Add event listeners to quiz cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const file = card.getAttribute('data-file');
                localStorage.setItem('selectedQuizFile', file);
                window.location.href = 'quiz.html';
            });
        });

    } catch (error) {
        console.error('Error loading quizzes:', error);
        quizList.innerHTML = `
      <div class="category-loading">
        Error loading quizzes. Please try again later.
      </div>
    `;
    }
});