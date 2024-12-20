# Hydro_UI

A mapping interface developed using Leaflet.js to visualize geographic and hydrologic data with customizable layers, markers, and interactive data popups.

## Project Overview

Hydro_UI is an interactive map interface highlighting hydrological and geographical features, specifically designed for a region with weather stations and river networks. The map includes:

- Multiple base maps and tile layers (OpenStreetMap, Thunderforest, Stadia)
- Shapefile overlays for displaying river networks and watershed boundaries
- A GeoTIFF layer to represent elevation or DEM data
- Interactive markers for weather stations with popups displaying real-time precipitation data

## Features

- **Base Map Layers**: Select from different map tiles including OpenStreetMap, Thunderforest, Stadia, and Google Maps layers.
- **GeoTIFF Overlay**: DEM data represented in an adjustable overlay, dynamically fitted to the map.
- **Weather Station Markers**: Displays location markers for stations like Barot, Dangsidhar, Kandhi, and Discharge Point.
- **Precipitation Data Graphs**: Popups on markers show graphs of precipitation vs. time, generated from uploaded CSV data files.
- **Download Options**: Each popup includes an option to download the associated dataset.

## Setup Instructions

1. Clone the repository:
   \`\`\`
   git clone https://github.com/Nanipanyu/Hydro_UI.git
   \`\`\`
2. Navigate to the project directory and open the HTML file to view the map interface:
   \`\`\`
   cd Hydro_UI
   open index.html
   \`\`\`
3. Ensure all dependencies are linked in the HTML, including Leaflet, georaster-layer-for-leaflet, and shapefile parsing.

## Usage

- Use the layer control to toggle between base maps and view overlays.
- Click on weather station markers to view detailed precipitation data.
- For additional data layers, update \`index.js\` to integrate further datasets or CSV files.

## Contributing

Feel free to submit issues and contribute to this project by creating pull requests.

