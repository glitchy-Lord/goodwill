mapboxgl.accessToken = mapToken; // passing the mapToken that is defined in listings template
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v11', // style URL
	center: [72.883296, 19.061732], // starting position [lng, lat]
	// center: [-73.98513, 40.758896], // starting position [lng, lat]
	zoom: 12.5, // starting zoom
	// zoom: 10, // starting zoom
});

// to add map controls
map.addControl(new mapboxgl.NavigationControl());

// mapToken is already for access added above
map.on('load', function () {
	// Add a new source from our GeoJSON data and
	// set the 'cluster' option to true. GL-JS will
	// add the point_count property to your source data.
	map.addSource('listings', {
		type: 'geojson',
		// Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
		// from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
		data: listings,
		cluster: true,
		clusterMaxZoom: 14, // Max zoom to cluster points on
		clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
	});

	map.addLayer({
		id: 'clusters',
		type: 'circle',
		source: 'listings',
		filter: ['has', 'point_count'],
		paint: {
			// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
			// with three steps to implement three types of circles:
			//   * Blue, 20px circles when point count is less than 100
			//   * Yellow, 30px circles when point count is between 100 and 750
			//   * Pink, 40px circles when point count is greater than or equal to 750
			'circle-color': [
				'step',
				['get', 'point_count'],
				'#ffa001',
				5,
				'#f1f075',
				10,
				'#f28cb1',
				20,
				'#2274A5',
			],
			'circle-radius': ['step', ['get', 'point_count'], 15, 5, 20, 10, 30],
		},
	});

	map.addLayer({
		id: 'cluster-count',
		type: 'symbol',
		source: 'listings',
		filter: ['has', 'point_count'],
		layout: {
			'text-field': '{point_count_abbreviated}',
			'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
			'text-size': 12,
		},
	});

	map.addLayer({
		id: 'unclustered-point',
		type: 'circle',
		source: 'listings',
		filter: ['!', ['has', 'point_count']],
		paint: {
			'circle-color': '#fe4900',
			'circle-radius': 8,
			'circle-stroke-width': 1,
			'circle-stroke-color': '#fff',
		},
	});

	// inspect a cluster on click
	map.on('click', 'clusters', function (e) {
		const features = map.queryRenderedFeatures(e.point, {
			layers: ['clusters'],
		});
		const clusterId = features[0].properties.cluster_id;
		map
			.getSource('listings')
			.getClusterExpansionZoom(clusterId, function (err, zoom) {
				if (err) return;

				map.easeTo({
					center: features[0].geometry.coordinates,
					zoom: zoom,
				});
			});
	});

	// When a click event occurs on a feature in
	// the unclustered-point layer, open a popup at
	// the location of the feature, with
	// description HTML from its properties.
	map.on('click', 'unclustered-point', function (e) {
		const { popupMarkup } = e.features[0].properties;
		const coordinates = e.features[0].geometry.coordinates.slice();

		// Ensure that if the map is zoomed out such that
		// multiple copies of the feature are visible, the
		// popup appears over the copy being pointed to.
		while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
			coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
		}

		// const popUp =
		new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupMarkup).addTo(map);

		// popUp.style.color = 'black';
	});

	map.on('mouseenter', 'clusters', function () {
		map.getCanvas().style.cursor = 'pointer';
	});
	map.on('mouseleave', 'clusters', function () {
		map.getCanvas().style.cursor = '';
	});
});
