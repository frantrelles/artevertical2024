// Inicializar el mapa
const map = L.map("map").setView([43.3619, -5.8494], 14); // Coordenadas de Oviedo

// Añadir capa base de OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
}).addTo(map);

let userLocation = null; // Variable global para la ubicación del usuario
const businessLocation = [43.366820, -5.847389]; // Coordenadas de la empresa (Oviedo)


// Agregar capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Agregar marcador para la ubicación del negocio
L.marker(businessLocation).addTo(map)
    .bindPopup("Arte Vertical - Oviedo")
    .openPopup();

// Obtener la ubicación del usuario
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLocation = [position.coords.latitude, position.coords.longitude];
            console.log("Ubicación del usuario:", userLocation);
            
            // Agregar marcador de usuario en el mapa
            L.marker(userLocation).addTo(map)
                .bindPopup("Tu ubicación")
                .openPopup();
            
            // Centrar el mapa entre ambas ubicaciones
            map.fitBounds([userLocation, businessLocation]);

        }, error => {
            console.error("Error obteniendo la ubicación del usuario:", error);
            alert("No se pudo obtener tu ubicación.");
        });
    } else {
        alert("La geolocalización no está soportada en este navegador.");
    }
}

// Llamar a la función al cargar la página
getUserLocation();

// Función para mostrar la ruta entre usuario y negocio
function showRoute() {
    if (userLocation) {
        L.Routing.control({
            waypoints: [
                L.latLng(userLocation[0], userLocation[1]), // Ubicación del usuario
                L.latLng(businessLocation[0], businessLocation[1]) // Ubicación del negocio
            ],
            routeWhileDragging: true
        }).addTo(map);
    } else {
        alert("No se pudo obtener tu ubicación, intenta de nuevo.");
    }
}

L.Routing.control({
    waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(businessLocation.lat, businessLocation.lng)
    ],
    routeWhileDragging: true,
    router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        options: {
            language: 'es',
            profile: 'driving' // Puedes cambiar a 'walking' o 'cycling'
        }
    })
}).addTo(map);
