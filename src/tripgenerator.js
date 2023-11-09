const randomPointsOnPolygon = require('random-points-on-polygon');
const geoPointInPolygon = require('geo-point-in-polygon');
const token = require('../token.js');

const tripGenerator = {
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
        const city = require(`./cities/${cityid}.json`);

        this.cityCoords = city.coords;
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

        return resJson.routes[0].geometry;
    },

    reverseCoords: function reverseCoords(coordsArr) {
        return coordsArr.map((coord) => coord.reverse());
    }
}

module.exports = tripGenerator;