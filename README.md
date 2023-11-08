# Summary

This program uses https://openrouteservice.org API for auto-generating a number of consequent routes (end point for route n = start point for route n+1) for electric bikes, which takes into consideration obstacles and any polygons to avoid defined by yourself. See file /src/cities/1.json as where city.coords and city.forbidden are required.
Your generated routes will be saved to /src/bike-routes with one .json file per bike

# Getting started

Register on and login to https://openrouteservice.org to get a token. Insert your token into token.js file.

In order to generate mock trips run the script with ```node main.js```.

Default params can be changed either directly in main.js file or by passing them via commandline in the following order ```node main.js <cityid> <startAt> <bikes>```
where ```cityid``` it the id of the document with geometrydata you want to use for city zones and forbidden zones within the city. ```startAt``` is the number of bike-routes file you want to start from, do not use default each time as it will overwrite existing files. ```bikes``` is the number of bikes you want to generate routes for. 

