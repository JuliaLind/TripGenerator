[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/JuliaLind/TripGenerator/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/JuliaLind/TripGenerator/?branch=master)  

# Summary

This program uses https://openrouteservice.org API for auto-generating a number of consequent routes (end point for route n = start point for route n+1) for electric bikes, which takes into consideration obstacles and any polygons to avoid defined by yourself. See file /cities/1.json as where city.coords and city.forbidden are required.

Your generated routes will be saved to /bike-routes with one .json file per bike and also a csv file with all routes. The csv file contains the routes as string-encoded polylines. The Json files contain two arrays each - one with routes as string-encoded polylines and the other with coordinates as arrays.

The repo also contains a simple web application where you can view the generated routes on a map. Select or unselect the routes to view using checkboxes in the menu on the left.


# Getting started

Register on and login to https://openrouteservice.org to get a token. Insert your token into token.js file.

In order to generate mock trips stand in the root directory and run the script with ```node main.js```.

In order to start the web application where you can see the generated routes on the map, stand in the root directory and enter ```python3 -m http.server 9000``` and then visit localhost:9000 in your browser.

Default params for cityid and number of bikes can be changed either directly in main.js file or by passing them via commandline in the following order ```node main.js <cityid> <bikes>```, where ```cityid``` it the id of the document with geometrydata you want to use for city zones and forbidden zones within the city, and  ```bikes``` is the number of bikes you want to generate routes for. 

Default params for routes per bike and sameStartEnd can only be changed via main.js. sameStartEnd is a boolean - true means that the end point of the last trip will be the same as startpoint of first trip (which enables looping through array over and over in a simulation), false means that the endpoint can be either same point or a different point that is in the city area and not in a forbidden zone.

In the directory reset/ you can find a bash script that removes all previously generated routes and resets counter to zero. When starting the script with ```./reset.bash``` you will be prompted to confirm if you really wish to reset. You can confirm with any of Y | y | Yes | yes

# Good to know

Make sure to include the area(s) right outside of city borders into the list of forbidden zones, otherwise the routes may go outside of the zone.

Note that OpenRoutService has a request limitation on free of charge account which currently is limited at 40 requests per minute (2000 requests per day).



