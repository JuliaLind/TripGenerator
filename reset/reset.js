const counter = require("../counter.json")
const fs = require('fs');

counter.bikes = 1;

fs.writeFileSync(`../counter.json`, JSON.stringify(counter, null, 4));