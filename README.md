# Notifiation

An extended version of this program is now available here: https://github.com/JuliaLind/TripGenerator-extended . The extended version maps each generated trip to a unique user object with a valid JWT-token that contains userid in the payload.

# Summary

This program uses https://openrouteservice.org API for auto-generating a number of consequent routes (end point for route n = start point for route n+1) for electric bikes, which takes into consideration obstacles and any polygons to avoid defined by yourself. See file /cities/1.json as where city.coords and city.forbidden are required.

Your generated routes will be saved to /bike-routes with one .json file per bike and also a csv file with all routes. The csv file contains the routes as string-encoded polylines. The Json files contain two arrays each - one with routes as string-encoded polylines and the other with coordinates as arrays.

The repo also contains a simple web application where you can view the generated routes on a map. Select or unselect the routes to view using checkboxes in the menu on the left. Note that if zoomed out a lot it may look like the markers are overlapping the restricted zones, zoom in for more precise view.


# Getting started

Register on and login to https://openrouteservice.org to get a token. Insert your token into token.js file.

In order to generate mock trips stand in the root directory and run the script with ```node main.js```.

In order to start the web application where you can see the generated routes on the map, stand in the root directory and enter ```python3 -m http.server 9000``` and then visit localhost:9000 in your browser.

The following attributes are variable and can be set by yourself in the src/tripgenerator.js model:
- cityid: the id of the document with geometrydata you want to use for city zones and forbidden zones within the city
- number of bikes to generate routes for
- number of routes to generate per bike
- minimum distance between start point and end point of each route (birdway)
- maximum distance between start point and end point of each route (birdway)
- if the end point of the last route should be the same as start point of first route (for each bike, comes in handy if you want to loop through same sequence several times)

Values for cityid and number of bikes can also be passed via commandline in the following order ```node main.js <cityid> <bikes>```, where ```cityid``` it the id of the document with geometrydata you want to use for city zones and forbidden zones within the city, and  ```bikes``` is the number of bikes you want to generate routes for. 


In the directory reset/ you can find a bash script that removes all previously generated routes and resets counter to zero. When starting the script with ```./reset.bash``` you will be prompted to confirm if you really wish to reset. You can confirm with any of Y | y | Yes | yes

# Good to know

Make sure to include the area(s) right outside of city borders into the list of forbidden zones, otherwise the routes may go outside of the zone.

Note that OpenRoutService has a request limitation on free of charge account which currently is limited at 40 requests per minute (2000 requests per day).



