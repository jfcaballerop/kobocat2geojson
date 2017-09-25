var kobo2geojson = require('../lib/kobocat2geojson');


if (process.argv.length <= 9) {
    console.log(process.argv);
    console.log("\n## ERROR ##\n\nUsage: node " + __filename + " path collection host port db user pass authdb");
    process.exit(-1);
}
var path = process.argv[2];
var collection = process.argv[3];
var host = process.argv[4];
var port = process.argv[5];
var db = process.argv[6];
var user = process.argv[7];
var pass = process.argv[8];
var authdb = process.argv[9];
console.log('Resultado:: ' + kobo2geojson.parse2savemongo(path, collection, host, port, db, user, pass, authdb));