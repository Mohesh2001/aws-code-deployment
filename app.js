// Sample knowledge data
const sampleKnowledgeItems = [
  {
    "id": "1",
    "title": "Sacred Kumara Planting Site",
    "description": "Traditional planting ground used by our ancestors for cultivating kumara (sweet potato) using ancient Māori techniques.",
    "detailedDescription": "This site has been used for over 300 years by our whānau for growing kumara. The soil here is enriched with specific minerals that our tīpuna (ancestors) identified as ideal for cultivation. The planting follows the maramataka (lunar calendar) and includes karakia (prayers) before each planting season.",
    "category": "Traditional Agriculture",
    "knowledgeType": "Cultural Practice",
    "location": "Rotorua, New Zealand",
    "geoLocation": "-38.1368,176.2497",
    "country": "New Zealand",
    "city": "Rotorua",
    "userID": "maori_elder_001",
    "imageUrl": "https://images.unsplash.com/photo-1464822759844-d150ad6fab19?w=800",
    "timestamp": "2024-03-15",
    "season": "Spring"
  },
  {
    "id": "2", 
    "title": "Medicinal Kawakawa Plant",
    "description": "Ancient medicinal plant used by Māori for treating cuts, wounds, and stomach ailments.",
    "detailedDescription": "Kawakawa (Piper excelsum) has been used by Māori for centuries as rongoā (traditional medicine). The leaves are prepared in various ways - fresh leaves can be chewed for toothache, while boiled leaves create a healing wash for cuts and skin conditions. Our kuia (female elders) taught us to identify the best plants by looking for leaves with holes made by kawakawa moth caterpillars.",
    "category": "Traditional Medicine",
    "knowledgeType": "Plant Knowledge",
    "location": "Waitakere Ranges, Auckland",
    "geoLocation": "-36.9333,174.5167",
    "country": "New Zealand",
    "city": "Auckland",
    "userID": "rongoa_practitioner_002",
    "imageUrl": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    "timestamp": "2024-04-02",
    "season": "Autumn"
  },
  {
    "id": "3",
    "title": "Ancient Storytelling Circle",
    "description": "Traditional gathering place where tribal stories and legends have been shared for generations.",
    "detailedDescription": "This circular clearing surrounded by ancient pohutukawa trees has served as our pā (village) storytelling circle for over 200 years. During the full moon, our kaumātua (elders) would gather the community here to share pūrākau (traditional stories), whakapapa (genealogy), and tikanga (customs). The acoustics of this natural amphitheater allow stories to be heard clearly by all gathered.",
    "category": "Cultural Sites",
    "knowledgeType": "Oral Tradition",
    "location": "Coromandel Peninsula, New Zealand",
    "geoLocation": "-36.7606,175.4985",
    "country": "New Zealand", 
    "city": "Coromandel",
    "userID": "storyteller_003",
    "imageUrl": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    "timestamp": "2024-02-28",
    "season": "Summer"
  },
  {
    "id": "4",
    "title": "Traditional Fishing Grounds",
    "description": "Sacred fishing waters where sustainable fishing practices have been maintained for centuries.",
    "detailedDescription": "These coastal waters off the Bay of Islands have provided kai moana (seafood) for our iwi (tribe) following strict rāhui (temporary bans) and seasonal restrictions. Our tīpuna established sustainable fishing practices including size limits, seasonal restrictions, and area rotations that allowed fish populations to regenerate. The deeper waters here are known for snapper and kahawai, while the shallows provide shellfish and seaweed.",
    "category": "Traditional Fishing",
    "knowledgeType": "Environmental Management",
    "location": "Bay of Islands, New Zealand",
    "geoLocation": "-35.2636,174.0969",
    "country": "New Zealand",
    "city": "Kerikeri",
    "userID": "fisherman_elder_004",
    "imageUrl": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    "timestamp": "2024-01-20",
    "season": "Summer"
  }
];
// Handle navigation clicks
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const view = link.getAttribute("data-view");
    showView(view);
  });
});

