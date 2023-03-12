var hasher = require('../index'),
  async = require('async'),
  through2 = require('through2'),
  ngeohash = require('ngeohash');

// Regular small poly
// var small = require('./data/streaming.small.json');;

var small = require('./data/geojson.polygon_with_hole.json').geometry.coordinates;

// Giant poly (does not work with sync)
var massive = require('./data/streaming.massive.json');

// Broke the first streaming version.
var difficult = require('./data/streaming.difficult.json');

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
  if (!isFirst) {
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
      for (var i = 0; i < arr.length; i++) {
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
