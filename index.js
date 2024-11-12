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
//  barot.bindPopup("<b>Barot Station</b><br>" + barot.getLatLng());
//  dangsidhar.bindPopup("<b>Dangsidhar Station</b><br>" + dangsidhar.getLatLng());
//  Kandhi.bindPopup("<b>Kandhi Station</b><br>" + Kandhi.getLatLng());
//  discharge.bindPopup("<b>Discharge point</b><br>" + discharge.getLatLng());
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

// // plotting chart and download data
//   // Function to load CSV data and filter for relevant columns
//   async function loadCSVData(url, stationName) {
//     const response = await fetch(url);
//     const csvText = await response.text();
//     console.log("data",csvText)
//     const lines = csvText.split("\n");

//     // Get headers and find the indices for Date and GPR columns
//     const headers = lines[0].split(",");
//     const dateIndex = headers.indexOf("Date(IST)");
//     const rainfallIndex = headers.indexOf("GPR(GPRS-Rainfall by Telemetry)-mm");
//     const stationIndex = headers.indexOf("Station Name");

//     // Parse CSV data into JSON, filtering by station name
//     const data = lines.slice(1).map(line => {
//       const columns = line.split(",");
//       return {
//         date: columns[dateIndex]?.trim(),
//         rainfall: parseFloat(columns[rainfallIndex]?.trim()),
//         station: columns[stationIndex]?.trim()
//       };
//     }).filter(d => d.station === stationName && d.date && !isNaN(d.rainfall)); // Filter valid rows
    
//     return data;
    
//   }
// // Function to create a chart with limited size
// function createChart(container, data) {
//   const ctx = container.getContext('2d');
//   return new Chart(ctx, {
//       type: 'line',
//       data: {
//           labels: data.map(d => d.time),
//           datasets: [{
//               label: 'Precipitation (mm)',
//               data: data.map(d => d.precipitation),
//               borderColor: 'blue',
//               fill: false,
//           }]
//       },
//       options: {
//           responsive: false,              // Disable responsive resizing
//           maintainAspectRatio: true,      // Maintain the defined aspect ratio
//           aspectRatio: 1.5,               // Custom aspect ratio to control height
//           scales: {
//               x: { title: { display: true, text: 'Time' } },
//               y: { title: { display: true, text: 'Precipitation (mm)' } }
//           }
//       }
//   });
// }

//  // Function to download data in different formats
// function downloadData(data, format) {
//   let blob;
//   if (format === "csv") {
//     const csvContent = "Date(IST),Rainfall(mm)\n" + data.map(d => `${d.date},${d.rainfall}`).join("\n");
//     blob = new Blob([csvContent], { type: "text/csv" });
//   } else if (format === "txt") {
//     const txtContent = data.map(d => `${d.date}: ${d.rainfall} mm`).join("\n");
//     blob = new Blob([txtContent], { type: "text/plain" });
//   } else if (format === "pdf") {
//     const pdfDoc = new jsPDF();
//     pdfDoc.text("Precipitation Data", 10, 10);
//     data.forEach((d, i) => pdfDoc.text(`${d.date}: ${d.rainfall} mm`, 10, 20 + i * 10));
//     blob = pdfDoc.output("blob");
//   }
//   saveAs(blob, `precipitation_data.${format}`);
// }

// // Adding popups to existing markers
// const markersData = [
//   { marker: barot, name: "Barot Station", csvUrl: "Rainfall Data/luv.csv", stationName: "Barot_2" },
//   { marker: dangsidhar, name: "Dangsidhar Station", csvUrl: "Rainfall Data/luv.csv", stationName: "Dangsidhar" },
//   { marker: Kandhi, name: "Kandhi Station", csvUrl: "Rainfall Data/luv.csv", stationName: "Kandhi" }
// ];

// markersData.forEach(({ marker, name, csvUrl, stationName }) => {
//   marker.on('click', async () => {
//     const data = await loadCSVData(csvUrl, stationName);
//     console.log(data,"data")
//     // Create popup content with limited chart size
//     const popupContent = document.createElement('div');
//     popupContent.innerHTML = `<b>${name}</b><br><canvas width="300" height="200"></canvas><br>`;

//     // Create buttons and add event listeners for each download format
//     const formats = ["csv", "pdf", "txt"];
//     formats.forEach(format => {
//       const button = document.createElement('button');
//       button.textContent = `Download ${format.toUpperCase()}`;
//       button.addEventListener('click', () => downloadData(data, format));
//       popupContent.appendChild(button);
//     });

//     marker.bindPopup(popupContent).openPopup();

//     // Create the chart in the popup
//     createChart(popupContent.querySelector('canvas'), data);
//   });
// });

// });




async function loadCSVData(url, stationName) {
  const response = await fetch(url);
  const csvText = await response.text();
  // console.log("data", csvText); // To help debug the CSV data being fetched

  const lines = csvText.split("\n");
  

  // Get headers and find the indices for Date and rainfall columns
  const headers = lines[0].split(",");
  console.log("data", lines); 
  console.log(headers)
  const dateIndex = 0;
  const rainfallIndex = 2;

  // Parse CSV data into JSON
  const data = lines.slice(1).map(line => {
    const columns = line.split(",");
    return {
      date: columns[dateIndex]?.trim(),
      rainfall: parseFloat(columns[rainfallIndex]?.trim())
    };
  }).filter(d => d.date && !isNaN(d.rainfall)); // Filter valid rows
  console.log(data)
  return data;
}

