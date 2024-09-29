import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox CSS
import '../../styles/nearby.css';
import Navbar from '../../Layout/Navbar';

mapboxgl.accessToken = 'pk.eyJ1IjoicHJhdmluOTE2IiwiYSI6ImNseThqZXdwMTA3cWMybHBoYzZvaHVkOTkifQ.TrJHd5twmsPbtZuOELMitg';

const Neaby = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null); // Store map instance
    const userLocationRef = useRef(null); // Store user's location

    // Dummy store data with latitude, longitude, and store names
    const stores = [
        { latitude: 21.1458, longitude: 79.0882, name: 'NX PRAVIN' },
        { latitude: 21.1550, longitude: 79.0980, name: 'NX Danish' },
        { latitude: 21.1350, longitude: 79.0780, name: 'ALADIN Collection' },
        { latitude: 21.1250, longitude: 79.0880, name: 'ALIBABA Store' }
    ];

    useEffect(() => {
        // Initialize the map centered on Nagpur, India
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [79.0882, 21.1458], // Nagpur coordinates [longitude, latitude]
            zoom: 12,
        });

        // Add navigation controls to the map (zoom buttons)
        const nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-right');

        // Add full-screen control
        map.addControl(new mapboxgl.FullscreenControl());

        // Add geolocation control
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showUserHeading: true
        }));

        mapRef.current = map; // Store map instance in ref

        // Function to create markers from dummy store data
        const createMarkers = () => {
            stores.forEach((store) => {
                const { latitude, longitude, name } = store;

                // Create a custom HTML element for the marker
                const el = document.createElement('div');
                el.className = 'custom-marker'; // Custom class for styling
                el.style.backgroundImage = `url('https://www.pngmart.com/files/16/Store-Shopping-Mall-Transparent-PNG.png')`;
                el.style.width = '40px';
                el.style.height = '40px';
                el.style.backgroundSize = 'cover';

                // Add marker for each store with popup
                if (latitude && longitude) {
                    const marker = new mapboxgl.Marker(el)
                        .setLngLat([longitude, latitude])
                        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="popup-content">
                <h3 className="text-red-500">${name}</h3>
                <p>
                  <button onclick="openGoogleMaps(${latitude}, ${longitude})">Get Directions</button>
                </p>
              </div>`)) // Show store name and info in popup
                        .addTo(mapRef.current);

                    console.log(`Added marker for store: ${name} at [${longitude}, ${latitude}]`);
                } else {
                    console.warn('Store has no valid coordinates:', store);
                }
            });
        };

        // Function to open Google Maps for directions
        window.openGoogleMaps = (latitude, longitude) => {
            if (userLocationRef.current) {
                const start = userLocationRef.current; // User's current location
                const end = [longitude, latitude]; // Store location

                // Open Google Maps with directions
                const url = `https://www.google.com/maps/dir/?api=1&origin=${start[1]},${start[0]}&destination=${end[1]},${end[0]}&travelmode=driving`;
                window.open(url, '_blank'); // Open in a new tab
            } else {
                console.error('User location not available');
            }
        };

        // Optionally handle user's geolocation
        const handleUserLocation = (position) => {
            const { longitude, latitude } = position.coords;
            console.log('User location:', longitude, latitude);
            userLocationRef.current = [longitude, latitude]; // Store user's location

            // Set map center to user's current location
            map.setCenter([longitude, latitude]);
            // Create markers after the map is centered on the user
            createMarkers();
        };

        // Handle geolocation error
        const handleLocationError = (error) => {
            console.error('Geolocation error:', error);
            createMarkers(); // Create markers using Nagpur as default
        };

        // Get user's location or fallback to Nagpur if denied
        navigator.geolocation.getCurrentPosition(handleUserLocation, handleLocationError);

        // Clean up on unmount
        return () => map.remove();
    }, []);

    return <>
    <Navbar/>
        <div ref={mapContainerRef} className="map-container" />;
    </>
};

export default Neaby;
