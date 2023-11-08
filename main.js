const tripGenerator = require("./src/tripgenerator.js");
const fs = require('fs');
const polyline = require('@mapbox/polyline');

/**
 * Name of the file with city data must correspond to the number
 */
let cityid = 1;
/**
 * Name of the generated file for each bike will be a number,
 * set startAt to a number that has not previously been used to
 * avoid overriding existing files
 */
let startAt = 1;
/**
 * Number of bikes to generate data for
 */
let bikes = 5;
/**
 * Number of subsequent routes (endpoint for route n = startpoint for route n + 1)
 * that will be generated for each bike
 */
let routesPerBike = 4;

/**
 * These can be passed into script from commandline
 */
if (process.argv[2]) {
    cityid = process.argv[2];
}
if (process.argv[3]) {
    startAt = parseInt(process.argv[3]);
}
if (process.argv[4]) {
    bikes = parseInt(process.argv[4]);
}


(async function () {
    "use strict";

    tripGenerator.setCoords(cityid);

    for (let bike=startAt; bike<=bikes; bike++) {
        let startPoint = tripGenerator.getPoint();
        let endPoint = tripGenerator.getPoint();
        const bikeObj = {
            city: cityid,
            initialStart: startPoint,
            trips: [],
            trips_encoded: []
        };

        for (let i=1; i<=routesPerBike; i++) {
            const trip = await tripGenerator.getTripCoords(startPoint, endPoint);
            const trip_decoded = polyline.decode(trip);

            bikeObj.trips_encoded.push(trip);
            bikeObj.trips.push(trip_decoded);
            fs.appendFileSync("./src/bike-routes/routes.csv", `"${bike}","${i}","${trip}"\r\n`);

            startPoint = endPoint;
            endPoint = tripGenerator.getPoint();
        }

        fs.writeFileSync(`./src/bike-routes/${bike}.json`, JSON.stringify(bikeObj, null, 4));
    }
})();
