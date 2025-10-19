<template>
    <div class="px-4 pt-3 m-2 primary-color">
        <!-- <div class="d-flex align-items-center fw-lighter">User > &nbsp;
            <p class="fw-normal text-decoration-underline mb-0">Restaurants</p>
        </div> -->

        <h3 class="mt-3 mb-0 text-center fw-bold">Discover Healthy Eateries in Your Area</h3>
    </div>
    <div class="container-fluid p-4 py-2 primary-color">
        <div class="row">
            <div class="col-12">
                <div class="map-wrapper px-2">
                    <div class="search-bar d-flex align-items-center mb-4">
                        <input type="text" v-model="locationQuery" ref="locationInput" class="form-control me-4"
                            placeholder="Enter your location">
                            <button
                                v-if="locationQuery"
                                @click="clearLocation"
                                class="clear-btn"
                                type="button"
                            >
                                <i class="bi bi-x-circle-fill"></i>
                            </button>
                        </input>
                        <button class="btn primary-btn w-25" @click="searchLocation" :disabled="!userLocation">Search Restaurants</button>
                    </div>
                    <div id="map" class="map border-radius8 px-2"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "MapView",
    data() {
        return {
            map: null,
            locationQuery: "",
            selectedRadius: 3000,
            userMarker: null,
            placesService: null,
            directionsService: null,
            directionsRenderer: null,
            userLocation: null,
            restaurantMarkers: [],
            infoWindow: null,
        };
    },
    mounted() {
        this.map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: -37.814, lng: 144.963 },
            zoom: 13,
        });

        this.placesService = new google.maps.places.PlacesService(this.map);
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            map: this.map,
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: "#284B63",
                strokeOpacity: 1,
                strokeWeight: 6
            }
        });
        this.infoWindow = new google.maps.InfoWindow({
            maxWidth: 300,
        });
        this.directionsRenderer.setMap(this.map);

        const input = this.$refs.locationInput;
        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo("bounds", this.map);

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) {
                alert("No details available for this place.");
                return;
            }

            const location = place.geometry.location;
            this.map.setCenter(location);
            this.userLocation = location;

            this.locationQuery = place.formatted_address || place.name || '';

            if (this.userMarker) this.userMarker.setMap(null);
            this.userMarker = new google.maps.Marker({
                map: this.map,
                position: location,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#EA4335",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#fff"
                }
            });
        });
    },
    methods: {
        async searchLocation() {
            if (!this.userLocation) {
                alert("Please select a location from the suggestions first.");
                return;
            }

            // Clear previous restaurants & routes
            this.clearMarkers();

            // Search restaurants near the selected location
            this.findHealthyRestaurants(this.userLocation);
        },

        findHealthyRestaurants(location) {
            const request = {
                location,
                radius: 3000,
                keyword: "healthy restaurant OR organic cafe OR vegan restaurant OR salad bar OR juice bar OR vegetarian restaurant -burger -fried -pizza -kfc -mcdonald",
                type: "restaurant",
            };

            this.placesService.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    this.clearMarkers();

                    results.forEach((place) => {
                        this.placesService.getDetails({ placeId: place.place_id }, (details, status) => {
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                const marker = new google.maps.Marker({
                                    map: this.map,
                                    position: details.geometry.location,
                                    title: details.name,
                                });

                                marker.addListener("click", () => {
                                    if (this.userLocation) {
                                        this.showRoute(this.userLocation, details.geometry.location);
                                    }

                                    const openStatus = details.opening_hours ? 
                                        (details.opening_hours.isOpen() ? '<span style="color:green">Open Now</span>' : '<span style="color:red">Closed</span>') 
                                        : '';

                                    const content = document.createElement('div');
                                    content.style.maxWidth = '250px';
                                    content.innerHTML = `
                                        <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 16px; margin-bottom: 8px;">
                                            <span>${details.name}</span>
                                            <button id="close-btn" style="cursor:pointer; border:none; background:none; color:#284B63; font-size:30px;">×</button>
                                        </div>
                                        <div style="font-size: 14px; line-height: 1.4;">
                                            ${details.vicinity || ''}<br>
                                            Rating: ${details.rating || 'N/A'} ⭐<br>
                                            Website: <a href="${details.website}" target="_blank">Visit</a><br>
                                            Phone: ${details.formatted_phone_number || 'N/A'}<br>
                                            ${openStatus}
                                        </div>
                                    `;
                                    this.infoWindow.setContent(content);
                                    this.infoWindow.open(this.map, marker);

                                    // Attach click event to close button
                                    content.querySelector('#close-btn').addEventListener('click', () => {
                                        this.infoWindow.close();
                                    });
                                });

                                this.restaurantMarkers.push(marker);
                            }
                        });
                    });
                }
            });
        },

        showRoute(origin, destination) { 
            this.directionsService.route({ 
                origin,
                destination,
                travelMode: google.maps.TravelMode.WALKING, 
            }, 
            (response, status) => { 
                if (status === "OK") { 
                    this.directionsRenderer.setDirections(response);
                } else { 
                    alert("Could not display route: " + status);
                }
            }); 
        },

        clearMarkers(removeUserMarker = false) {
            // Remove restaurant markers
            this.restaurantMarkers.forEach((m) => m.setMap(null));
            this.restaurantMarkers = [];

            // Optionally remove user marker (only when changing search location)
            if (removeUserMarker && this.userMarker) {
                this.userMarker.setMap(null);
                this.userMarker = null;
            }

            // Reset route renderer fully
            if (this.directionsRenderer) {
                this.directionsRenderer.setMap(null);
                this.directionsRenderer = new google.maps.DirectionsRenderer({
                    map: this.map,
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: "#284B63",
                        strokeOpacity: 1,
                        strokeWeight: 6
                    }
                });

                this.directionsRenderer.setMap(this.map);
            }

            // Close info window
            if (this.infoWindow) {
                this.infoWindow.close();
            }
        },

        clearLocation() {
            this.locationQuery = "";
            this.userLocation = null;
            this.clearMarkers(true);

            // 🔥 Reinitialize the map completely
            this.map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: -37.814, lng: 144.963 },
                zoom: 13,
            });

            // Recreate dependent services and renderer
            this.placesService = new google.maps.places.PlacesService(this.map);
            this.directionsService = new google.maps.DirectionsService();
            this.directionsRenderer = new google.maps.DirectionsRenderer({
                map: this.map,
                suppressMarkers: true,
                polylineOptions: {
                strokeColor: "#284B63",
                strokeOpacity: 1,
                strokeWeight: 6,
                },
            });

            this.infoWindow = new google.maps.InfoWindow({ maxWidth: 300 });

            // ✅ Reattach autocomplete input to new map
            const input = this.$refs.locationInput;
            const autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo("bounds", this.map);

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (!place.geometry) return alert("No details available for this place.");

                const location = place.geometry.location;
                this.map.setCenter(location);
                this.userLocation = location;
                this.locationQuery = place.formatted_address || place.name || "";

                if (this.userMarker) this.userMarker.setMap(null);
                this.userMarker = new google.maps.Marker({
                map: this.map,
                position: location,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#EA4335",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#fff",
                },
                });
            });
        }

    },
};
</script>

<style scoped>
.map-wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
}

.map {
    height: 100%;
}

.clear-btn {
  position: absolute;
  right: 23%;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  font-size: 23px;
  color: #888;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.clear-btn:hover {
  color: var(--primary);
}

.search-bar {
    position: relative;
}

.search-bar input {}
</style>