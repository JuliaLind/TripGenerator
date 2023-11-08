const tripGenerator = require("./src/tripgenerator.js");
const fs = require('fs');
const polyline = require('@mapbox/polyline');
const counter = require("./counter.json")

/**
 * Name of the file with city data must correspond to the number
 */
let cityid = 1;
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
    bikes = parseInt(process.argv[3]);
}

let stopAt = counter.bikes + bikes;

(async function () {
    "use strict";

    tripGenerator.setCoords(cityid);

    for (let bike=counter.bikes; bike<stopAt; bike++) {
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

            // Append one trip to the general csv file
            fs.appendFileSync("./src/bike-routes/routes.csv", `"${bike}","${i}","${trip}"\r\n`);

            startPoint = endPoint;
            endPoint = tripGenerator.getPoint();
        }

        // Save all trips for one bike to a new json file
        fs.writeFileSync(`./src/bike-routes/${bike}.json`, JSON.stringify(bikeObj, null, 4));
        counter.bikes += 1;
    }
    // Update the number in the counter file, in order to not use
    // same "bike ids" next time
    fs.writeFileSync(`./counter.json`, JSON.stringify(counter, null, 4));
})();
