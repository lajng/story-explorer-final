// Map Presenter - Enhanced version with better error handling and performance
class MapPresenter {
    static storiesMap = null;
    static locationMap = null;
    static selectedMarker = null;
    static markersCluster = null;
    static isInitializing = false;

    // Configuration
    static config = {
        defaultCenter: [-6.2088, 106.8456], // Jakarta
        defaultZoom: 10,
        maxZoom: 18,
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
        geolocationTimeout: 10000,
        maxMarkersBeforeClustering: 50
    };

    static initStoriesMap() {
        if (this.isInitializing) return false;
        
        try {
            this.isInitializing = true;
            this.showLoading('stories-map');

            const mapContainer = document.getElementById('stories-map');
            if (!mapContainer) {
                throw new Error('Stories map container not found');
            }

            // Check if Leaflet is loaded
            if (typeof L === 'undefined') {
                throw new Error('Leaflet library not loaded');
            }

            // Clean up existing map
            if (this.storiesMap) {
                this.storiesMap.remove();
                this.storiesMap = null;
            }

            // Initialize map
            this.storiesMap = L.map('stories-map', {
                center: this.config.defaultCenter,
                zoom: this.config.defaultZoom,
                zoomControl: true,
                attributionControl: true
            });

            // Add tile layer
            L.tileLayer(this.config.tileLayer, {
                attribution: this.config.attribution,
                maxZoom: this.config.maxZoom,
                errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
            }).addTo(this.storiesMap);

            // Initialize marker cluster group
            if (typeof L.markerClusterGroup !== 'undefined') {
                this.markersCluster = L.markerClusterGroup({
                    chunkedLoading: true,
                    spiderfyOnMaxZoom: true,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: true
                });
                this.storiesMap.addLayer(this.markersCluster);
            }

            // Add event listeners
            this.storiesMap.on('load', () => {
                this.hideLoading('stories-map');
                console.log('Stories map loaded successfully');
            });

            this.storiesMap.on('error', (e) => {
                console.error('Stories map error:', e);
                this.showError('stories-map', 'Failed to load map tiles');
            });

            this.hideLoading('stories-map');
            this.isInitializing = false;
            return true;

        } catch (error) {
            console.error('Failed to initialize stories map:', error);
            this.showError('stories-map', error.message);
            this.isInitializing = false;
            return false;
        }
    }

    static initLocationMap() {
        if (this.isInitializing) return false;

        try {
            this.isInitializing = true;
            this.showLoading('location-map');

            const mapContainer = document.getElementById('location-map');
            if (!mapContainer) {
                throw new Error('Location map container not found');
            }

            if (typeof L === 'undefined') {
                throw new Error('Leaflet library not loaded');
            }

            // Clean up existing map
            if (this.locationMap) {
                this.locationMap.remove();
                this.locationMap = null;
            }

            // Initialize map
            this.locationMap = L.map('location-map', {
                center: this.config.defaultCenter,
                zoom: 13,
                zoomControl: true,
                attributionControl: true
            });

            // Add tile layer
            L.tileLayer(this.config.tileLayer, {
                attribution: this.config.attribution,
                maxZoom: this.config.maxZoom,
                errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
            }).addTo(this.locationMap);

            // Add click listener for location selection
            this.locationMap.on('click', (e) => this.selectLocation(e.latlng));

            // Add map event listeners
            this.locationMap.on('load', () => {
                this.hideLoading('location-map');
                console.log('Location map loaded successfully');
            });

            this.locationMap.on('error', (e) => {
                console.error('Location map error:', e);
                this.showError('location-map', 'Failed to load map tiles'); 
            });

            // Try to get current location
            this.getCurrentLocation();

            this.hideLoading('location-map');
            this.isInitializing = false;
            return true;

        } catch (error) {
            console.error('Failed to initialize location map:', error);
            this.showError('location-map', error.message);
            this.isInitializing = false;
            return false;
        }
    }

