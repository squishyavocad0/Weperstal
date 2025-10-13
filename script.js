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
  // Contact form: submit via fetch and redirect to Bedankt.html
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const endpoint = contactForm.getAttribute('action');
      const formData = new FormData(contactForm);
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          window.location.href = 'Bedankt.html';
        } else {
          // Fallback: try to parse errors, but still redirect so UX is consistent
          window.location.href = 'Bedankt.html';
        }
      } catch(err) {
        // Network error: still redirect to thank-you to avoid trapping user
        window.location.href = 'Bedankt.html';
      }
    });
  }
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
  },
  {
    type: 'horse',
    name: 'Ster',
    desc: 'Een prachtige merrie die graag in de zon staat te dromen.',
    icon: '🐴'
  },
  {
    type: 'dog',
    name: 'Rakker',
    desc: 'Een slimme hond die altijd in is voor een spelletje.',
    icon: '🐶'
  },
  {
    type: 'cat',
    name: 'Poekie',
    desc: 'Een nieuwsgierige kat die overal haar neus in steekt.',
    icon: '🐱'
  },
  {
    type: 'sheep',
    name: 'Sneeuwbal',
    desc: 'Een wit schaap dat dol is op knuffels en gras.',
    icon: '🐑'
  },
  {
    type: 'pony',
    name: 'Binky',
    desc: 'Een kleine pony met een groot hart en veel energie.',
    icon: '🐴'
  },
  {
    type: 'chicken',
    name: 'Pluisje',
    desc: 'Een pluizige kip die elke dag een ei legt.',
    icon: '🐔'
  },
  {
    type: 'fish',
    name: 'Splash',
    desc: 'Een vrolijke vis die graag rondjes zwemt.',
    icon: '🐟'
  },
  {
    type: 'dog',
    name: 'Luna',
    desc: 'Een lieve hond die graag met kinderen speelt.',
    icon: '🐶'
  },
  {
    type: 'cat',
    name: 'Tijger',
    desc: 'Een stoere kater met een zachte kant.',
    icon: '🐱'
  },
  {
    type: 'horse',
    name: 'Donder',
    desc: 'Een krachtig paard dat graag galoppeert door de wei.',
    icon: '🐴'
  }
];

// Mapping for animal types to Dutch
const typeToDutch = {
  horse: 'Paard',
  dog: 'Hond',
  cat: 'Kat',
  sheep: 'Schaap',
  pony: 'Pony',
  chicken: 'Kip',
  fish: 'Vis'
};

// --- Pagination Variables ---
let dierenCurrentPage = 1;
const dierenPerPage = 18; // Change to 20 for 4x5 grid
let dierenSelectedTypes = [];

