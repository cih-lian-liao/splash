document.addEventListener("DOMContentLoaded", function () {
    // Determine the correct path based on the current location
    let navbarPath = "components/navigation.html";
    
    // If we're in a subdirectory (like /pages/map/), use relative path
    if (window.location.pathname.includes('/pages/')) {
        navbarPath = "../../components/navigation.html";
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
                "pages/map/index.html": "map-link",
                "pages/parking/index.html": "parking-link",
                "pages/reports/index.html": "reports-link",
                "pages/emergency/index.html": "emergency-link"
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
    // Since we're using absolute paths in navigation.html, 
    // we only need to handle GitHub Pages case
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    if (isGitHubPages) {
        // For GitHub Pages, we need to add the repository name to the path
        const repoName = window.location.pathname.split('/')[1];
        const basePath = `/${repoName}`;
        
        // Fix all links in the navbar
        const navLinks = document.querySelectorAll('.nav-item, .nav-title, .mobile-nav-btn');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/')) {
                link.setAttribute('href', basePath + href);
            }
        });
        
        // Fix hamburger icon
        const hamburgerIcon = document.querySelector('.header__hamburger-icon');
        if (hamburgerIcon) {
            const src = hamburgerIcon.getAttribute('src');
            if (src && src.startsWith('/')) {
                hamburgerIcon.setAttribute('src', basePath + src);
            }
        }
    }
}