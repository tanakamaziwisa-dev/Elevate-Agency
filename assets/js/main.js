const products = [
  {
    id: 'sa-job-pack-2026',
    title: 'South Africa Job Application Pack 2026',
    category: 'Jobs & CV Kits',
    shortDescription: 'ATS CV templates, cover letters, and interview scripts for SA-targeted applications.',
    priceUSD: 20,
    whatYouGet: ['3 ATS-friendly CV templates', 'WhatsApp-ready cover letter templates', 'Interview answer scripts', 'LinkedIn profile optimization checklist'],
    delivery: 'Instant download + WhatsApp support'
  },
  {
    id: 'uk-student-visa-checklist',
    title: 'UK Student Visa Checklist Pack',
    category: 'Migration Guides',
    shortDescription: 'Step-by-step checklist to simplify your UK student visa preparation.',
    priceUSD: 25,
    whatYouGet: ['Application timeline', 'Required documents checklist', 'Common mistakes to avoid', 'Interview readiness notes'],
    delivery: 'WhatsApp delivery'
  },
  {
    id: 'usd-online-starter',
    title: 'Make USD Online in Zimbabwe Starter Kit',
    category: 'Make USD Online',
    shortDescription: 'Freelance setup guide with platform profile templates and payout pathways.',
    priceUSD: 30,
    whatYouGet: ['Freelance profile templates', 'Client pitch scripts', 'Remote job sourcing blueprint', 'Zimbabwe payment options guide'],
    delivery: 'Instant download'
  },
  {
    id: 'alevel-accounting-pack',
    title: 'A-Level Accounting Success Pack',
    category: 'Exam Success Packs',
    shortDescription: 'Revision system, model answers, and high-yield exam strategy.',
    priceUSD: 12,
    whatYouGet: ['Condensed accounting notes', 'Model structured answers', '90-day revision planner', 'Past-paper strategy'],
    delivery: 'Instant download'
  },
  {
    id: 'hustle-launch-kit',
    title: 'Small Business Starter Kit (Zimbabwe)',
    category: 'Business Starter Kits',
    shortDescription: 'Build and structure your hustle with pricing sheets and tracking tools.',
    priceUSD: 18,
    whatYouGet: ['Startup checklist', 'Pricing calculator', 'Simple accounting spreadsheet', 'Growth action template'],
    delivery: 'Instant download'
  },
  {
    id: 'loan-approval-pack',
    title: 'Loan & Microfinance Approval Guide',
    category: 'Loan & Finance Tools',
    shortDescription: 'Prepare stronger loan applications and improve approval readiness.',
    priceUSD: 22,
    whatYouGet: ['Document preparation pack', 'Financial profile improvement guide', 'Loan pitch template', 'Risk and interest clarity sheet'],
    delivery: 'WhatsApp delivery'
  }
];

const categoryOrder = ['All', ...new Set(products.map((item) => item.category))];
const THEME_KEY = 'elevate-theme';

function formatPrice(value) {
  return `$${value.toFixed(2)} USD`;
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;
  const dark = theme === 'dark';
  toggle.textContent = dark ? '☀️' : '🌙';
  toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initial);

  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  });
}

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('#nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    links.classList.toggle('open');
  });
}

function initRevealAnimations() {
  const nodes = document.querySelectorAll('.reveal');
  if (!nodes.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  nodes.forEach((node) => observer.observe(node));
}

function renderFeatured() {
  const container = document.querySelector('#featured-card');
  if (!container) return;

  const featured = products[0];
  container.innerHTML = `
    <div class="featured-topline">
      <p class="meta">🔥 ${featured.title}</p>
      <span class="badge">Updated for 2026</span>
    </div>
    <h3>${featured.shortDescription}</h3>
    <p class="meta">${formatPrice(featured.priceUSD)} • ${featured.delivery}</p>
    <a class="btn btn-secondary" href="product.html?id=${featured.id}">View Pack →</a>
  `;
}

function renderProducts(filter = 'All') {
  const list = document.querySelector('#products-list');
  if (!list) return;

  const filtered = filter === 'All' ? products : products.filter((p) => p.category === filter);
  list.innerHTML = filtered.map((product) => `
    <article>
      <p class="meta">${product.category}</p>
      <h2>${product.title}</h2>
      <p>${product.shortDescription}</p>
      <p class="price">${formatPrice(product.priceUSD)}</p>
      <p class="meta">${product.delivery}</p>
      <a class="btn btn-secondary" href="product.html?id=${product.id}">View Details</a>
    </article>
  `).join('');
}

function renderFilters() {
  const wrap = document.querySelector('#category-filters');
  if (!wrap) return;

  wrap.innerHTML = categoryOrder.map((category, index) => `
    <button type="button" class="${index === 0 ? 'active' : ''}" data-filter="${category}">${category}</button>
  `).join('');

  wrap.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;

    wrap.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    renderProducts(button.dataset.filter);
  });
}

function renderProductDetail() {
  const container = document.querySelector('#product-detail');
  if (!container) return;

  const productId = new URLSearchParams(window.location.search).get('id');
  const found = products.find((item) => item.id === productId);

  if (!found) {
    container.innerHTML = `
      <h1>Product Not Found</h1>
      <p>The requested product could not be found. Please browse all available packs below.</p>
      <a class="btn btn-primary" href="products.html">Go to Products</a>
    `;
    return;
  }

  const bulletItems = found.whatYouGet.map((bullet) => `<li>${bullet}</li>`).join('');
  const whatsappText = encodeURIComponent(`Hi Elevate Agency, I want to buy: ${found.title}`);

  container.innerHTML = `
    <p class="meta">${found.category}</p>
    <h1>${found.title}</h1>
    <p>${found.shortDescription}</p>
    <p><strong>Problem it solves:</strong> Gives you a practical, Zimbabwe-ready step-by-step approach for this goal.</p>
    <p><strong>Who it's for:</strong> Zimbabweans who want clear guidance and actionable templates.</p>
    <h2>What’s inside</h2>
    <ul>${bulletItems}</ul>
    <p class="price">${formatPrice(found.priceUSD)}</p>
    <p><strong>Payment options:</strong> EcoCash / Bank Transfer / USD (confirm via WhatsApp).</p>
    <p><strong>Delivery:</strong> ${found.delivery}</p>
    <div class="product-actions">
      <a class="btn btn-primary" href="https://wa.me/263000000000?text=${whatsappText}" target="_blank" rel="noopener">Pay via WhatsApp</a>
      <a class="btn btn-secondary" href="products.html">Back to Products</a>
    </div>
  `;
}

function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    window.alert('Thanks for reaching out. Please continue on WhatsApp for fastest support.');
    form.reset();
  });
}

function initByPage() {
  const page = document.body.dataset.page;
  if (page === 'home') renderFeatured();
  if (page === 'products') {
    renderFilters();
    renderProducts();
  }
  if (page === 'product') renderProductDetail();
}

initTheme();
initNavToggle();
initRevealAnimations();
initByPage();
initContactForm();