    static getCurrentLocation() {
        if (!navigator.geolocation) {
            this.updateLocationInfo('Geolocation not supported by this browser.');
            return;
        }

        this.updateLocationInfo('Getting your location...');

        const options = {
            enableHighAccuracy: true,
            timeout: this.config.geolocationTimeout,
            maximumAge: 300000 // 5 minutes
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const accuracy = position.coords.accuracy;

                    if (!this.locationMap) {
                        console.warn('Location map not initialized');
                        return;
                    }

                    this.locationMap.setView([lat, lng], 15);

                    // Remove existing current location marker
                    this.locationMap.eachLayer((layer) => {
                        if (layer.options && layer.options.isCurrentLocation) {
                            this.locationMap.removeLayer(layer);
                        }
                    });

                    // Add current location marker
                    const marker = L.marker([lat, lng], {
                        icon: L.divIcon({
                            className: 'current-location-marker',
                            html: '📍',
                            iconSize: [30, 30],
                            iconAnchor: [15, 15]
                        }),
                        isCurrentLocation: true
                    }).addTo(this.locationMap);

                    marker.bindPopup(`
                        <div>
                            <strong>Your Current Location</strong><br>
                            <small>Accuracy: ${Math.round(accuracy)}m</small>
                        </div>
                    `).openPopup();

                    this.updateLocationInfo(`Current location found (±${Math.round(accuracy)}m)`);

                } catch (error) {
                    console.error('Error processing geolocation:', error);
                    this.updateLocationInfo('Error processing location data.');
                }
            },
            (error) => {
                let message = 'Location access denied.';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Location access denied. Please enable location and refresh.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        message = 'Location request timed out.';
                        break;
                    default:
                        message = 'Unknown location error occurred.';
                        break;
                }