// Function to switch views
function showView(viewId) {
  document.querySelectorAll(".view").forEach(section => {
    section.classList.remove("active");  // hide all
  });
  document.getElementById(`${viewId}-view`).classList.add("active"); // show one

  // Highlight active nav link
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
    if (link.dataset.view === viewId) {
      link.classList.add("active");
    }
  });
}


// Application state
let knowledgeItems = [...sampleKnowledgeItems];
let map = null;
let markers = [];
let currentView = 'home';
let filteredItems = [...knowledgeItems];

// DOM Elements
const views = document.querySelectorAll('.view');
const navLinks = document.querySelectorAll('.nav-link');
const loading = document.getElementById('loading');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application starting...');
    initializeNavigation();
    initializeForms();
    initializeSearch();
    updateKnowledgeGrid();
    updateMapSidebar();
    showView('home');
});

// Navigation
function initializeNavigation() {
    console.log('Initializing navigation...');
    
    // Handle all navigation clicks using event delegation
    document.body.addEventListener('click', function(e) {
        // Handle navigation links and buttons
        if (e.target.hasAttribute('data-view') || e.target.closest('[data-view]')) {
            e.preventDefault();
            const element = e.target.hasAttribute('data-view') ? e.target : e.target.closest('[data-view]');
            const viewName = element.getAttribute('data-view');
            console.log('Navigation clicked:', viewName);
            showView(viewName);
            return;
        }
        
        // Handle knowledge item clicks
        const knowledgeItem = e.target.closest('.knowledge-item, .knowledge-card');
        if (knowledgeItem) {
            const itemId = knowledgeItem.getAttribute('data-id');
            console.log('Knowledge item clicked:', itemId);
            showKnowledgeDetail(itemId);
            return;
        }
        
        // Handle map popup buttons (special case)
        if (e.target.matches('button[onclick*="showKnowledgeDetail"]')) {
            const onclickAttr = e.target.getAttribute('onclick');
            const itemId = onclickAttr.match(/showKnowledgeDetail\('([^']+)'\)/)[1];
            showKnowledgeDetail(itemId);
            return;
        }
    });
    
    console.log('Navigation initialized');
}

function showView(viewName) {
    console.log('Showing view:', viewName);
    
    // Hide all views
    views.forEach(view => {
        view.classList.remove('active');
    });
    
    // Show target view
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('active');
        currentView = viewName;
        
        // Update navigation
        updateNavigation(viewName);
        
        // Initialize view-specific functionality
        if (viewName === 'explore') {
            setTimeout(() => {
                initializeMap();
            }, 100);
        }
        
        if (viewName === 'browse') {
            updateKnowledgeGrid();
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
        console.log('View shown:', viewName);
    } else {
        console.error('View not found:', viewName);
    }
}

function updateNavigation(activeView) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-view') === activeView) {
            link.classList.add('active');
        }
    });
}

