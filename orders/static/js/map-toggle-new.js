// Map Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('[DEBUG] DOM fully loaded, initializing map toggle...');
    console.log('[DEBUG] Leaflet available:', typeof L !== 'undefined' ? 'Yes' : 'No');
    
    // Debug: List all elements with IDs that start with 'map'
    console.log('[DEBUG] Map elements:', document.querySelectorAll('[id^="map"]'));
    
    // Get elements
    const mapToggleBtn = document.getElementById('mapToggleBtn');
    const closeMapBtn = document.getElementById('closeMapBtn');
    const mapContainer = document.getElementById('mapContainer');
    const mapElement = document.getElementById('map');
    const mapLoading = document.getElementById('map-loading');
    let map = null;
    
    // Check if required elements exist
    if (!mapToggleBtn || !mapContainer || !mapElement) {
        console.error('Required elements not found');
        return;
    }
    
    // Function to show/hide the map
    function toggleMap(show) {
        if (show) {
            mapContainer.classList.remove('d-none');
            mapToggleBtn.innerHTML = '<i class="fas fa-map-marked-alt me-2"></i>Hide Map';
            
            // Initialize map if not already done
            if (!window.mapInitialized) {
                initMap();
            } else if (map) {
                // If map exists but is hidden, invalidate size when shown
                setTimeout(() => map.invalidateSize(), 100);
            }
        } else {
            mapContainer.classList.add('d-none');
            mapToggleBtn.innerHTML = '<i class="fas fa-map-marked-alt me-2"></i>Show Map';
        }
    }
    
    // Initialize the map
    function initMap() {
        if (window.mapInitialized) return;
        
        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            console.error('Leaflet not loaded');
            if (mapLoading) {
                mapLoading.innerHTML = `
                    <div class="alert alert-danger m-3">
                        <h5>Map Error</h5>
                        <p>Failed to load map library. Please refresh the page.</p>
                    </div>
                `;
            }
            return;
        }
        
        try {
            // Show loading state
            if (mapLoading) mapLoading.style.display = 'flex';
            
            // Create map instance
            map = L.map('map').setView([11.5833, 124.4500], 14);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map);
            
            // Add marker for Naval, Biliran
            const marker = L.marker([11.5833, 124.4500]).addTo(map);
            marker.bindPopup("<b>Naval, Biliran</b><br>Laundry Service Area").openPopup();
            
            // Add service area circle (5km radius)
            L.circle([11.5833, 124.4500], {
                color: '#0d6efd',
                fillColor: '#0d6efd',
                fillOpacity: 0.1,
                radius: 5000 // 5km in meters
            }).addTo(map);
            
            // Hide loading spinner
            if (mapLoading) mapLoading.style.display = 'none';
            
            // Mark as initialized
            window.mapInitialized = true;
            console.log('Map initialized successfully');
            
        } catch (error) {
            console.error('Error initializing map:', error);
            if (mapLoading) {
                mapLoading.innerHTML = `
                    <div class="alert alert-danger m-3">
                        <h5>Error Loading Map</h5>
                        <p>${error.message || 'Unknown error occurred'}</p>
                    </div>
                `;
            }
        }
    }
    
    // Event listeners
    mapToggleBtn.addEventListener('click', () => {
        const isVisible = !mapContainer.classList.contains('d-none');
        toggleMap(!isVisible);
    });
    
    if (closeMapBtn) {
        closeMapBtn.addEventListener('click', () => toggleMap(false));
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (map && !mapContainer.classList.contains('d-none')) {
            setTimeout(() => map.invalidateSize(), 100);
        }
    });
    
    console.log('Map toggle initialized');
});