// --- Render Function ---
function renderDieren(selectedTypes = []) {
  const grid = document.getElementById('dierenGrid');
  const pagination = document.getElementById('dierenPagination');
  const pageInfo = document.getElementById('dierenPageInfo');
  const prevBtn = document.getElementById('dierenPrev');
  const nextBtn = document.getElementById('dierenNext');
  if (!grid) return;

  // Filter animals
  let filtered;
  if (selectedTypes.length === 0) {
    filtered = dieren;
  } else {
    filtered = dieren.filter(d => selectedTypes.includes(d.type));
  }

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / dierenPerPage);
  if (dierenCurrentPage > totalPages) dierenCurrentPage = 1;
  const start = (dierenCurrentPage - 1) * dierenPerPage;
  const end = start + dierenPerPage;
  const pageDieren = filtered.slice(start, end);

  // Render cards
  const imageFiles = [
    'Horse10.jpeg', 'Horse11.jpeg', 'Horse12.jpeg', 'Horse13.jpeg', 'Horse14.jpeg',
    'Horse15.jpeg', 'Horse16.jpeg', 'Horse17.jpeg', 'Horse18.jpeg', 'Horse19.jpeg',
    'Horse20.jpeg', 'Horse21.jpeg', 'Horse22.jpeg', 'Horse23.jpeg', 'Horse24.jpeg',
    'Horse25.jpeg', 'Horse26.jpeg', 'Horse27.jpeg', 'Horse28.jpeg', 'Horse29.jpeg',
    'Horse30.jpeg', 'Horse31.jpeg', 'Horse32.jpeg', 'Horse33.jpeg', 'Horse34.jpeg'
  ];
  const typeColors = {
    horse:   "#eafbe7",
    pony:    "#f0fbe7",
    chicken: "#fdf6e3",
    cat:     "#e7f7f0",
    dog:     "#fff5e0",
    sheep:   "#f5f5f5",
    fish:    "#e7f4fb"
  };
  const typeAccentColors = {
    horse:   "#9CAF88",
    pony:    "#B8D4BA",
    chicken: "#f2e6b8",
    cat:     "#6B8E6B",
    dog:     "#ffd699",
    sheep:   "#cccccc",
    fish:    "#b8d4e6"
  };
  grid.innerHTML = pageDieren.map((dier, idx) => {
    const imgFile = imageFiles[idx % imageFiles.length] || 'Horse10.jpeg';
    const typeKey = (dier.type || '').toLowerCase();
    const color = typeColors[typeKey] || typeColors['horse'];
    const accent = typeAccentColors[typeKey] || typeAccentColors['horse'];
    return `
      <div class="dier-card" style="background: ${color}; border: 4px solid ${accent}">
        <div class="dier-card-border">
          <div class="dier-card-header">
            <div class="dier-card-type" style="background: ${accent}">${typeToDutch[dier.type] || dier.type}</div>
            <div class="dier-card-name">${dier.name}</div>
          </div>
          <div class="dier-card-photo" style="border: 3px solid ${accent}">
            <img src="Images/${imgFile}" alt="${dier.name}">
          </div>
          <div class="dier-card-desc">${dier.desc}</div>
        </div>
      </div>
    `;
  }).join('');

  // Pagination controls
  if (pagination) {
    if (totalPages > 1) {
      pagination.style.display = '';
      pageInfo.textContent = `Pagina ${dierenCurrentPage} van ${totalPages}`;
      prevBtn.disabled = dierenCurrentPage === 1;
      nextBtn.disabled = dierenCurrentPage === totalPages;
    } else {
      pagination.style.display = 'none';
    }
  }
}

function updateFilterButtonStyles() {
  document.querySelectorAll('.dieren-filter').forEach(btn => {
    const typeKey = (btn.dataset.type || '').toLowerCase();
    const color = typeColors[typeKey] || typeColors['horse'];
    const accent = typeAccentColors[typeKey] || typeAccentColors['horse'];
    if (btn.classList.contains('active')) {
      btn.style.background = accent;
      btn.style.color = '#fff';
      btn.style.border = `2px solid ${accent}`;
    } else {
      btn.style.background = color;
      btn.style.color = '#2D4A2D';
      btn.style.border = `2px solid ${accent}`;
    }
  });
}

function setupFilterButtons() {
  document.querySelectorAll('.dieren-filter').forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.toggle('active');
      dierenSelectedTypes = Array.from(document.querySelectorAll('.dieren-filter.active')).map(b => b.dataset.type);
      dierenCurrentPage = 1; // Reset to first page on filter
      renderDieren(dierenSelectedTypes);
    });
  });
}

// --- Filter Buttons & Pagination Events ---
document.addEventListener('DOMContentLoaded', function() {
  dierenSelectedTypes = [];
  renderDieren(dierenSelectedTypes);
  setupFilterButtons();

  // Pagination buttons
  const prevBtn = document.getElementById('dierenPrev');
  const nextBtn = document.getElementById('dierenNext');
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function() {
      if (dierenCurrentPage > 1) {
        dierenCurrentPage--;
        renderDieren(dierenSelectedTypes);
      }
    });
    nextBtn.addEventListener('click', function() {
      dierenCurrentPage++;
      renderDieren(dierenSelectedTypes);
    });
  }
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