// Categories Page JavaScript

// Example icons for categories (emojis paired with subjects)
const categoryIcons = {
  'mathematics': '🧮',
  'science': '🔬',
  'history': '📜',
  'literature': '📚',
  'geography': '🌎',
  'physics': '⚛️',
  'chemistry': '🧪',
  'biology': '🔬',
  'computer-science': '💻',
  'art': '🎨',
  'music': '🎵',
  'sports': '⚽',
  // Default icon for unknown categories
  'default': '📝'
};

// Category descriptions
const categoryDescriptions = {
  'mathematics': 'Test your math skills with problems ranging from algebra to calculus',
  'science': 'Explore various scientific concepts and theories',
  'history': 'Challenge your knowledge of historical events and figures',
  'literature': 'Dive into the world of books, authors, and literary analysis',
  'geography': 'Test your knowledge of countries, landmarks, and geographical features',
  'physics': 'Solve physics problems and test your understanding of physical laws',
  'chemistry': 'Challenge yourself with questions about elements, compounds, and reactions',
  'biology': 'Explore the living world through questions about cells, organisms, and ecosystems',
  'computer-science': 'Test your knowledge of programming, algorithms, and computer systems',
  'art': 'Explore artists, movements, and famous works throughout art history',
  'music': 'Test your knowledge of musical theory, history, and famous composers',
  'sports': 'Challenge yourself with questions about various sports and athletes',
  // Default description
  'default': 'Test your knowledge in this exciting category'
};

// Function to get category icon
function getCategoryIcon(category) {
  const key = category.toLowerCase().replace(/\s+/g, '-');
  return categoryIcons[key] || categoryIcons['default'];
}

// Function to get category description
function getCategoryDescription(category) {
  const key = category.toLowerCase().replace(/\s+/g, '-');
  return categoryDescriptions[key] || categoryDescriptions['default'];
}

// Populate categories grid
async function populateCategories() {
  const categoriesGrid = document.getElementById('categories-grid');

  try {
    const response = await fetch('/lib');

    if (!response.ok) {
      throw new Error('Failed to load categories');
    }

    const files = await response.json();
    const categories = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));

    if (categories.length === 0) {
      categoriesGrid.innerHTML = `
        <div class="category-loading">
          No categories found. Please check back later.
        </div>
      `;
      return;
    }

    // Create category cards
    categoriesGrid.innerHTML = categories.map(category => {
      const displayName = category.replace(/-/g, ' ');
      const formattedName = displayName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return `
        <div class="category-card" data-category="${category}">
          <div class="category-icon">${getCategoryIcon(category)}</div>
          <h3 class="category-title">${formattedName}</h3>
          <p class="category-description">${getCategoryDescription(category)}</p>
          <div class="category-start">Start Quiz</div>
        </div>
      `;
    }).join('');

    // Add event listeners to category cards
    document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const category = card.getAttribute('data-category');
        // Store selected category in localStorage
        localStorage.setItem('selectedCategory', category);
        // Navigate to the quiz page
        window.location.href = 'quiz.html';
      });
    });

  } catch (error) {
    console.error('Error loading categories:', error);
    categoriesGrid.innerHTML = `
      <div class="category-loading">
        Error loading categories. Please try again later.
      </div>
    `;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', populateCategories);