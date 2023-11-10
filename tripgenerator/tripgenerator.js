const randomPointsOnPolygon = require('random-points-on-polygon');
const geoPointInPolygon = require('geo-point-in-polygon');
const token = require('../token.js');

const fs = require('fs');
const polyline = require('@mapbox/polyline');
const counter = require("../counter.json")

const tripGenerator = {
    cityid: 1,
    /**
     * Coordinates of the city as polygon
     */
    cityCoords: {},
    /**
     * Coordinates of the forbidden zones within the city,
     * an array of Polygons
     */
    forbidden: [],

    setCoords: async function setCoords(cityid) {
        const city = require(`../cities/${cityid}.json`);

        this.cityCoords = city.coords;
        this.cityid = cityid;

        for (const zone of city.forbidden) {
            this.forbidden.push(zone.coordinates);
        }
    },

    getPoint: function getPoint() {
        const numberOfPoints = 1;
        const polygon = this.cityCoords;
        let point;

        while (!point) {
            let temp = randomPointsOnPolygon(numberOfPoints, polygon);
            let inForbidden = false;
            const tempCoords = temp[0].geometry.coordinates;

            for (const zone of this.forbidden) {
                const zoneCoords = zone[0];
                
                if (geoPointInPolygon(tempCoords, zoneCoords)) {
                    inForbidden = true;
                    break;
                }
            }
            if (!inForbidden) {
                point = tempCoords;
                break;
            }
        }
        return point;
    },

    getTripCoords: async function getTripCoords(start, end) {
        let params = {
            coordinates:[start, end],
            preference:"shortest",
            options:
            {
                avoid_polygons:
                {
                    coordinates: this.forbidden,
                    "type":"MultiPolygon"
                }
            }
        }
        const url = "https://api.openrouteservice.org/v2/directions/cycling-electric/json";
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(params)
        });
        const resJson = await res.json();

        const route = {
            geometry: resJson.routes[0].geometry,
            steps: resJson.routes[0].segments[0].steps
        };

        // return resJson.routes[0].geometry;
        return route;
    },

    reverseCoords: function reverseCoords(coordsArr) {
        return coordsArr.map((coord) => coord.reverse());
    },

    generateMany: async function generateMany(bikes, routesPerBike=4) {
        const stopAt = counter.bikes + bikes;

        for (let bike=counter.bikes; bike<stopAt; bike++) {
            let startPoint = this.getPoint();
            let endPoint = this.getPoint();
            const bikeObj = {
                city: this.cityid,
                initialStart: startPoint,
                time_distance: [],
                trips: [],
                trips_encoded: []
            };
    
            for (let i=1; i<=routesPerBike; i++) {
                try {
                    const trip = await this.getTripCoords(startPoint, endPoint);
                    const trip_decoded = this.reverseCoords((polyline.decode(trip.geometry)));
        
                    // encode again to get coords in correct order in encoded polyline
                    const trip_encoded = polyline.encode(trip_decoded);
        
        
                    let waypoint_counter = 1;
                    const time_distance = trip.steps.map((waypoint) => {
                        fs.appendFileSync("./bike-routes/time-distance.csv", `"${bike}","${i}","${waypoint_counter}","${waypoint.distance}","${waypoint.duration}"\r\n`);

                        waypoint_counter++;
                        return {
                            distance: waypoint.distance,
                            duration: waypoint.duration
                        }
                    })

                    bikeObj.time_distance.push(time_distance);
                    bikeObj.trips_encoded.push(trip_encoded);
                    bikeObj.trips.push(trip_decoded);
        
                    // Append one trip to the general csv file
                    fs.appendFileSync("./bike-routes/routes.csv", `"${bike}","${i}","${trip_encoded}"\r\n`);

                    startPoint = endPoint;
                    endPoint = this.getPoint();
                } catch(error) {
                    console.error(error.name, error.message)
                }

            }
    
            // Save all trips for one bike to a new json file
            fs.writeFileSync(`./bike-routes/${bike}.json`, JSON.stringify(bikeObj, null, 4));
            counter.bikes += 1;
        }
        // Update the number in the counter file, in order to not use
        // same "bike ids" next time
        fs.writeFileSync(`./counter.json`, JSON.stringify(counter, null, 4));
    }
}

module.exports = tripGenerator;