                console.warn('Geolocation error:', error);
                this.updateLocationInfo(message + ' Click on the map to select location.');
            },
            options
        );
    }

    static selectLocation(latlng) {
        try {
            if (!this.locationMap) {
                console.warn('Location map not initialized');
                return;
            }

            // Validate coordinates
            if (!latlng || typeof latlng.lat !== 'number' || typeof latlng.lng !== 'number') {
                throw new Error('Invalid coordinates');
            }

            // Remove existing selected marker
            if (this.selectedMarker) {
                this.locationMap.removeLayer(this.selectedMarker);
            }

            // Add new selected marker
            this.selectedMarker = L.marker([latlng.lat, latlng.lng], {
                icon: L.divIcon({
                    className: 'selected-location-marker',
                    html: '📌',
                    iconSize: [25, 25],
                    iconAnchor: [12, 12]
                }),
                draggable: true
            }).addTo(this.locationMap);

            // Make marker draggable
            this.selectedMarker.on('dragend', (e) => {
                const position = e.target.getLatLng();
                this.selectLocation(position);
            });

            this.selectedMarker.bindPopup('Selected location (drag to adjust)').openPopup();

            // Save to AppState with validation
            if (typeof window !== 'undefined' && window.AppState) {
                window.AppState.currentLocation = {
                    lat: Number(latlng.lat.toFixed(6)),
                    lng: Number(latlng.lng.toFixed(6))
                };
            }

            this.updateLocationInfo(`Selected: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`);

        } catch (error) {
            console.error('Error selecting location:', error);
            this.updateLocationInfo('Error selecting location. Please try again.');
        }
    }

    static updateStoriesMap(stories) {
        try {
            if (!this.storiesMap) {
                console.warn('Stories map not initialized');
                return false;
            }

            if (!Array.isArray(stories)) {
                console.warn('Stories data is not an array:', typeof stories);
                return false;
            }

            // Clear existing markers
            if (this.markersCluster) {
                this.markersCluster.clearLayers();
            } else {
                this.storiesMap.eachLayer((layer) => {
                    if (layer instanceof L.Marker) {
                        this.storiesMap.removeLayer(layer);
                    }
                });
            }

            if (stories.length === 0) {
                console.log('No stories to display on map');
                return true;
            }

            const markers = [];
            const validStories = stories.filter(story => 
                story && 
                typeof story.lat === 'number' && 
                typeof story.lon === 'number' &&
                !isNaN(story.lat) && 
                !isNaN(story.lon)
            );

            if (validStories.length === 0) {
                console.warn('No valid stories with coordinates found');
                return false;
            }

            validStories.forEach((story, index) => {
                try {
                    const marker = L.marker([story.lat, story.lon], {
                        icon: L.divIcon({
                            className: 'story-marker',
                            html: '📖',
                            iconSize: [25, 25],
                            iconAnchor: [12, 12]
                        })
                    });

                    const popupContent = this.createStoryPopup(story);
                    marker.bindPopup(popupContent, {
                        maxWidth: 200,
                        maxHeight: 300
                    });

                    markers.push(marker);

                } catch (error) {
                    console.error(`Error creating marker for story ${index}:`, error);
                }
            });

            // Add markers to map
            if (markers.length > 0) {
                if (this.markersCluster && markers.length > this.config.maxMarkersBeforeClustering) {
                    // Use clustering for many markers
                    this.markersCluster.addLayers(markers);
                } else {
                    // Add directly for few markers
                    markers.forEach(marker => marker.addTo(this.storiesMap));
                }

                // Fit map to show all markers
                const group = new L.featureGroup(markers);
                this.storiesMap.fitBounds(group.getBounds(), { 
                    padding: [20, 20], 
                    maxZoom: 15 
                });
            }

            console.log(`Successfully added ${markers.length} story markers to map`);
            return true;

        } catch (error) {
            console.error('Error updating stories map:', error);
            return false;
        }
    }

    static createStoryPopup(story) {
        const safeStory = {
            name: this.escapeHtml(story.name || 'Untitled Story'),
            description: this.escapeHtml((story.description || '').slice(0, 100)),
            photoUrl: story.photoUrl || '',
            createdAt: story.createdAt || new Date().toISOString()
        };

        return `
            <div class="story-popup">
                <h4>${safeStory.name}</h4>
                ${safeStory.photoUrl ? `
                    <img src="${safeStory.photoUrl}" 
                         alt="${safeStory.name}"
                         style="width:150px;height:100px;object-fit:cover;border-radius:5px;margin:5px 0;"
                         onerror="this.style.display='none'"
                         loading="lazy">
                ` : ''}
                <p>${safeStory.description}${story.description && story.description.length > 100 ? '...' : ''}</p>
                <small>📅 ${new Date(safeStory.createdAt).toLocaleDateString('id-ID')}</small>
            </div>
        `;
    }

    static updateLocationInfo(message) {
        const element = document.getElementById('location-info');
        if (element) {
            element.textContent = message;
        }
        console.log('Location info:', message);
    }

    static showLoading(mapId) {
        const container = document.getElementById(mapId);
        if (container) {
            const loadingDiv = document.createElement('div');
            loadingDiv.id = `${mapId}-loading`;
            loadingDiv.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255,255,255,0.9);
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 1000;
                text-align: center;
            `;
            loadingDiv.innerHTML = `
                <div style="font-size: 20px; margin-bottom: 10px;">🗺️</div>
                <div>Loading map...</div>
            `;
            container.style.position = 'relative';
            container.appendChild(loadingDiv);
        }
    }

    static hideLoading(mapId) {
        const loadingDiv = document.getElementById(`${mapId}-loading`);
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    static showError(mapId, message) {
        this.hideLoading(mapId);
        const container = document.getElementById(mapId);
        if (container) {
            const errorDiv = document.createElement('div');
            errorDiv.id = `${mapId}-error`;
            errorDiv.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #fee;
                color: #d63384;
                padding: 20px;
                border-radius: 10px;
                border: 1px solid #f5c2c7;
                z-index: 1000;
                text-align: center;
                max-width: 300px;
            `;
            errorDiv.innerHTML = `
                <div style="font-size: 20px; margin-bottom: 10px;">⚠️</div>
                <div><strong>Error:</strong> ${this.escapeHtml(message)}</div>
                <button onclick="MapPresenter.retryInit('${mapId}')" 
                        style="margin-top: 10px; padding: 5px 15px; background: #d63384; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Retry
                </button>
            `;
            container.style.position = 'relative';
            container.appendChild(errorDiv);
        }
    }

    static retryInit(mapId) {
        const errorDiv = document.getElementById(`${mapId}-error`);
        if (errorDiv) {
            errorDiv.remove();
        }

        if (mapId === 'stories-map') {
            this.initStoriesMap();
        } else if (mapId === 'location-map') {
            this.initLocationMap();
        }
    }

    static escapeHtml(text) {
        if (typeof text !== 'string') return '';
        return text.replace(/[&<>"']/g, (match) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[match]));
    }

    static cleanup() {
        try {
            if (this.markersCluster) {
                this.markersCluster.clearLayers();
                this.markersCluster = null;
            }

            if (this.storiesMap) {
                this.storiesMap.remove();
                this.storiesMap = null;
            }

            if (this.locationMap) {
                this.locationMap.remove();
                this.locationMap = null;
            }

            this.selectedMarker = null;
            this.isInitializing = false;

            console.log('MapPresenter cleaned up successfully');

        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }

    // Utility method to check if maps are ready
    static isReady() {
        return {
            storiesMap: this.storiesMap !== null,
            locationMap: this.locationMap !== null,
            leafletLoaded: typeof L !== 'undefined'
        };
    }

    // Method to resize maps (useful after container size changes)
    static invalidateSize() {
        try {
            if (this.storiesMap) {
                setTimeout(() => this.storiesMap.invalidateSize(), 100);
            }
            if (this.locationMap) {  
                setTimeout(() => this.locationMap.invalidateSize(), 100);
            }
        } catch (error) {
            console.error('Error invalidating map size:', error);
        }
    }
}

// Enhanced event listeners
window.addEventListener('resize', () => {
    MapPresenter.invalidateSize();
});

window.addEventListener('beforeunload', () => {
    MapPresenter.cleanup();
});

// Handle visibility change (when tab becomes visible again)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        setTimeout(() => MapPresenter.invalidateSize(), 200);
    }
});

// Export for ES6 modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapPresenter;
}