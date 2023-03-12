var hasher = require('../index');

// var small = [[[-122.350051, 47.702893 ], [-122.344774, 47.702877 ], [-122.344777, 47.70324 ], [-122.341982, 47.703234 ], [-122.341959, 47.701421 ], [-122.339749, 47.701416 ], [-122.339704, 47.69776 ], [-122.341913, 47.697797 ], [-122.341905, 47.697071 ], [-122.344576, 47.697084 ], [-122.344609, 47.697807 ], [-122.349999, 47.697822 ], [-122.350051, 47.702893 ]]];
var data = require('./data/geojson.polygon_with_hole.json').geometry.coordinates;
console.log(data)

var options = {
  coords: data,
  precision: 10,
  hashMode: 'extent'
}

hasher(options, function (err, hashes) {
	console.log(hashes.length);
	console.log(hashes);
});