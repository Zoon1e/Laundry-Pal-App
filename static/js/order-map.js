// Global map variable
let map = null;

// Initialize the map
function initMap() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet not loaded. Retrying in 1 second...');
        setTimeout(initMap, 1000);
        return;
    }
    
    // Get map elements
    const mapLoading = document.getElementById('map-loading');
    const mapContainer = document.getElementById('map-container');
    const mapView = document.getElementById('mapView');
    
    // If map view is visible, initialize the map
    if (mapView && mapView.style.display !== 'none') {
        // Show map container and hide loading spinner
        if (mapLoading) mapLoading.style.display = 'none';
        if (mapContainer) {
            mapContainer.style.display = 'block';
            
            // Only initialize map if it doesn't exist
            if (!map) {
                initializeMap();
            } else {
                // If map exists, just update its size and markers
                setTimeout(() => {
                    map.invalidateSize();
                    updateMapMarkers();
                }, 100);
            }
        }
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map toggle functionality
    initMapToggle();
    
    // Also try initializing after a short delay in case Leaflet loads late
    setTimeout(initMap, 500);
});

// Initialize map toggle functionality
function initMapToggle() {
    const mapViewToggle = document.getElementById('mapViewToggle');
    const mapView = document.getElementById('mapView');
    const ordersGrid = document.querySelector('.orders-grid');
    
    // Set initial map view state
    if (mapViewToggle && mapViewToggle.checked) {
        if (mapView) mapView.style.display = 'block';
        if (ordersGrid) ordersGrid.classList.add('col-lg-8');
        // Initialize map after a short delay to ensure DOM is ready
        setTimeout(initMap, 100);
    }
    
    if (!mapViewToggle) {
        console.error('Map view toggle not found');
        return;
    }
    
    // Toggle map view
    mapViewToggle.addEventListener('change', function() {
        const isChecked = this.checked;
        
        // Toggle map visibility and adjust layout
        if (mapView) mapView.style.display = isChecked ? 'block' : 'none';
        if (ordersGrid) {
            ordersGrid.classList.toggle('col-lg-8', isChecked);
        }
        
        // Initialize or update the map if showing
        if (isChecked) {
            initMap();
        }
            
            // Ensure map element is visible and has dimensions
            if (mapElement) {
                mapElement.style.display = 'block';
                mapElement.style.visibility = 'visible';
                
                // Force reflow and initialize map
                setTimeout(() => {
                    if (isChecked) {
                        initMap();
                    }
                }, 100);
                try {
                    if (!window.L) {
                        console.error('Leaflet library not loaded');
                        return;
                    }
                    
                    if (!map) {
                        console.log('Initializing new map...');
                        initializeMap();
                    } else {
                        console.log('Refreshing existing map...');
                        setTimeout(() => {
                            map.invalidateSize({animate: false});
                            map.setView(NAVAL_CENTER, 14, {animate: false});
                        }, 100);
                    }
                } catch (error) {
                    console.error('Error initializing map:', error);
                }
            }
        }
    });
    
    // Coordinates for Naval, Biliran, Philippines (centered on the town proper)
    const NAVAL_CENTER = [11.5833, 124.4667]; // [latitude, longitude]
    
    // Initialize Leaflet map
    function initializeMap() {
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) {
            console.error('Map container not found');
            return false;
        }
        
        console.log('Initializing map...');
        
        // Remove existing map if it exists
        if (map) {
            map.remove();
            map = null;
        }
        
        // Show loading state
        const mapLoading = document.getElementById('map-loading');
        if (mapLoading) mapLoading.style.display = 'flex';  
        
        try {
            // Create map with minimal options
            map = L.map('map-container', {
                center: NAVAL_CENTER,
                zoom: 14,
                zoomControl: false,
                preferCanvas: true,
                renderer: L.canvas(),
                tap: false,
                fadeAnimation: false,
                zoomAnimation: false,
                markerZoomAnimation: false,
                // Ensure proper touch handling
                touchZoom: true,
                scrollWheelZoom: true,
                doubleClickZoom: true,
                boxZoom: true,
                keyboard: true
            });
            
            // Force update of container size
            map.whenReady(function() {
                map.invalidateSize();
            });
            
            console.log('Map instance created');
            
            // Add basic controls
            L.control.zoom({
                position: 'topright'
            }).addTo(map);
            
            // Add OpenStreetMap tile layer with error handling
            const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
                errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                crossOrigin: true
            }).addTo(map);
            
            // Add error handling for tile loading
            map.on('tileerror', function(error) {
                console.error('Error loading map tiles:', error);
                // Show error message to user
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-warning position-absolute top-0 start-0 m-2';
                errorDiv.style.zIndex = '1000';
                errorDiv.innerHTML = 'Map tiles failed to load. Trying to reconnect...';
                document.getElementById('map').appendChild(errorDiv);
                
                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorDiv.remove();
                }, 5000);
            });
            
            // Add scale control
            L.control.scale({
                imperial: false,
                metric: true,
                position: 'bottomright'
            }).addTo(map);
            
            // Add fullscreen control
            map.addControl(new L.Control.Fullscreen({
                title: 'View Fullscreen',
                titleCancel: 'Exit Fullscreen',
                content: '<i class="fas fa-expand"></i>', 
                forceSeparateButton: true
            }));
            
            // Add geolocation control
            L.control.locate({
                position: 'bottomright',
                drawCircle: true,
                flyTo: true,
                showPopup: false,
                locateOptions: {
                    maxZoom: 16,
                    enableHighAccuracy: true
                },
                strings: {
                    title: 'Show my location',
                    popup: 'You are within {distance} {unit} from this point',
                    outsideMapBoundsMsg: 'You seem to be located outside the map area'
                }
            }).addTo(map);
            
            // Update map markers
            updateMapMarkers();
            
            // Hide loading spinner
            const mapLoading = document.getElementById('map-loading');
            if (mapLoading) mapLoading.style.display = 'none';
            
            console.log('Map initialized successfully');
            return true;
            
        } catch (error) {
            console.error('Failed to initialize map:', error);
            if (map) {
                try {
                    map.remove();
                } catch (e) {
                    console.error('Error removing map:', e);
                }
                map = null;
            }
            
            // Show error message to user
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger';
            errorDiv.innerHTML = 'Failed to load map. Please try refreshing the page or check your internet connection.';
            mapElement.appendChild(errorDiv);
            
            return false;
        }
        
        // Function to update map markers based on current orders
        function updateMapMarkers() {
            if (!map) return;
            
            // Clear existing markers but keep base layers
            map.eachLayer(layer => {
                if (layer instanceof L.Marker || (layer instanceof L.LayerGroup && layer !== map.attributionControl)) {
                    map.removeLayer(layer);
                }
            });
            
            // Get all order cards
            const orderCards = document.querySelectorAll('.order-card');
            const markers = [];
            const hasValidLocations = Array.from(orderCards).some(card => {
                const lat = parseFloat(card.dataset.lat);
                const lng = parseFloat(card.dataset.lng);
                return !isNaN(lat) && !isNaN(lng);
            });
            
            orderCards.forEach(card => {
                try {
                    const status = card.dataset.status || 'pending';
                    let lat = parseFloat(card.dataset.lat);
                    let lng = parseFloat(card.dataset.lng);
                    const orderId = card.dataset.orderId || '';
                    const orderNumber = card.dataset.orderNumber || '';
                    const address = card.dataset.address || 'Location not specified';
                    const statusClass = getStatusClass(status);
                    
                    // If no valid coordinates, use a position near the center (with some randomness)
                    if (isNaN(lat) || isNaN(lng)) {
                        if (hasValidLocations) {
                            // Skip orders without valid locations if we have at least one valid one
                            return;
                        }
                        // Otherwise, distribute markers around the center
                        const angle = Math.random() * Math.PI * 2;
                        const radius = 0.01 + Math.random() * 0.02;
                        lat = NAVAL_CENTER[0] + Math.cos(angle) * radius;
                        lng = NAVAL_CENTER[1] + Math.sin(angle) * radius;
                    }
                    
                    // Create custom icon based on status
                    const icon = L.divIcon({
                        className: 'custom-marker',
                        html: `<div class="marker-icon ${statusClass}" style="background-color: ${getStatusColor(statusClass)}; cursor: pointer;">
                                  <i class="fas ${getStatusIcon(status)}"></i>
                              </div>`,
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -32]
                    });
                    
                    // Create marker
                    const marker = L.marker([lat, lng], {
                        title: `Order #${orderNumber}`,
                        alt: `Order #${orderNumber}`,
                        icon: icon,
                        riseOnHover: true,
                        zIndexOffset: status === 'delivered' ? 1000 : 0 // Bring delivered orders to front
                    });
                    
                    // Add popup with order info
                    marker.bindPopup(`
                        <div class="map-popup">
                            <h6 class="fw-bold mb-1">Order #${orderNumber}</h6>
                            <p class="mb-2">
                                <span class="badge ${statusClass} text-uppercase">${status.replace(/_/g, ' ')}</span>
                            </p>
                            <p class="small text-muted mb-2">
                                <i class="fas fa-map-marker-alt me-1"></i> ${address}
                            </p>
                            <div class="d-flex gap-2">
                                <a href="/orders/${orderId}/" class="btn btn-sm btn-primary flex-grow-1">
                                    <i class="fas fa-eye me-1"></i> View
                                </a>
                                <button class="btn btn-sm btn-outline-secondary" onclick="event.stopPropagation(); this.blur();">
                                    <i class="fas fa-directions"></i>
                                </button>
                            </div>
                        </div>
                    `);
                    
                    // Add click handler to scroll to order
                    marker.on('click', function(e) {
                        const orderCard = document.querySelector(`.order-card[data-order-id="${orderId}"]`);
                        if (orderCard) {
                            orderCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            // Add highlight effect
                            orderCard.classList.add('highlight-order');
                            setTimeout(() => {
                                orderCard.classList.remove('highlight-order');
                            }, 2000);
                        }
                    });
                    
                    // Add marker to map and markers array
                    marker.addTo(map);
                    markers.push(marker);
                    
                } catch (error) {
                    console.error('Error adding order marker:', error);
                }
            });
            
            // Fit map to show all markers if there are any
            if (markers.length > 0) {
                const group = L.featureGroup(markers);
                
                // Only fit bounds if we have valid locations or this is the first load
                if (!hasValidLocations || !map._loaded) {
                    map.fitBounds(group.getBounds().pad(0.1));
                }
            } else if (!map._loaded) {
                // If no markers but first load, center on default location
                map.setView(NAVAL_CENTER, 14);
            }
            
            // Mark map as loaded
            if (map) {
                map._loaded = true;
            }
        }
        
        // Helper function to get status class
        function getStatusClass(status) {
            const statusLower = status.toLowerCase();
            if (statusLower.includes('deliver') || statusLower.includes('complete')) {
                return 'bg-success';
            } else if (statusLower.includes('progress') || statusLower.includes('process') || statusLower.includes('wash')) {
                return 'bg-warning';
            } else if (statusLower.includes('cancel')) {
                return 'bg-danger';
            } else if (statusLower.includes('ready')) {
                return 'bg-info';
            } else {
                return 'bg-primary';
            }
        }
        
        // Helper function to get status color
        function getStatusColor(statusClass) {
            const colors = {
                'bg-success': '#28a745',
                'bg-warning': '#ffc107',
                'bg-danger': '#dc3545',
                'bg-info': '#17a2b8',
                'bg-primary': '#007bff',
                'bg-secondary': '#6c757d'
            };
            return colors[statusClass] || '#007bff';
        }
        
        // Helper function to get status icon
        function getStatusIcon(status) {
            const statusLower = status.toLowerCase();
            if (statusLower.includes('deliver') || statusLower.includes('complete')) {
                return 'fa-check-circle';
            } else if (statusLower.includes('progress') || statusLower.includes('process') || statusLower.includes('wash')) {
                return 'fa-sync-alt';
            } else if (statusLower.includes('cancel')) {
                return 'fa-times-circle';
            } else if (statusLower.includes('ready')) {
                return 'fa-check-circle';
            } else if (statusLower.includes('pickup')) {
                return 'fa-truck-pickup';
            } else if (statusLower.includes('pending')) {
                return 'fa-clock';
            } else {
                return 'fa-info-circle';
            }
        }
    }
}
