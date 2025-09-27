document.addEventListener("DOMContentLoaded", function () {
    // Determine the correct path based on the current location
    let navbarPath = "navbar/navbar.html";
    
    // If we're in a subdirectory (like /splash/home/), use relative path
    if (window.location.pathname.includes('/home/') || 
        window.location.pathname.includes('/parking/') || 
        window.location.pathname.includes('/community/') || 
        window.location.pathname.includes('/resources/')) {
        navbarPath = "../navbar/navbar.html";
    }
    
    fetch(navbarPath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load navbar: ${response.status}`);
            }
            return response.text();
        })
        .then((html) => {
            document.getElementById("navbar").innerHTML = html;

            // Fix all relative paths in the navbar for GitHub Pages
            fixNavbarPaths();

            // Highlight the active link based on the current page
            const currentPage = window.location.pathname.split("/").slice(-2).join("/");

            const navLinks = {
                "home/index.html": "home-link",
                "parking/index.html": "parking-link",
                "community/index.html": "community-link",
                "resources/index.html": "emergency-link"
            };

            // Add the active class to the correct link
            for (const [path, id] of Object.entries(navLinks)) {
                if (currentPage.endsWith(path)) {
                    document.getElementById(id).classList.add("active");
                    break;
                }
            }

            const hamburgerButton = document.querySelector(".header__hamburger");
            const navLinksContainer = document.querySelector(".nav-links");
            
            if (hamburgerButton && navLinksContainer) {
                hamburgerButton.addEventListener("click", function () {
                    navLinksContainer.classList.toggle("nav-links--active");
                });
            }
        })
        .catch((error) => console.error("Error loading navbar:", error));

});

// Function to fix navbar paths for GitHub Pages compatibility
function fixNavbarPaths() {
    // Determine base path for GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    const isSubPage = window.location.pathname.includes('/home/') || 
                     window.location.pathname.includes('/parking/') || 
                     window.location.pathname.includes('/community/') || 
                     window.location.pathname.includes('/resources/');
    
    let basePath = '';
    if (isGitHubPages && isSubPage) {
        basePath = '../';
    } else if (isGitHubPages && !isSubPage) {
        basePath = './';
    }
    
    // Fix all links in the navbar
    const navLinks = document.querySelectorAll('.nav-item, .nav-title');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('../')) {
            link.setAttribute('href', basePath + href.replace('../', ''));
        } else if (href && href.startsWith('./')) {
            link.setAttribute('href', basePath + href.replace('./', ''));
        }
    });
    
    // Fix CSS link
    const cssLink = document.querySelector('link[href*="styles.css"]');
    if (cssLink) {
        const href = cssLink.getAttribute('href');
        if (href && href.startsWith('../')) {
            cssLink.setAttribute('href', basePath + href.replace('../', ''));
        }
    }
    
    // Fix hamburger icon
    const hamburgerIcon = document.querySelector('.header__hamburger-icon');
    if (hamburgerIcon) {
        const src = hamburgerIcon.getAttribute('src');
        if (src && src.startsWith('../')) {
            hamburgerIcon.setAttribute('src', basePath + src.replace('../', ''));
        }
    }
}