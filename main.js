const tripGenerator = require("./src/tripgenerator.js");


(async function () {
    "use strict";

    /**
     * Name of the file with city data must correspond to the number
     */
    let cityid = 1;
    /**
     * Number of bikes to generate data for
     */
    let bikes = 5;



    /**
     * These can be passed into script from commandline
     */
    if (process.argv[2]) {
        cityid = process.argv[2];
    }
    if (process.argv[3]) {
        bikes = parseInt(process.argv[3]);
    }

    tripGenerator.setCoords(cityid);
    tripGenerator.generateMany(bikes);
})();