// Map functionality
function initializeMap() {
    if (map) {
        console.log('Map already initialized');
        return;
    }
    
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }
    
    console.log('Initializing map...');
    
    try {
        map = new maplibregl.Map({
            container: 'map',
            style: {
                version: 8,
                sources: {
                    'osm': {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '© OpenStreetMap contributors'
                    }
                },
                layers: [
                    {
                        id: 'osm',
                        type: 'raster',
                        source: 'osm'
                    }
                ]
            },
            center: [174.7633, -36.8485],
            zoom: 6
        });
        
        map.on('load', function() {
            console.log('Map loaded');
            addMarkersToMap();
        });
        
        map.on('error', function(e) {
            console.error('Map error:', e);
        });
        
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

function addMarkersToMap() {
    if (!map) {
        console.log('Map not available for markers');
        return;
    }
    
    console.log('Adding markers to map...');
    
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers = [];
    
    knowledgeItems.forEach(item => {
        if (item.geoLocation) {
            const [lat, lng] = item.geoLocation.split(',').map(coord => parseFloat(coord));
            
            // Create marker element
            const markerEl = document.createElement('div');
            markerEl.className = 'map-marker';
            markerEl.style.cssText = `
                width: 12px;
                height: 12px;
                background-color: #6ea8fe;
                border: 2px solid #e9f0ff;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(110, 168, 254, 0.3);
                transition: all 0.3s ease;
            `;
            
            // Create popup
            const popup = new maplibregl.Popup({
                offset: 25,
                className: 'map-popup'
            }).setHTML(`
                <div style="color: #e9f0ff; background: #121a2b; padding: 1rem; border-radius: 8px; min-width: 200px;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #6ea8fe;">${item.title}</h4>
                    <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #9db0d0;">${item.description}</p>
                    <div style="margin-top: 0.75rem;">
                        <span style="background: rgba(110, 168, 254, 0.2); color: #6ea8fe; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">${item.category}</span>
                    </div>
                    <button data-view="detail" data-item-id="${item.id}" style="margin-top: 0.75rem; background: #6ea8fe; color: #00050d; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: 600;">View Details</button>
                </div>
            `);
            
            const marker = new maplibregl.Marker(markerEl)
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(map);
            
            markers.push(marker);
        }
    });
    
    console.log(`Added ${markers.length} markers to map`);
}

function updateMapSidebar() {
    const mapItems = document.getElementById('map-items');
    const itemCount = document.getElementById('item-count');
    
    if (!mapItems || !itemCount) return;
    
    itemCount.textContent = `${knowledgeItems.length} items`;
    
    mapItems.innerHTML = knowledgeItems.map(item => `
        <div class="knowledge-item" data-id="${item.id}">
            <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
            <h4>${item.title}</h4>
            <div class="location">📍 ${item.location}</div>
            <div class="category">${item.category}</div>
        </div>
    `).join('');
}

// Forms
function initializeForms() {
    const addKnowledgeForm = document.getElementById('add-knowledge-form');
    if (addKnowledgeForm) {
        addKnowledgeForm.addEventListener('submit', handleAddKnowledge);
        console.log('Form initialized');
    }
}

function handleAddKnowledge(e) {
    e.preventDefault();
    console.log('Form submitted');
    showLoading();
    
    const formData = new FormData(e.target);
    const newItem = {
        id: (knowledgeItems.length + 1).toString(),
        title: formData.get('title'),
        description: formData.get('description'),
        detailedDescription: formData.get('detailedDescription'),
        category: formData.get('category'),
        knowledgeType: formData.get('knowledgeType'),
        location: formData.get('location'),
        imageUrl: formData.get('imageUrl') || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        timestamp: new Date().toISOString().split('T')[0],
        geoLocation: generateRandomCoords(),
        country: 'New Zealand',
        city: formData.get('location').split(',')[0],
        userID: 'community_user_' + Date.now()
    };
    
    // Simulate API call
    setTimeout(() => {
        knowledgeItems.unshift(newItem);
        filteredItems = [...knowledgeItems];
        updateKnowledgeGrid();
        updateMapSidebar();
        if (map) addMarkersToMap();
        
        e.target.reset();
        hideLoading();
        showSuccessMessage('Knowledge item added successfully!');
        showView('browse');
    }, 1500);
}

function generateRandomCoords() {
    // Generate random coordinates in New Zealand region
    const lat = (-35 + Math.random() * -5).toFixed(4);
    const lng = (174 + Math.random() * 2).toFixed(4);
    return `${lat},${lng}`;
}

// Search and filtering
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryFilter);
    }
}

function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : '';
    filterItems(searchTerm, category);
}

function handleCategoryFilter() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const category = categoryFilter ? categoryFilter.value : '';
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    filterItems(searchTerm, category);
}

