var kobo2geojson = require('../lib/kobocat2geojson');


if (process.argv.length <= 4) {
    console.log(process.argv);
    // console.log("\n## ERROR ##\n\nUsage: node " + __filename + " path collection host port db user pass authdb");
    console.log("\n## ERROR ##\n\nUsage: node " + __filename + " kobouser kobopass kobohost kobopath");
    process.exit(-1);
}
var kobouser = process.argv[2];
var kobopass = process.argv[3];
var kobohost = process.argv[4];
var kobopath = process.argv[5];
// var host = process.argv[4];
// var port = process.argv[5];
// var db = process.argv[6];
// var user = process.argv[7];
// var pass = process.argv[8];
// var authdb = process.argv[9];
console.log('Resultado:\n' + kobo2geojson.connect2Kobo(kobouser, kobopass, kobohost, kobopath));