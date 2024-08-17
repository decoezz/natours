document.addEventListener('DOMContentLoaded', function () {
  try {
    const tourDataElement = document.getElementById('tour-data');
    if (!tourDataElement || !tourDataElement.textContent.trim()) {
      throw new Error('Element with id "tour-data" is empty or not found');
    }
    const tour = JSON.parse(tourDataElement.textContent);
    // Initialize map and add markers
    const map = new maplibregl.Map({
      container: 'map',
      style:
        'https://api.maptiler.com/maps/streets-v2/style.json?key=DbS9fLquiS74Pix2V2W7',
      center: [
        tour.startLocation.coordinates[0],
        tour.startLocation.coordinates[1],
      ],
      zoom: 8,
    });
    const locations = tour.locations;
    locations.forEach((loc) => {
      new maplibregl.Marker()
        .setLngLat([loc.coordinates[0], loc.coordinates[1]])
        .addTo(map);
    });
  } catch (error) {
    console.error('Error parsing JSON from tour-data:', error);
  }
});
