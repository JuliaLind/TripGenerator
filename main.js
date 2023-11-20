const tripGenerator = require("./src/tripgenerator.js");


(async function () {
    "use strict";
    /**
     * These can be passed into script from commandline
     */
    if (process.argv[2]) {
        tripGenerator.cityid = process.argv[2];
    }
    if (process.argv[3]) {
        tripGenerator.bikes = parseInt(process.argv[3]);
    }

    tripGenerator.setCoords();
    await tripGenerator.generateMany();
})();
