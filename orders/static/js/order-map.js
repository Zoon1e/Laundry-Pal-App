// Initialize the map centered on Naval, Biliran
function initializeMap() {
    // Check if map container exists
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map container not found');
        return;
    }

    try {
        // Initialize the map centered on Naval, Biliran
        const map = L.map('map').setView([11.5833, 124.4500], 14);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        // Add a marker for Naval, Biliran
        const navalMarker = L.marker([11.5833, 124.4500]).addTo(map);
        navalMarker.bindPopup("<b>Naval, Biliran</b><br>Laundry Service Area").openPopup();

        // Add a circle to show the service area (5km radius)
        L.circle([11.5833, 124.4500], {
            color: '#0d6efd',
            fillColor: '#0d6efd',
            fillOpacity: 0.1,
            radius: 5000 // 5km in meters
        }).addTo(map);

        // Add some points of interest
        const pointsOfInterest = [
            {
                name: "Naval Port",
                position: [11.5850, 124.4700],
                type: "port"
            },
            {
                name: "Naval Town Plaza",
                position: [11.5800, 124.4500],
                type: "shopping"
            },
            {
                name: "Biliran Provincial Hospital",
                position: [11.5930, 124.4500],
                type: "hospital"
            }
        ];

        // Add custom icons for different POI types
        const iconMap = {
            port: L.icon({
                iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
                shadowSize: [41, 41]
            }),
            shopping: L.icon({
                iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            }),
            hospital: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            })
        };

        // Add points of interest to the map
        pointsOfInterest.forEach(poi => {
            L.marker(poi.position, {
                icon: poi.type in iconMap ? iconMap[poi.type] : undefined
            })
            .addTo(map)
            .bindPopup(`<b>${poi.name}</b><br>${poi.type.charAt(0).toUpperCase() + poi.type.slice(1)}`);
        });

        // Add scale control
        L.control.scale().addTo(map);

        // Add a search control (requires leaflet-search.js)
        if (L.Control.Search) {
            const searchControl = new L.Control.Search({
                position: 'topright',
                layer: L.layerGroup(pointsOfInterest.map(poi => 
                    L.marker(poi.position).bindPopup(poi.name)
                )),
                propertyName: 'name',
                marker: false,
                moveToLocation: function(latlng, title, map) {
                    map.setView(latlng, 16); // zoom the map to the selected location
                }
            });
            map.addControl(searchControl);
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            map.invalidateSize();
        });

        console.log('Map initialized successfully');
    } catch (error) {
        console.error('Error initializing map:', error);
        mapElement.innerHTML = `
            <div class="alert alert-danger">
                <h5>Error loading map</h5>
                <p>${error.message}</p>
                <p>Please try refreshing the page or contact support if the problem persists.</p>
            </div>
        `;
    }
}

// Initialize the map when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeMap);

// Export for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeMap };
}
