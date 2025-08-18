// Bottom Navbar JavaScript
class BottomNavbar {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.init();
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    // Map file names to navigation items
    if (page === 'index.html' || page === '') return 'home';
    if (page === 'projects.html') return 'projects';
    if (page === 'ToDoList.html') return 'todo';
    if (page === 'game.html') return 'game';
    if (page === 'atm.html') return 'atm';
    
    return 'home'; // default
  }

  createNavbar() {
    const navbar = document.createElement('div');
    navbar.className = 'bottom-navbar';
    navbar.innerHTML = `
      <div class="bottom-navbar-container">
        <a href="index.html" class="bottom-nav-item" data-page="home">
          <i class="fas fa-home bottom-nav-icon"></i>
          <span class="bottom-nav-text">Home</span>
        </a>
        <a href="projects.html" class="bottom-nav-item" data-page="projects">
          <i class="fas fa-folder-open bottom-nav-icon"></i>
          <span class="bottom-nav-text">Projects</span>
        </a>
        <a href="ToDoList.html" class="bottom-nav-item" data-page="todo">
          <i class="fas fa-tasks bottom-nav-icon"></i>
          <span class="bottom-nav-text">Todo</span>
        </a>
        <a href="game.html" class="bottom-nav-item" data-page="game">
          <i class="fas fa-gamepad bottom-nav-icon"></i>
          <span class="bottom-nav-text">Game</span>
        </a>
        <a href="atm.html" class="bottom-nav-item" data-page="atm">
          <i class="fas fa-credit-card bottom-nav-icon"></i>
          <span class="bottom-nav-text">ATM</span>
        </a>
      </div>
    `;
    
    return navbar;
  }

  setActiveItem() {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.page === this.currentPage) {
        item.classList.add('active');
      }
    });
  }

  addEventListeners() {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // Remove active class from all items
        navItems.forEach(navItem => navItem.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
        
        // Optional: Add click animation
        item.style.transform = 'translateY(-3px) scale(0.95)';
        setTimeout(() => {
          item.style.transform = '';
        }, 150);
      });

      // Add hover sound effect (optional)
      item.addEventListener('mouseenter', () => {
        // You can add a subtle sound effect here if needed
        item.style.transition = 'all 0.2s ease';
      });
    });
  }

  addScrollEffect() {
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.bottom-navbar');
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.style.transform = 'translateX(-50%) translateY(100px)';
        navbar.style.opacity = '0';
      } else {
        navbar.style.transform = 'translateX(-50%) translateY(0)';
        navbar.style.opacity = '1';
      }
      
      lastScrollY = currentScrollY;
    });
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupNavbar();
      });
    } else {
      this.setupNavbar();
    }
  }

  setupNavbar() {
    // Create and append navbar
    const navbar = this.createNavbar();
    document.body.appendChild(navbar);
    
    // Set active item
    setTimeout(() => {
      this.setActiveItem();
      this.addEventListeners();
      this.addScrollEffect();
    }, 100);
    
    // Add CSS if not already present
    this.loadCSS();
  }

  loadCSS() {
    // Check if CSS is already loaded
    if (!document.querySelector('link[href*="bottom-navbar.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'bottom-navbar.css';
      document.head.appendChild(link);
    }
  }
}

// Initialize the bottom navbar
const bottomNavbar = new BottomNavbar();

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BottomNavbar;
}
