document.addEventListener("DOMContentLoaded", function () {
var map = L.map('map').setView([31.7087, 76.9320], 7);

//tile layers
var MapTile = L.tileLayer('https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var osm=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var Thunderforest_Landscape = L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	maxZoom: 22
});

var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
});
googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
});

var SmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});
MapTile.addTo(map);

//setting markers
 var barot=L.marker([32.034399, 76.849973]).addTo(map);
 var dangsidhar=L.marker([31.715228, 76.937]).addTo(map);
 var Kandhi=L.marker([31.826135, 77.080933]).addTo(map);
 var dischargeIcon = L.icon({
  iconUrl: 'redmarker.png', // Use a URL to a blue marker image
  iconSize: [35, 40], // Adjust icon size as needed
});
 var discharge=L.marker([31.773817, 76.98458], { icon: dischargeIcon }).addTo(map);
 barot.bindPopup("<b>Barot Station</b><br>" + barot.getLatLng());
 dangsidhar.bindPopup("<b>Dangsidhar Station</b><br>" + dangsidhar.getLatLng());
 Kandhi.bindPopup("<b>Kandhi Station</b><br>" + Kandhi.getLatLng());
 discharge.bindPopup("<b>Discharge point</b><br>" + discharge.getLatLng());
 var markers = L.layerGroup([barot, dangsidhar, Kandhi,discharge]);

//loading tif file
var tifLayer;
fetch("uhl_DEM1.tif")
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => {
    parseGeoraster(arrayBuffer).then(georaster => {
      tifLayer = new GeoRasterLayer({
        georaster: georaster,
        opacity: 0.7,
        pixelValuesToColorFn: values => {
          const [value] = values;
          if (value === null) return null;
          const intensity = (value - georaster.mins[0]) / (georaster.ranges[0]) * 2;
          return `rgba(0, 0, 0, ${intensity})`;
        },
        resolution: 128
      });
      tifLayer.addTo(map).bringToFront(); // Ensure .tif layer is on top
      map.fitBounds(tifLayer.getBounds());
    });
  })
  .catch(error => console.error("Error loading .tif file:", error));

   // Keep .tif layer on top when toggling layers
   map.on('overlayadd', function () {
    if (tifLayer) tifLayer.bringToFront();
  });
  map.on('baselayerchange', function () {
    if (tifLayer) tifLayer.bringToFront();
  });

  L.Control.geocoder().addTo(map);

  console.log("L.shapefile function exists:", L.shapefile);


  // const riverLayer = L.shapefile("Uhl_river_network.zip");
  // // const watershedLayer = L.shapefile("Uhl_Watershed.zip").addTo(map);
  // riverLayer.setStyle({
  //   color: "red",
  //   weight: 2,
  //   opacity: 0.7
  // });

  // riverLayer.addTo(map);

  // L.shapefile("Uhl_river_network.zip", {
  //   onEachFeature: function (feature, layer) {
  //     layer.bindPopup("Feature: " + feature.properties.name); // Adjust properties as needed
  //   }
  // }).addTo(map);

  //Uhl_river_network
//   fetch("Uhl_river_network.zip")
//   .then(response => response.arrayBuffer())
//   .then(buffer => {
//     shp(buffer).then(geojson => {
//       const riverLayer = L.geoJSON(geojson, {
//         style: {
//           color: "#0000ff",
//           weight: 2,
//           opacity: 0.7
//         }
//       }).addTo(map);
//       // Add to overlay maps for layer control
//       overlayMaps["River Branches"] = riverLayer;
//       layerControl.addOverlay(riverLayer, "River Branches");
//     });
//   })
//   .catch(error => console.error("Error loading shapefile:", error));

  
var baseMaps = {
  "OpenStreetMap": osm,
  "Thunderforest_Landscape": Thunderforest_Landscape,
  "Stadia_AlidadeSmoothDark" : Stadia_AlidadeSmoothDark,
  "Google street": googleStreets,
  "Google Sat": googleSat,
  "MapTile" : MapTile,
  "SmoothDark" : SmoothDark
};
  
  var overlayMaps = {
    "Markers": markers,
  };

  //laoding toggle options for tilelayer and markers
  var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

  //func to load uhl_river_network and Uhl_Watershed
  function loadShapefile(map, layerControl, urls, layerNames, styleOptions) {
    urls.forEach((url, index) => {
      fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          shp(buffer).then(geojson => {
            const layerName = layerNames[index];
            const riverLayer = L.geoJSON(geojson, {
              style: styleOptions[index] || { color: "#0000ff", weight: 2, opacity: 0.7 }
            }).addTo(map);
            // Add layer to overlay maps for layer control
            overlayMaps[layerName] = riverLayer;
            layerControl.addOverlay(riverLayer, layerName);
          });
        })
        .catch(error => console.error(`Error loading shapefile ${layerNames[index]}:`, error));
    });
  }
  
  //load shapefiles
  const urls = ["Uhl_river_network.zip", "Uhl_Watershed.zip"];
  const layerNames = ["Uhl_River_Branches", "Uhl_Watershed"];
  const styleOptions = [
    { color: "#0000ff", weight: 2, opacity: 0.7 },  // Style for Uhl River Branches
    { color: "#39FF14", weight: 2, opacity: 0.8 }   // Style for watershed 
  ];
  loadShapefile(map, layerControl, urls, layerNames, styleOptions);

});
