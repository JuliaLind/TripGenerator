# Summary

This program uses https://openrouteservice.org API for auto-generating a number of consequent routes (end point for route n = start point for route n+1) for electric bikes, which takes into consideration obstacles and any polygons to avoid defined by yourself. See file /cities/1.json as where city.coords and city.forbidden are required.

Your generated routes will be saved to /bike-routes with one .json file per bike and also a csv file with all routes. The csv file contains the routes as string-encoded polylines. The Json files contain two arrays each - one with routes as string-encoded polylines and the other with coordinates as arrays.


# Getting started

Register on and login to https://openrouteservice.org to get a token. Insert your token into token.js file.

In order to generate mock trips stand in the root directory and run the script with ```node main.js```.

In order to start the web application where you can see the generated routes on the map, stand in the root directory and enter ```python3 -m http.server 9000``` and then visit localhost:9000 in your browser.

Default params can be changed either directly in main.js file or by passing them via commandline in the following order ```node main.js <cityid> <bikes>```
where ```cityid``` it the id of the document with geometrydata you want to use for city zones and forbidden zones within the city, and  ```bikes``` is the number of bikes you want to generate routes for. 

