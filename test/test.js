var kobo2geojson = require('../lib/kobocat2geojson');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
// Connection URL 
var url = 'mongodb://mkfwcore:admin@localhost:27017/mkfwcoredb';

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

kobo2geojson.connect2Kobo(kobouser, kobopass, kobohost, kobopath)
    .then(function(res) {
        res.forEach(function(element, index) {
            console.log('\n\n\nResultado ID:\n' + JSON.stringify(element.id));

            kobo2geojson.connect2Kobo(kobouser, kobopass, kobohost, kobopath + '/' + element.id)
                .then(function(res2) {
                    // console.log('\n\n\nResultado2:\n' + JSON.stringify(res2.id));
                    // Use connect method to connect to the Server 
                    MongoClient.connect(url, function(err, db) {
                        console.log("Connected correctly to server");

                        res2.forEach(function(e, i) {
                            if (e._geolocation[0] !== null && e._geolocation[0] !== null) {
                                var newGJson = {
                                    type: 'Feature',
                                    properties: {},
                                    geometry: {
                                        type: 'Point',
                                        coordinates: []
                                    }
                                };
                                newGJson.properties._id = e._id;
                                newGJson.geometry.coordinates = e._geolocation;
                                // Get the documents collection 
                                var collection = db.collection('koboinfos');
                                // Insert
                                collection.insertOne(newGJson, function(err, result) {
                                    assert.equal(err, null);
                                    assert.equal(1, result.insertedCount);
                                });

                            }
                            console.log('newGJson ' + JSON.stringify(newGJson));
                        });
                        db.close();
                    });
                }).catch(function(err2) {
                    console.log('ERR2 ' + err);
                });

        });
    }).catch(function(err) {
        console.log('ERR ' + err);
    });