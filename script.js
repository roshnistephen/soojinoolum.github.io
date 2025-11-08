// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navUl = document.querySelector('nav ul');
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    if (hamburger && navUl) {
        // Toggle menu when clicking hamburger
        hamburger.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            const isActive = hamburger.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', function() {
            closeMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navUl.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navUl.classList.contains('active')) {
                closeMenu();
            }
        });

        // Prevent body scroll when menu is open
        function openMenu() {
            hamburger.classList.add('active');
            navUl.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            hamburger.classList.remove('active');
            navUl.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Make brand/logo clickable to navigate home
    const brands = document.querySelectorAll('.brand');
    brands.forEach(brand => {
        brand.addEventListener('click', function(e) {
            // Only navigate if not clicking on a link inside brand
            if (!e.target.closest('a')) {
                // Navigate to root, works from any subdirectory
                const currentPath = window.location.pathname;
                const isHomePage = currentPath.endsWith('index.html') || currentPath.endsWith('/');
                if (!isHomePage) {
                    window.location.href = 'index.html';
                }
            }
        });
    });
    
    // Contact Form Submission Handler
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Display success message
            alert(`Thank you for contacting SOOJI_NOOLUM, ${name}!\n\nWe have received your message and will get back to you within 24 hours.\n\nThis is a demo form. In production, this would send your inquiry to our team.`);
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});