function filterItems(searchTerm, category) {
    filteredItems = knowledgeItems.filter(item => {
        const matchesSearch = !searchTerm || 
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.location.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm);
            
        const matchesCategory = !category || item.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    updateKnowledgeGrid();
}

function updateKnowledgeGrid() {
    const knowledgeGrid = document.getElementById('knowledge-grid');
    if (!knowledgeGrid) return;
    
    if (filteredItems.length === 0) {
        knowledgeGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--muted);">
                <h3>No knowledge items found</h3>
                <p>Try adjusting your search terms or filters.</p>
            </div>
        `;
        return;
    }
    
    knowledgeGrid.innerHTML = filteredItems.map(item => `
        <div class="knowledge-card" data-id="${item.id}">
            <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
            <div class="knowledge-card-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="meta">
                    <span class="location">📍 ${item.location}</span>
                    <span class="category">${item.category}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Knowledge detail view
function showKnowledgeDetail(itemId) {
    console.log('Showing knowledge detail for:', itemId);
    const item = knowledgeItems.find(k => k.id === itemId);
    if (!item) {
        console.error('Item not found:', itemId);
        return;
    }
    
    const detailContent = document.getElementById('detail-content');
    if (!detailContent) {
        console.error('Detail content container not found');
        return;
    }
    
    detailContent.innerHTML = `
        <div class="detail-header">
            <h1>${item.title}</h1>
            <div class="detail-meta">
                <span><strong>Location:</strong> ${item.location}</span>
                <span><strong>Category:</strong> ${item.category}</span>
                <span><strong>Type:</strong> ${item.knowledgeType}</span>
                <span><strong>Date:</strong> ${new Date(item.timestamp).toLocaleDateString()}</span>
            </div>
            <div style="margin: 1rem 0;">
                <span class="category" style="background: rgba(110, 168, 254, 0.2); color: var(--primary); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">${item.category}</span>
            </div>
        </div>
        
        <img src="${item.imageUrl}" alt="${item.title}" class="detail-image">
        
        <div class="detail-description">
            <h3>About this Knowledge</h3>
            <p>${item.description}</p>
            
            <h3>Detailed Description</h3>
            <p>${item.detailedDescription}</p>
        </div>
        
        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
            <button class="btn btn-primary" data-view="browse">← Back to Browse</button>
            <button class="btn btn-secondary" data-view="explore">View on Map</button>
        </div>
    `;
    
    showView('detail');
}

// Utility functions
function showLoading() {
    if (loading) loading.classList.remove('hidden');
}

function hideLoading() {
    if (loading) loading.classList.add('hidden');
}

function showSuccessMessage(message) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--accent);
        color: var(--bg);
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .map-marker:hover {
        transform: scale(1.2);
        box-shadow: 0 4px 12px rgba(110, 168, 254, 0.5);
    }
    
    .maplibregl-popup-content {
        background: var(--card) !important;
        border: 1px solid var(--border) !important;
        border-radius: 8px !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
    }
    
    .maplibregl-popup-tip {
        border-top-color: var(--card) !important;
        border-bottom-color: var(--card) !important;
    }
`;
document.head.appendChild(style);

// Mobile menu handling
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            const isVisible = nav.style.display === 'flex';
            
            if (isVisible) {
                nav.style.display = 'none';
            } else {
                nav.style.display = 'flex';
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.left = '0';
                nav.style.right = '0';
                nav.style.background = 'var(--card)';
                nav.style.flexDirection = 'column';
                nav.style.padding = '1rem';
                nav.style.border = '1px solid var(--border)';
                nav.style.borderTop = 'none';
            }
        });
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const nav = document.querySelector('.nav');
    if (window.innerWidth > 768 && nav) {
        nav.style.display = '';
        nav.style.position = '';
        nav.style.top = '';
        nav.style.left = '';
        nav.style.right = '';
        nav.style.background = '';
        nav.style.flexDirection = '';
        nav.style.padding = '';
        nav.style.border = '';
    }
    
    if (map) {
        map.resize();
    }
});

// Global function for map popup buttons (fallback)
window.showKnowledgeDetail = showKnowledgeDetail;
