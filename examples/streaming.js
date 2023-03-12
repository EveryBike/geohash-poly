

var hasher = require('../index'),
  async = require('async'),
  through2 = require('through2'),
  ngeohash = require('ngeohash');

// Regular small poly
var small = [[[-122.350051, 47.702893 ], [-122.344774, 47.702877 ], [-122.344777, 47.70324 ], [-122.341982, 47.703234 ], [-122.341959, 47.701421 ], [-122.339749, 47.701416 ], [-122.339704, 47.69776 ], [-122.341913, 47.697797 ], [-122.341905, 47.697071 ], [-122.344576, 47.697084 ], [-122.344609, 47.697807 ], [-122.349999, 47.697822 ], [-122.350051, 47.702893 ]]];

// Giant poly (does not work with sync)
var massive = require('./data/streaming.massive.json');

// Broke the first streaming version.
var difficult = require('./data/streaming.difficult.json')

var isFirst = true;
var printFeature = function (name, poly) {
  var out = {
    "type": "Feature",
    "properties": {
      'name': name,
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": poly
    }
  };
  out = JSON.stringify(out);
  if(!isFirst) {
    out = ',' + out
  }
  isFirst = false;
  console.log(out);
}

console.log('{"type": "FeatureCollection","features": [');

async.mapSeries([small, difficult, massive], function (poly, cb) {

  var options = {
    coords: poly,
    precision: 7,
    rowMode: true,
    hashMode: 'intersect',
    threshold: 0.2
  };
  printFeature('shape', poly);
  var rowStream = hasher.stream(options)

  rowStream
    .on('end', cb)
    .pipe(through2.obj(function (arr, enc, callback) {
      for(var i = 0; i < arr.length; i++) {
        var bb = ngeohash.decode_bbox(arr[i]);
        printFeature(arr[i], [
              [
                [bb[1], bb[2]],
                [bb[3], bb[2]],
                [bb[3], bb[0]],
                [bb[1], bb[0]],
                [bb[1], bb[2]]
              ]]);
      }
      callback();
    }));
}, function () {
  console.log(']}');
});
