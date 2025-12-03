// This file contains reusable map-related functions using LeafletJS

// Default map center (Sri Lanka)
const DEFAULT_CENTER = [7.8731, 80.7718];
const DEFAULT_ZOOM = 8;

// Initialize a map instance
function initMap(elementId, center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM) {
    const map = L.map(elementId).setView(center, zoom);

    // Add OpenStreetMap tiles (no API key needed)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return map;
}

// Add a single marker to a map
function addMarker(map, lat, lng, popupContent, options = {}) {
    const marker = L.marker([lat, lng], options).addTo(map);
    if (popupContent) {
        marker.bindPopup(popupContent);
    }
    return marker;
}

// Add a group of clustered markers to a map
function addMarkerCluster(map, persons) {
    const markerClusterGroup = L.markerClusterGroup({
        iconCreateFunction: function (cluster) {
            const count = cluster.getChildCount();
            let size = 'small';
            if (count > 50) size = 'large';
            else if (count > 10) size = 'medium';

            return L.divIcon({
                html: `<div><span>${count}</span></div>`,
                className: `marker-cluster marker-cluster-${size}`,
                iconSize: L.point(40, 40)
            });
        }
    });

    persons.forEach(person => {
        if (person.lastSeenLat && person.lastSeenLng) {
            const markerColor = getMarkerColor(person.status);
            const customIcon = L.divIcon({
                html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
                popupAnchor: [0, -10]
            });

            const marker = L.marker([person.lastSeenLat, person.lastSeenLng], { icon: customIcon });
            const popupContent = createPopupContent(person);
            marker.bindPopup(popupContent);
            markerClusterGroup.addLayer(marker);
        }
    });

    map.addLayer(markerClusterGroup);
    return markerClusterGroup;
}

// Get marker color based on status
function getMarkerColor(status) {
    switch (status) {
        case 'Found':
            return '#198754'; // Green
        case 'Under Review':
            return '#ffc107'; // Yellow
        case 'Missing':
        default:
            return '#dc3545'; // Red
    }
}

// Create HTML content for a map popup
function createPopupContent(person) {
    const lastSeenDate = person.lastSeenDate ?
        new Date(person.lastSeenDate.toDate ? person.lastSeenDate.toDate() : person.lastSeenDate).toLocaleDateString() :
        'Unknown';

    return `
        <div class="popup-content">
            <img src="${person.photoURL || 'https://via.placeholder.com/200x150?text=No+Photo'}" class="img-fluid mb-2" alt="${person.name}">
            <h5>${person.name}</h5>
            <p><strong>Status:</strong> <span class="badge bg-${person.status === 'Found' ? 'success' : person.status === 'Under Review' ? 'warning' : 'danger'}">${person.status || 'Missing'}</span></p>
            <p><strong>Age:</strong> ${person.age || 'Unknown'}</p>
            <p><strong>District:</strong> ${person.district || 'Unknown'}</p>
            <p><strong>Last Seen:</strong> ${lastSeenDate}</p>
            <a href="view.html?id=${person.id}" class="btn btn-primary btn-sm">View Details</a>
        </div>
    `;
}

// Create a location picker map
function createLocationPicker(elementId, onLocationSelect) {
    const map = initMap(elementId);
    let marker = null;

    map.on('click', function (e) {
        const { lat, lng } = e.latlng;

        if (marker) {
            map.removeLayer(marker);
        }

        marker = L.marker([lat, lng]).addTo(map);
        if (onLocationSelect) {
            onLocationSelect(lat, lng);
        }
    });

    return map;
}
