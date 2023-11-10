const polyline = require('@mapbox/polyline');
const city = require('../cities/1.json');


// let cityGeo = city.coords.geometry.coordinates[0];
// console.log("before encoding: ", cityGeo);
// let encodedGeo = polyline.encode(cityGeo);
// console.log("encoded: ", encodedGeo);
// let decodedGeo = polyline.decode(encodedGeo);
// console.log("decoded: ", decodedGeo)

let point = [city.coords.geometry.coordinates[0][0]];
console.log("before encoding: ", point);
let encodedPoint = polyline.encode(point);
console.log("encoded: ", encodedPoint);
let decodedPoint = polyline.decode(encodedPoint);
console.log("decoded: ", decodedPoint)