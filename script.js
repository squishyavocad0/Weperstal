// Hero animation
window.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.opacity = 0;
        hero.style.transform = 'translateY(40px)';
        setTimeout(() => {
            hero.style.transition = 'opacity 0.8s cubic-bezier(.4,0,.2,1), transform 0.8s cubic-bezier(.4,0,.2,1)';
            hero.style.opacity = 1;
            hero.style.transform = 'translateY(0)';
        }, 200);
    }
});

// FAQ Collapsible functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
});

// --- Animal Data Example ---
const dieren = [
  {
    type: 'horse',
    name: 'Bliksem',
    desc: 'Een energiek paard dat graag galoppeert over de weide.',
    icon: '🐴'
  },
  {
    type: 'dog',
    name: 'Max',
    desc: 'Vrolijke hond die dol is op kinderen en lange wandelingen.',
    icon: '🐶'
  },
  {
    type: 'cat',
    name: 'Minoes',
    desc: 'Lieve kat die graag op schoot ligt en spint.',
    icon: '🐱'
  },
  {
    type: 'sheep',
    name: 'Wolletje',
    desc: 'Een nieuwsgierig schaap dat graag in de zon ligt.',
    icon: '🐑'
  },
  {
    type: 'pony',
    name: 'Daisy',
    desc: 'Vriendelijke pony, perfect voor jonge kinderen.',
    icon: '🐴'
  },
  {
    type: 'chicken',
    name: 'Kipje',
    desc: 'Legt elke dag een vers eitje en scharrelt vrolijk rond.',
    icon: '🐔'
  },
  {
    type: 'fish',
    name: 'Bubbles',
    desc: 'Kleurrijke vis die rustig door het aquarium zwemt.',
    icon: '🐟'
  },
  {
    type: 'dog',
    name: 'Bella',
    desc: 'Speelse hond die graag apporteert in het park.',
    icon: '🐶'
  },
  {
    type: 'cat',
    name: 'Simba',
    desc: 'Stoere kater die graag op avontuur gaat.',
    icon: '🐱'
  },
  {
    type: 'horse',
    name: 'Storm',
    desc: 'Sterk paard met een prachtige zwarte vacht.',
    icon: '🐴'
  },
  {
    type: 'sheep',
    name: 'Fluffy',
    desc: 'Altijd in voor een knuffel en houdt van gras.',
    icon: '🐑'
  },
  {
    type: 'pony',
    name: 'Sterre',
    desc: 'Kleine pony met een groot hart.',
    icon: '🐴'
  },
  {
    type: 'chicken',
    name: 'Tokkie',
    desc: 'De haan van het erf, altijd als eerste wakker.',
    icon: '🐓'
  }
];

// --- Render Function ---
function renderDieren(selectedTypes = []) {
  const grid = document.getElementById('dierenGrid');
  if (!grid) return;
  let filtered;
  if (selectedTypes.length === 0) {
    filtered = dieren;
  } else {
    filtered = dieren.filter(d => selectedTypes.includes(d.type));
  }
  grid.innerHTML = filtered.slice(0, 30).map(dier => `
    <div class="dier-card">
      <div class="dier-icon">${dier.icon}</div>
      <div class="dier-name">${dier.name}</div>
      <div class="dier-desc">${dier.desc}</div>
    </div>
  `).join('');
}

// --- Filter Buttons ---
document.addEventListener('DOMContentLoaded', function() {
  let selectedTypes = [];
  renderDieren(selectedTypes);

  document.querySelectorAll('.dieren-filter').forEach(btn => {
    btn.addEventListener('click', function() {
      const type = this.dataset.type;
      this.classList.toggle('active');
      // Update selectedTypes array
      selectedTypes = Array.from(document.querySelectorAll('.dieren-filter.active')).map(b => b.dataset.type);
      renderDieren(selectedTypes);
    });
  });
});

// --- Blog Posts Rendering ---
function renderBlogPosts() {
  const blogGrid = document.getElementById('blogGrid');
  const blogEmpty = document.getElementById('blogEmpty');
  if (!blogGrid) return;

  // Get posts from localStorage or use an empty array
  const posts = JSON.parse(localStorage.getItem('weperstal_blog_posts') || '[]')
    .filter(post => post.visible !== false); // Only show visible posts

  if (posts.length === 0) {
    blogGrid.innerHTML = '';
    if (blogEmpty) blogEmpty.style.display = '';
    return;
  }
  if (blogEmpty) blogEmpty.style.display = 'none';

  blogGrid.innerHTML = posts.reverse().map(post => `
    <div class="blog-card">
      <img class="blog-image" src="${post.image || 'Images/header.jpg'}" alt="${post.title}">
      <div class="blog-title">${post.title}</div>
      <div class="blog-date">${post.date || ''}</div>
      <div class="blog-story">${post.story}</div>
    </div>
  `).join('');
}

// Render blog posts on page load
document.addEventListener('DOMContentLoaded', renderBlogPosts);

// --- Blog Admin Logic ---
function renderAdminBlogList() {
  const adminList = document.getElementById('adminBlogList');
  if (!adminList) return;
  const posts = JSON.parse(localStorage.getItem('weperstal_blog_posts') || '[]');
  if (posts.length === 0) {
    adminList.innerHTML = '<p>Geen verhalen geplaatst.</p>';
    return;
  }
  adminList.innerHTML = posts.reverse().map((post, idx) => `
    <div class="admin-blog-card">
      <div class="admin-blog-title">${post.title}</div>
      <div class="admin-blog-date">${post.date || ''}</div>
      <div class="admin-blog-actions">
        <button onclick="toggleBlogVisibility(${posts.length-1-idx})">${post.visible === false ? 'Zichtbaar maken' : 'Verbergen'}</button>
        <button onclick="deleteBlogPost(${posts.length-1-idx})">Verwijderen</button>
      </div>
    </div>
  `).join('');
}

function saveBlogPost(e) {
  e.preventDefault();
  const title = document.getElementById('blogTitle').value.trim();
  const date = document.getElementById('blogDate').value;
  const story = document.getElementById('blogStory').value.trim();
  const image = document.getElementById('blogImage').value.trim();
  if (!title || !date || !story) return;

  const posts = JSON.parse(localStorage.getItem('weperstal_blog_posts') || '[]');
  posts.push({ title, date, story, image, visible: true });
  localStorage.setItem('weperstal_blog_posts', JSON.stringify(posts));
  document.getElementById('blogForm').reset();
  renderAdminBlogList();
  if (typeof renderBlogPosts === 'function') renderBlogPosts();
}

function toggleBlogVisibility(idx) {
  const posts = JSON.parse(localStorage.getItem('weperstal_blog_posts') || '[]');
  posts[idx].visible = posts[idx].visible === false ? true : false;
  localStorage.setItem('weperstal_blog_posts', JSON.stringify(posts));
  renderAdminBlogList();
  if (typeof renderBlogPosts === 'function') renderBlogPosts();
}

function deleteBlogPost(idx) {
  let posts = JSON.parse(localStorage.getItem('weperstal_blog_posts') || '[]');
  posts.splice(idx, 1);
  localStorage.setItem('weperstal_blog_posts', JSON.stringify(posts));
  renderAdminBlogList();
  if (typeof renderBlogPosts === 'function') renderBlogPosts();
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('blogForm')) {
    renderAdminBlogList();
    document.getElementById('blogForm').addEventListener('submit', saveBlogPost);
  }
});

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});