function downloadData(data, format) {
  let blob;
  if (format === "csv") {
    const csvContent = "Date(IST),Rainfall(mm)\n" + data.map(d => `${d.date},${d.rainfall}`).join("\n");
    blob = new Blob([csvContent], { type: "text/csv" });
  } else if (format === "txt") {
    const txtContent = data.map(d => `${d.date}: ${d.rainfall} mm`).join("\n");
    blob = new Blob([txtContent], { type: "text/plain" });
  } else if (format === "pdf") {
    const { jsPDF } = window.jspdf;  // Access jsPDF from the global window object
    const pdfDoc = new jsPDF();
    pdfDoc.text("Time     Precipitation Data", 10, 10);
    data.forEach((d, i) => pdfDoc.text(`${d.date}: ${d.rainfall} mm`, 10, 20 + i * 10));
    blob = pdfDoc.output("blob");
  }
  saveAs(blob, `precipitation_data.${format}`);
}

function createChart(container, data) {
  const ctx = container.getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.date.slice(1)), // X-axis with Date
      datasets: [{
        label: 'Precipitation (mm)',
        data: data.map(d => d.rainfall), // Y-axis with Precipitation
        borderColor: 'blue',
        fill: false,
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      aspectRatio: 1.5,
      scales: {
        x: { title: { display: true, text: 'Time' } },
        y: { title: { display: true, text: 'Precipitation (mm)' } }
      }
    }
  });
}

// Adding popups to existing markers
const markersData = [
  { marker: barot, name: "Barot Station (lat:32.034399,lng:76.849973)", csvUrl: "Rainfall Data/barot_luv.csv", stationName: "Barot" },
  { marker: dangsidhar, name: "Dangsidhar Station(lat:31.715228,lng:76.937)", csvUrl: "Rainfall Data/Dhangsidhar_Mandi_luv.csv", stationName: "Dhangsidhar" },
  { marker: Kandhi, name: "Kandhi Station(lat:31.826135,lng:77.080933)", csvUrl: "Rainfall Data/Kandhi_luv.csv", stationName: "Kandhi" },
  { marker: discharge, name: "Discharge Station(lat:31.773817,lng:76.98458)", csvUrl: "Kamand_1_Discharge/Kamand_1_Discharge_luv.csv", stationName: "Discharge" }
];

// markersData.forEach(({ marker, name, csvUrl }) => {
//   marker.on('click', async () => {
//     const data = await loadCSVData(csvUrl, name);

//     // Create popup content with limited chart size and download buttons
//     const popupContent = document.createElement('div');
//     popupContent.innerHTML = `<b>${name}</b><br><canvas width="300" height="200"></canvas>`;

//     marker.bindPopup(popupContent).openPopup();
//     createChart(popupContent.querySelector('canvas'), data);
//   });
// });


markersData.forEach(({ marker, name, csvUrl, stationName }) => {
  marker.on('click', async () => {
    const data = await loadCSVData(csvUrl, stationName);
    console.log(data,"data")
    // Create popup content with limited chart size
    const popupContent = document.createElement('div');
    popupContent.style.width = '300px';  // Set the div width
    popupContent.style.height = '450px'; // Set the div height
    
    // Ensure the div expands to the content size if the canvas grows
    popupContent.style.display = 'flex';
    popupContent.style.flexDirection = 'column';
    popupContent.style.alignItems = 'center';
    popupContent.style.justifyContent = 'center';
    
    popupContent.innerHTML = `<b>${name}</b><br><canvas style="width: 100%; height: 100%;"></canvas><br>`;
    
    
    

// Create buttons and add event listeners for each download format
const formats = ["csv", "pdf", "txt"];
const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.gap = '10px';  // Space between buttons
buttonContainer.style.marginTop = '10px';  // Spacing from the canvas

formats.forEach(format => {
  const button = document.createElement('button');
  button.textContent = `Download ${format.toUpperCase()}`;

  // Style the button with a gray theme
  button.style.padding = '8px 15px';
  button.style.borderRadius = '5px';
  button.style.border = 'none';
  button.style.backgroundColor = '#b0b0b0';  // Light gray background
  button.style.color = 'white';
  button.style.cursor = 'pointer';
  button.style.fontSize = '14px';
  button.style.fontWeight = 'bold';
  button.style.transition = 'background-color 0.3s';

  // Hover effect to darker gray
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = '#888888';  // Darker gray on hover
  });
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = '#b0b0b0';
  });

  // Add click event for download
  button.addEventListener('click', () => downloadData(data, format));

  buttonContainer.appendChild(button);
});

// Add buttonContainer to popupContent
popupContent.appendChild(buttonContainer);

    marker.bindPopup(popupContent).openPopup();

    // Create the chart in the popup
    createChart(popupContent.querySelector('canvas'), data);
  });
});
});

