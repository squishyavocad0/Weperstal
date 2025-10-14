// Hidden admin access - Type "INGRID"
let secretCode = [];
const secretSequence = 'INGRID';

// Date formatting utility - European format dd/mm/yyyy
function formatDateEuropean(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

document.addEventListener('keydown', function(e) {
    secretCode += e.key.toLowerCase();
    if (secretCode.length > secretSequence.length) {
        secretCode = secretCode.slice(-secretSequence.length);
    }
    if (secretCode === secretSequence.toLowerCase()) {
        window.location.href = '/admin.html';
        secretCode = '';
    }
});

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

// --- Animals from backend ---
let dieren = [];
async function fetchDieren() {
  try {
    const res = await fetch('/api/animals');
    if (!res.ok) throw new Error('Failed to load animals');
    dieren = await res.json();
  } catch (e) {
    dieren = [];
  }
}

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
    const typeKey = (dier.type || '').toLowerCase();
    const color = typeColors[typeKey] || typeColors['horse'];
    const accent = typeAccentColors[typeKey] || typeAccentColors['horse'];
    
    // Use image_url from database, fallback to default horse image
    const imageUrl = dier.image_url || 'Images/Horse10.jpeg';
    
    return `
      <div class="dier-card" style="background: ${color}; border: 4px solid ${accent}">
        <div class="dier-card-border">
          <div class="dier-card-header">
            <div class="dier-card-type" style="background: ${accent}">${typeToDutch[dier.type] || dier.type}</div>
            <div class="dier-card-name">${dier.name}</div>
          </div>
          <div class="dier-card-photo" style="border: 3px solid ${accent}">
            <img src="${imageUrl}" alt="${dier.name}" onerror="this.src='Images/Horse10.jpeg'">
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
document.addEventListener('DOMContentLoaded', async function() {
  dierenSelectedTypes = [];
  await fetchDieren();
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
async function renderBlogPosts() {
  const blogGrid = document.getElementById('blogGrid');
  const blogEmpty = document.getElementById('blogEmpty');
  if (!blogGrid) return;
  try {
    const res = await fetch('/api/posts');
    const posts = await res.json();
    if (!posts.length) {
      blogGrid.innerHTML = '';
      if (blogEmpty) blogEmpty.style.display = '';
      return;
    }
    if (blogEmpty) blogEmpty.style.display = 'none';
    blogGrid.innerHTML = posts.map(post => `
      <div class="blog-card">
        <img class="blog-image" src="${post.image || 'Images/header.jpg'}" alt="${post.title}">
        <div class="blog-title">${post.title}</div>
        <div class="blog-date">${formatDateEuropean(post.date)}</div>
        <div class="blog-story">${post.story}</div>
      </div>
    `).join('');
  } catch (e) {
    blogGrid.innerHTML = '';
    if (blogEmpty) blogEmpty.style.display = '';
  }
}

// Render blog posts on page load
document.addEventListener('DOMContentLoaded', renderBlogPosts);

// --- Blog Admin Logic ---
// Admin-specific logic is now handled in admin.html via a module script (Supabase auth + CRUD)

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