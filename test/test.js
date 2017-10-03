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
                                // ADD PROPERTIES
                                Object.keys(e).forEach(function(k) {
                                    if (k.indexOf("Grupo5Lg==2/comments") !== -1) {
                                        newGJson.properties.domcomments = e[k];
                                    }
                                    if (k.indexOf("Grupo5Lg==2/HistCons") !== -1) {
                                        newGJson.properties.dconslos = e[k];
                                    }
                                    if (k.indexOf("Grupo5Lg==2/clearing") !== -1) {
                                        newGJson.properties.dclearing = e[k];
                                    }
                                    if (k.indexOf("Grupo5Lg==2/transdamage") !== -1) {
                                        newGJson.properties.dcrossdamages = e[k];
                                    }
                                    if (k.indexOf("Grupo5Lg==2/Estvisual") !== -1) {
                                        newGJson.properties.dvisualcondition = e[k];
                                    }
                                    if (k.indexOf("Foto1/foto1") !== -1 || k.indexOf("Foto2/foto2") !== -1 ||
                                        k.indexOf("Foto3/foto3") !== -1 || k.indexOf("Foto4/foto4") !== -1) {
                                        newGJson.properties.dphoto === undefined ? newGJson.properties.dphoto = [] : false;
                                        newGJson.properties.dphoto.push(e[k]);
                                    }
                                    if (k.indexOf("group3_3_/odtbed") !== -1) {
                                        newGJson.properties.dprotexit = e[k];
                                    }
                                    if (k.indexOf("group3_3_/odtprotection") !== -1) {
                                        newGJson.properties.dprotentrance = e[k];
                                    }
                                    if (k.indexOf("group3_3_/odtlength") !== -1) {
                                        newGJson.properties.dlength = e[k];
                                    }
                                    if (k.indexOf("group3_3_/odtdiameter") !== -1) {
                                        newGJson.properties.ddiameter = e[k];
                                    }
                                    if (k.indexOf("group3_3_/odtwidth") !== -1) {
                                        newGJson.properties.dculwidth = e[k];
                                    }
                                    if (k.indexOf("group3_3_/odtsection") !== -1) {
                                        newGJson.properties.dsection = e[k];
                                    }
                                    if (k.indexOf("group3_3_/nelements") !== -1) {
                                        newGJson.properties.dculnumelem = e[k];
                                    }
                                    if (k.indexOf("group3_3_/odtmaterial") !== -1) {
                                        newGJson.properties.dmaterial = e[k];
                                    }
                                    if (k.indexOf("Grupo12/HistCons") !== -1) {
                                        newGJson.properties.gconslos = e[k];
                                    }
                                    if (k.indexOf("failure1_extend") !== -1 || k.indexOf("failure2_extend") !== -1 || k.indexOf("failure3_extend") !== -1) {
                                        newGJson.properties.gextentfailure = e[k];
                                    }
                                    if (k.indexOf("Grupo4Lg==1/failure1") !== -1 || k.indexOf("Grupo4Lg==2/failure2") !== -1 || k.indexOf("Grupo4Lg==3/failure3") !== -1) {
                                        console.log('key: ' + k + '  ' + e[k]);
                                        newGJson.properties.gtypefailure = e[k];
                                    }
                                    /*if(k.indexOf("intensity1, intensity2, intensity3") !== -1){
                                        newGJson.properties.gintensityfailure = e[k];
                                    }
                                    if(k.indexOf("HistInc") !== -1){
                                        newGJson.properties.gevidrecfailures = e[k];
                                    }
                                    if(k.indexOf("Estvisual") !== -1){
                                        newGJson.properties.gvisualcondition = e[k];
                                    }
                                    if(k.indexOf("Foto1/foto1, Foto2/foto2, Foto3/foto3, Foto4/foto4, Foto5/foto5") !== -1){
                                        newGJson.properties.gphoto = e[k];
                                    }
                                    if(k.indexOf("VegTipus1") !== -1){
                                        newGJson.properties.gtypevegetation = e[k];
                                    }
                                    if(k.indexOf("aretreatments") !== -1){
                                        newGJson.properties.gtreatments = e[k];
                                    }
                                    if(k.indexOf("ContencioSN") !== -1){
                                        newGJson.properties.gtreatmentsretaining = e[k];
                                    }
                                    if(k.indexOf("ContTipus1") !== -1){
                                        newGJson.properties.gtreatmentsretainingtype = e[k];
                                    }
                                    if(k.indexOf("ContExt1") !== -1){
                                        newGJson.properties.gtreatmentsretainingextension = e[k];
                                    }
                                    if(k.indexOf("ContEfec1") !== -1){
                                        newGJson.properties.gtreatmentsretainingeffectiveness = e[k];
                                    }
                                    if(k.indexOf("ContCons1") !== -1){
                                        newGJson.properties.gtreatmentsretainingconservation = e[k];
                                    }
                                    if(k.indexOf("otractconten") !== -1){
                                        newGJson.properties.gtreatmentsretainingother = e[k];
                                    }
                                    if(k.indexOf("DefensaSN") !== -1){
                                        newGJson.properties.gtreatmentsdefence = e[k];
                                    }
                                    if(k.indexOf("DefTipus1") !== -1){
                                        newGJson.properties.gtreatmentsdefencetype = e[k];
                                    }
                                    if(k.indexOf("DefExt1") !== -1){
                                        newGJson.properties.gtreatmentsdefenceextension = e[k];
                                    }
                                    if(k.indexOf("DefEfec1") !== -1){
                                        newGJson.properties.gtreatmentsdefenceeffectiveness = e[k];
                                    }
                                    if(k.indexOf("DefCons1") !== -1){
                                        newGJson.properties.gtreatmentsdefenceconservation = e[k];
                                    }
                                    if(k.indexOf("otractdefen") !== -1){
                                        newGJson.properties.gtreatmentsdefenceother = e[k];
                                    }
                                    if(k.indexOf("RecobrimentSN") !== -1){
                                        newGJson.properties.gtreatmentscoating = e[k];
                                    }
                                    if(k.indexOf("RecTipus1") !== -1){
                                        newGJson.properties.gtreatmentscoatingtype = e[k];
                                    }
                                    if(k.indexOf("RecExt1") !== -1){
                                        newGJson.properties.gtreatmentscoatingextension = e[k];
                                    }
                                    if(k.indexOf("RecEfec1") !== -1){
                                        newGJson.properties.gtreatmentscoatingeffectiveness = e[k];
                                    }
                                    if(k.indexOf("RecCons1") !== -1){
                                        newGJson.properties.gtreatmentscoatingconservation = e[k];
                                    }
                                    if(k.indexOf("otractdereco") !== -1){
                                        newGJson.properties.gtreatmentscoatingother = e[k];
                                    }
                                    if(k.indexOf("DrensSN") !== -1){
                                        newGJson.properties.gtreatmentsinternaldrainages = e[k];
                                    }
                                    if(k.indexOf("DrenExt") !== -1){
                                        newGJson.properties.gtreatmentsinternaldrainagesextension = e[k];
                                    }
                                    if(k.indexOf("DrenDens") !== -1){
                                        newGJson.properties.gtreatmentsinternaldrainageseffectiveness = e[k];
                                    }
                                    if(k.indexOf("DrenEfec") !== -1){
                                        newGJson.properties.gtreatmentsinternaldrainagesconservation = e[k];
                                    }
                                    if(k.indexOf("size") !== -1){
                                        newGJson.properties.gblocks = e[k];
                                    }
                                    if(k.indexOf("Bermes, Bermes2, Bermes3") !== -1){
                                        newGJson.properties.gshoulders = e[k];
                                    }
                                    if(k.indexOf("Grupo1/Generals/Longitud") !== -1){
                                        newGJson.properties.glength = e[k];
                                    }
                                    if(k.indexOf("DistTalud1, DistTalud2") !== -1){
                                        newGJson.properties.gdistance = e[k];
                                    }
                                    if(k.indexOf("AngTalud1, AngTalud2") !== -1){
                                        newGJson.properties.gslope = e[k];
                                    }
                                    if(k.indexOf("DistTalud3") !== -1){
                                        newGJson.properties.gh_h = e[k];
                                    }
                                    if(k.indexOf("AltTalud1, AltTalud2, AltTalud3") !== -1){
                                        newGJson.properties.gheight = e[k];
                                    }
                                    if(k.indexOf("nature1, nature2") !== -1){
                                        newGJson.properties.gnature = e[k];
                                    }
                                    if(k.indexOf("material") !== -1){
                                        newGJson.properties.gmaterial = e[k];
                                    }
                                    if(k.indexOf("Grupo1/Generals/Marge") !== -1){
                                        newGJson.properties.gposition = e[k];
                                    }
                                    if(k.indexOf("Grupo1/Generals/type") !== -1){
                                        newGJson.properties.gtype = e[k];
                                    }
                                    if(k.indexOf("coments") !== -1){
                                        newGJson.properties.bomcomments = e[k];
                                    }
                                    if(k.indexOf("HistCons") !== -1){
                                        newGJson.properties.bconslos = e[k];
                                    }
                                    if(k.indexOf("danotipo/danotipo_funcionales") !== -1){
                                        newGJson.properties.bdamagesnonstructural = e[k];
                                    }
                                    if(k.indexOf("danotipo/danotipo_estructura") !== -1){
                                        newGJson.properties.bdamagesstructural = e[k];
                                    }
                                    if(k.indexOf("danotipo_estructura") !== -1){
                                        newGJson.properties.bdamagesstructuralgeneraltype = e[k];
                                    }
                                    if(k.indexOf("e_bov") !== -1){
                                        newGJson.properties.bdamagesvaultsarchesmechanicaldurable = e[k];
                                    }
                                    if(k.indexOf("import1, importdurable1") !== -1){
                                        newGJson.properties.bdamagesvaultsarchesimportance = e[k];
                                    }
                                    if(k.indexOf("p_elemento") !== -1){
                                        newGJson.properties.bdamagespiersmechanicaldurable = e[k];
                                    }
                                    if(k.indexOf("import2, importdurable2") !== -1){
                                        newGJson.properties.bdamagespiersimportance = e[k];
                                    }
                                    if(k.indexOf("t_elemento") !== -1){
                                        newGJson.properties.bdamagesspandrelwallmechanicaldurable = e[k];
                                    }
                                    if(k.indexOf("import3, importdurable3") !== -1){
                                        newGJson.properties.bdamagesspandrelwallimportance = e[k];
                                    }
                                    if(k.indexOf("e_elemento") !== -1){
                                        newGJson.properties.bdamagesabutmentsmechanicaldurable = e[k];
                                    }
                                    if(k.indexOf("import4, importdurable4") !== -1){
                                        newGJson.properties.bdamagesabutmentsimportance = e[k];
                                    }
                                    if(k.indexOf("a_elemento") !== -1){
                                        newGJson.properties.bdamagessidewallsmechanicaldurable = e[k];
                                    }
                                    if(k.indexOf("import5, importdurable5") !== -1){
                                        newGJson.properties.bdamagessidewallsimportance = e[k];
                                    }
                                    if(k.indexOf("d_losas") !== -1){
                                        newGJson.properties.bdamagesslabmechanicaldurable = e[k];
                                    }
                                    if(k.indexOf("import6, importdurable6") !== -1){
                                        newGJson.properties.bdamagesslabimportance = e[k];
                                    }
                                    if(k.indexOf("d_vigas") !== -1){
                                        newGJson.properties.bdamagesbeamsbracesmechanicaldurable = e[k];
                                    }
                                    if(k.indexOf("import7, importdurable7") !== -1){
                                        newGJson.properties.bdamagesbeamsbracesimportance = e[k];
                                    }
                                    if(k.indexOf("d_apoyos") !== -1){
                                        newGJson.properties.bdamagesbearingstype = e[k];
                                    }
                                    if(k.indexOf("import8") !== -1){
                                        newGJson.properties.bdamagesbearingsimportance = e[k];
                                    }
                                    if(k.indexOf("d_zonas") !== -1){
                                        newGJson.properties.bdamagesspecialareastype = e[k];
                                    }
                                    if(k.indexOf("import9") !== -1){
                                        newGJson.properties.bdamagesspecialareasimportance = e[k];
                                    }
                                    if(k.indexOf("danotipo/danotipo_cimentacion") !== -1){
                                        newGJson.properties.bdamagesfoundations = e[k];
                                    }
                                    if(k.indexOf("fcimentacion") !== -1){
                                        newGJson.properties.bdamagesfoundationsgeneraltype = e[k];
                                    }
                                    if(k.indexOf("dcimentacion1") !== -1){
                                        newGJson.properties.bdamagesfoundationsdetailedtype = e[k];
                                    }
                                    if(k.indexOf("Estvisual") !== -1){
                                        newGJson.properties.bvisualcondition = e[k];
                                    }
                                    if(k.indexOf("Foto1/foto1, Foto2/foto2, Foto3/foto3, Foto4/foto4") !== -1){
                                        newGJson.properties.bphoto = e[k];
                                    }
                                    if(k.indexOf("protectionofabutments") !== -1){
                                        newGJson.properties.bprotectabut = e[k];
                                    }
                                    if(k.indexOf("piersover") !== -1){
                                        newGJson.properties.bpiersriver = e[k];
                                    }
                                    if(k.indexOf("foundation") !== -1){
                                        newGJson.properties.bfoundation = e[k];
                                    }
                                    if(k.indexOf("galibo_inf") !== -1){
                                        newGJson.properties.bfreeheight = e[k];
                                    }
                                    if(k.indexOf("width") !== -1){
                                        newGJson.properties.bwidth = e[k];
                                    }
                                    if(k.indexOf("span") !== -1){
                                        newGJson.properties.bmaxspan = e[k];
                                    }
                                    if(k.indexOf("blenght") !== -1){
                                        newGJson.properties.blenght = e[k];
                                    }
                                    if(k.indexOf("spans_ms") !== -1){
                                        newGJson.properties.bspans = e[k];
                                    }
                                    if(k.indexOf("number_spans") !== -1){
                                        newGJson.properties.bnumberspans = e[k];
                                    }
                                    if(k.indexOf("alignment") !== -1){
                                        newGJson.properties.balignment = e[k];
                                    }
                                    if(k.indexOf("Abuntments_material") !== -1){
                                        newGJson.properties.bmaterialabutments = e[k];
                                    }
                                    if(k.indexOf("Pier_material") !== -1){
                                        newGJson.properties.bmaterialpiers = e[k];
                                    }
                                    if(k.indexOf("Deck_material") !== -1){
                                        newGJson.properties.bmaterialdeck = e[k];
                                    }
                                    if(k.indexOf("Girder_material") !== -1){
                                        newGJson.properties.bmaterialgirder = e[k];
                                    }
                                    if(k.indexOf("obstaculo") !== -1){
                                        newGJson.properties.bobstaclesaved = e[k];
                                    }
                                    if(k.indexOf("entorno") !== -1){
                                        newGJson.properties.bsurrounding = e[k];
                                    }
                                    if(k.indexOf("puente_tipologia") !== -1){
                                        newGJson.properties.btype = e[k];
                                    }*/


                                });
                                // ADD GEOMETRY
                                newGJson.geometry.coordinates[0] = e._geolocation[1];
                                newGJson.geometry.coordinates[1] = e._geolocation[0];
                                // Get the documents collection 
                                /*var collection = db.collection('koboinfos');
                                // Insert
                                collection.insertOne(newGJson, function(err, result) {
                                    assert.equal(err, null);
                                    assert.equal(1, result.insertedCount);
                                });
*/
                            }
                            //console.log('newGJson ' + JSON.stringify(newGJson));
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