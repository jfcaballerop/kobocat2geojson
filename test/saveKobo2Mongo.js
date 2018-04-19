var kobo2geojson = require('../lib/kobocat2geojson');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
// Connection URL 
var url = 'mongodb://mkfwcore:admin@localhost:27017/mkfwcoredb';


var kobouser = "ingenierosinf";
var kobopass = "Ingenieros123";
var kobohost = "kobocatdom.i3met.com";
var kobopath = "http://" + kobohost + "/api/v1/data"
// var host = process.argv[4];
// var port = process.argv[5];
// var db = process.argv[6];
// var user = process.argv[7];
// var pass = process.argv[8];
// var authdb = process.argv[9];


var arrayNewKobos = [764, 765, 766, 767, 768];

kobo2geojson.connect2Kobo(kobouser, kobopass, kobopath)
    .then(function (res) {
        res.forEach(function (element, index) {
            // console.log('\n\n\nResultado ID:', JSON.stringify(element.id));
            kobo2geojson.connect2Kobo(kobouser, kobopass, kobopath + '/' + element.id)
                .then(function (res2) {
                    // Use connect method to connect to the Server 
                    MongoClient.connect(url, function (err, db) {
                        // console.log("Connected correctly to server");

                        res2.forEach(function (e, i) {
                            if (arrayNewKobos.indexOf(e._id) >= 0) {
                                console.log('Resultado2:', JSON.stringify(e._id));
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
                                    Object.keys(e).forEach(function (k) {
                                        if (k.indexOf("Grupo5Lg==2/comments") !== -1 || k.indexOf("Grupo5Lg==2/coments") !== -1) {
                                            newGJson.properties.domcomments = e[k];
                                        }
                                        if (k.indexOf("Grupo5Lg==2/HistCons") !== -1) {
                                            newGJson.properties.dconslos = e[k];
                                        }
                                        if (k.indexOf("Grupo5Lg==2/clearing") !== -1) {
                                            newGJson.properties.dclearing = e[k];
                                            e[k].indexOf("no") !== -1 ? newGJson.properties.dlostsection = "0%" : newGJson.properties.dlostsection = "";
                                            // console.log('key2: ' + newGJson.properties.dlostsection);

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
                                        if (k.indexOf("group3_3_/odtbed") !== -1 || k.indexOf("group3_2/odtbed") !== -1) {
                                            newGJson.properties.dprotexit = e[k];
                                        }
                                        if (k.indexOf("group3_3_/odtprotection") !== -1 || k.indexOf("group3_2/odtprotection") !== -1) {
                                            newGJson.properties.dprotentrance = e[k];
                                        }
                                        if (k.indexOf("group3_2/odtlength") !== -1 || k.indexOf("group3_3_/odtlength") !== -1) {
                                            newGJson.properties.dlength = e[k];
                                        }
                                        if (k.indexOf("group3_3_/odtdiameter") !== -1 || k.indexOf("group3_2/odtdiameter") !== -1) {
                                            newGJson.properties.ddiameter = e[k];
                                        }
                                        if (k.indexOf("group3_3_/odtwidth") !== -1 || k.indexOf("group3_2/odtwidth") !== -1) {
                                            newGJson.properties.dculwidth = e[k];
                                        }
                                        if (k.indexOf("group3_3_/odtsection") !== -1 || k.indexOf("group3_2/odtsection") !== -1) {
                                            newGJson.properties.dsection = e[k];
                                        }
                                        if (k.indexOf("group3_3_/nelements") !== -1) {
                                            newGJson.properties.dculnumelem = e[k];
                                        }
                                        if (k.indexOf("group1_1/type") !== -1) {
                                            newGJson.properties.dtype = e[k];
                                        }
                                        if (k.indexOf("group3_3_/odtmaterial") !== -1 || k.indexOf("group3_2/odtmaterial") !== -1) {
                                            newGJson.properties.dmaterial = e[k];
                                        }
                                        if (k.indexOf("Grupo12/HistCons") !== -1) {
                                            newGJson.properties.gconslos = e[k];
                                        }
                                        if (k.indexOf("failure1_extend") !== -1 || k.indexOf("failure2_extend") !== -1 || k.indexOf("failure3_extend") !== -1) {
                                            newGJson.properties.gextentfailure = e[k];
                                        }
                                        if ((k.indexOf("Grupo4Lg==1/failure1") !== -1 || k.indexOf("Grupo4Lg==2/failure2") !== -1 ||
                                                k.indexOf("Grupo4Lg==3/failure3") !== -1) && (k.indexOf("failure1_extend") === -1 &&
                                                k.indexOf("failure2_extend") === -1 && k.indexOf("failure3_extend") === -1)) {
                                            newGJson.properties.gtypefailure = e[k];
                                        }
                                        if (k.indexOf("Grupo4Lg==1/intensity1") !== -1 || k.indexOf("Grupo4Lg==2/intensity2") !== -1 || k.indexOf("Grupo4Lg==3/intensity3") !== -1) {
                                            newGJson.properties.gintensityfailure = e[k];
                                        }
                                        if (k.indexOf("Grupo12/HistInc") !== -1) {
                                            newGJson.properties.gevidrecfailures = e[k];
                                        }
                                        if (k.indexOf("Grupo12/Estvisual") !== -1) {
                                            newGJson.properties.gvisualcondition = e[k];
                                        }
                                        if (k.indexOf("Foto1/foto1") !== -1 || k.indexOf("Foto2/foto2") !== -1 ||
                                            k.indexOf("Foto3/foto3") !== -1 || k.indexOf("Foto4/foto4") !== -1) {
                                            newGJson.properties.gphoto === undefined ? newGJson.properties.gphoto = [] : false;
                                            newGJson.properties.gphoto.push(e[k]);
                                        }
                                        if (k.indexOf("Grupo8/VegTipus1") !== -1) {
                                            // console.log('key: ' + k + ' - ' + e[k] + ' id: ' + e._id);
                                            newGJson.properties.gtypevegetation = e[k];
                                            (e[k].indexOf("No_vegetation") !== -1 && e[k].indexOf(" No_vegetation") === -1) ? newGJson.properties.gvegetation = "no": newGJson.properties.gvegetation = "yes";
                                            // console.log('key2: ' + newGJson.properties.gvegetation);
                                        }
                                        if (k.indexOf("Grupo10/aretreatments") !== -1) {
                                            newGJson.properties.gtreatments = e[k];
                                        }
                                        if (k.indexOf("ContencioSN") !== -1) {
                                            newGJson.properties.gtreatmentsretaining = e[k];
                                        }
                                        if (k.indexOf("ContTipus1") !== -1) {
                                            newGJson.properties.gtreatmentsretainingtype = e[k];
                                        }
                                        if (k.indexOf("ContExt1") !== -1) {
                                            newGJson.properties.gtreatmentsretainingextension = e[k];
                                        }
                                        if (k.indexOf("ContEfec1") !== -1) {
                                            newGJson.properties.gtreatmentsretainingeffectiveness = e[k];
                                        }
                                        if (k.indexOf("ContCons1") !== -1) {
                                            newGJson.properties.gtreatmentsretainingconservation = e[k];
                                        }
                                        if (k.indexOf("otractconten") !== -1) {
                                            newGJson.properties.gtreatmentsretainingother = e[k];
                                        }
                                        if (k.indexOf("DefensaSN") !== -1) {
                                            newGJson.properties.gtreatmentsdefence = e[k];
                                        }
                                        if (k.indexOf("DefTipus1") !== -1) {
                                            newGJson.properties.gtreatmentsdefencetype = e[k];
                                        }
                                        if (k.indexOf("DefExt1") !== -1) {
                                            newGJson.properties.gtreatmentsdefenceextension = e[k];
                                        }
                                        if (k.indexOf("DefEfec1") !== -1) {
                                            newGJson.properties.gtreatmentsdefenceeffectiveness = e[k];
                                        }
                                        if (k.indexOf("DefCons1") !== -1) {
                                            newGJson.properties.gtreatmentsdefenceconservation = e[k];
                                        }
                                        if (k.indexOf("otractdefen") !== -1) {
                                            newGJson.properties.gtreatmentsdefenceother = e[k];
                                        }
                                        if (k.indexOf("RecobrimentSN") !== -1) {
                                            newGJson.properties.gtreatmentscoating = e[k];
                                        }
                                        if (k.indexOf("RecTipus1") !== -1) {
                                            newGJson.properties.gtreatmentscoatingtype = e[k];
                                        }
                                        if (k.indexOf("RecExt1") !== -1) {
                                            newGJson.properties.gtreatmentscoatingextension = e[k];
                                        }
                                        if (k.indexOf("RecEfec1") !== -1) {
                                            newGJson.properties.gtreatmentscoatingeffectiveness = e[k];
                                        }
                                        if (k.indexOf("RecCons1") !== -1) {
                                            newGJson.properties.gtreatmentscoatingconservation = e[k];
                                        }
                                        if (k.indexOf("otractdereco") !== -1) {
                                            newGJson.properties.gtreatmentscoatingother = e[k];
                                        }
                                        if (k.indexOf("DrensSN") !== -1) {
                                            newGJson.properties.gtreatmentsinternaldrainages = e[k];
                                        }
                                        if (k.indexOf("DrenExt") !== -1) {
                                            newGJson.properties.gtreatmentsinternaldrainagesextension = e[k];
                                        }
                                        if (k.indexOf("DrenDens") !== -1) {
                                            newGJson.properties.gtreatmentsinternaldrainageseffectiveness = e[k];
                                        }
                                        if (k.indexOf("DrenEfec") !== -1) {
                                            newGJson.properties.gtreatmentsinternaldrainagesconservation = e[k];
                                        }
                                        if (k.indexOf("Grupo3Lg==1/size") !== -1) {
                                            newGJson.properties.gblocks = e[k];
                                        }
                                        if (k.indexOf("Bermes") !== -1) {
                                            newGJson.properties.gshoulders = e[k];
                                        }
                                        if (k.indexOf("Grupo1/Generals/Longitud") !== -1) {
                                            newGJson.properties.glength = e[k];
                                        }
                                        if (k.indexOf("Grupo3Lg==1/DistTalud1") !== -1 || k.indexOf("Grupo3Lg==2/DistTalud2") !== -1) {
                                            newGJson.properties.gdistance = e[k];
                                        }
                                        if (k.indexOf("AngTalud") !== -1) {
                                            newGJson.properties.gslope = e[k];
                                        }
                                        if (k.indexOf("DistTalud3") !== -1) {
                                            newGJson.properties.gh_h = e[k];
                                        }
                                        if (k.indexOf("AltTalud") !== -1) {
                                            newGJson.properties.gheight = e[k];
                                        }
                                        if (k.indexOf("nature") !== -1) {
                                            newGJson.properties.gnature = e[k];
                                        }
                                        if (k.indexOf("Grupo3Lg==3/material") !== -1) {
                                            newGJson.properties.gmaterial = e[k];
                                        }
                                        if (k.indexOf("Grupo1/Generals/Marge") !== -1) {
                                            newGJson.properties.gposition = e[k];
                                        }
                                        if (k.indexOf("Grupo1/Generals/type") !== -1) {
                                            newGJson.properties.gtype = e[k];
                                        }
                                        if (k.indexOf("Grupo5Lg==1/coments") !== -1) {
                                            newGJson.properties.bomcomments = e[k];
                                        }
                                        if (k.indexOf("Grupo5Lg==1/HistCons") !== -1) {
                                            newGJson.properties.bconslos = e[k];
                                        }
                                        if (k.indexOf("danotipo") !== -1) {
                                            newGJson.properties.bdamagesnonstructural = e[k];
                                        }
                                        if (k.indexOf("danotipo/danotipo_estructura") !== -1) {
                                            newGJson.properties.bdamagesstructural = e[k];
                                        }
                                        if (k.indexOf("group4_2/danotipo_estructura") !== -1) {
                                            newGJson.properties.bdamagesstructuralgeneraltype = e[k];
                                        }
                                        if (k.indexOf("group4_2_1/e_bov") !== -1) {
                                            newGJson.properties.bdamagesvaultsarchesmechanicaldurable = e[k];
                                        }
                                        if (k.indexOf("import1") !== -1 || k.indexOf("importdurable1") !== -1) {
                                            newGJson.properties.bdamagesvaultsarchesimportance = e[k];
                                        }
                                        if (k.indexOf("group4_2_2/p_elemento") !== -1) {
                                            newGJson.properties.bdamagespiersmechanicaldurable = e[k];
                                        }
                                        if (k.indexOf("import2") !== -1 || k.indexOf("importdurable2") !== -1) {
                                            newGJson.properties.bdamagespiersimportance = e[k];
                                        }
                                        if (k.indexOf("group4_2_3/t_elemento") !== -1) {
                                            newGJson.properties.bdamagesspandrelwallmechanicaldurable = e[k];
                                        }
                                        if (k.indexOf("import3") !== -1 || k.indexOf("importdurable3") !== -1) {
                                            newGJson.properties.bdamagesspandrelwallimportance = e[k];
                                        }
                                        if (k.indexOf("group4_2_4/e_elemento") !== -1) {
                                            newGJson.properties.bdamagesabutmentsmechanicaldurable = e[k];
                                        }
                                        if (k.indexOf("import4") !== -1 || k.indexOf("importdurable4") !== -1) {
                                            newGJson.properties.bdamagesabutmentsimportance = e[k];
                                        }
                                        if (k.indexOf("group4_2_5/a_elemento") !== -1) {
                                            newGJson.properties.bdamagessidewallsmechanicaldurable = e[k];
                                        }
                                        if (k.indexOf("import5") !== -1 || k.indexOf("importdurable5") !== -1) {
                                            newGJson.properties.bdamagessidewallsimportance = e[k];
                                        }
                                        if (k.indexOf("group4_2_6/d_losas") !== -1) {
                                            newGJson.properties.bdamagesslabmechanicaldurable = e[k];
                                        }
                                        if (k.indexOf("import6") !== -1 || k.indexOf("importdurable6") !== -1) {
                                            newGJson.properties.bdamagesslabimportance = e[k];
                                        }
                                        if (k.indexOf("group4_2_7/d_vigas") !== -1) {
                                            newGJson.properties.bdamagesbeamsbracesmechanicaldurable = e[k];
                                        }
                                        if (k.indexOf("import7") !== -1 || k.indexOf("importdurable7") !== -1) {
                                            newGJson.properties.bdamagesbeamsbracesimportance = e[k];
                                        }
                                        if (k.indexOf("group4_2_8/d_apoyos") !== -1) {
                                            newGJson.properties.bdamagesbearingstype = e[k];
                                        }
                                        if (k.indexOf("import8") !== -1 || k.indexOf("importdurable8") !== -1) {
                                            newGJson.properties.bdamagesbearingsimportance = e[k];
                                        }
                                        if (k.indexOf("group4_2_9/d_zonas") !== -1) {
                                            newGJson.properties.bdamagesspecialareastype = e[k];
                                        }
                                        if (k.indexOf("import9") !== -1 || k.indexOf("importdurable9") !== -1) {
                                            newGJson.properties.bdamagesspecialareasimportance = e[k];
                                        }
                                        if (k.indexOf("danotipo/danotipo_cimentacion") !== -1) {
                                            newGJson.properties.bdamagesfoundations = e[k];
                                        }
                                        if (k.indexOf("group4_1/fcimentacion") !== -1) {
                                            newGJson.properties.bdamagesfoundationsgeneraltype = e[k];
                                        }
                                        if (k.indexOf("group4_1_1/dcimentacion1") !== -1) {
                                            newGJson.properties.bdamagesfoundationsdetailedtype = e[k];
                                        }
                                        if (k.indexOf("Grupo5Lg==1/Estvisual") !== -1) {
                                            newGJson.properties.bvisualcondition = e[k];
                                        }
                                        if (k.indexOf("Foto1/foto1") !== -1 || k.indexOf("Foto2/foto2") !== -1 ||
                                            k.indexOf("Foto3/foto3") !== -1 || k.indexOf("Foto4/foto4") !== -1) {
                                            newGJson.properties.bphoto === undefined ? newGJson.properties.bphoto = [] : false;
                                            newGJson.properties.bphoto.push(e[k]);
                                        }

                                        if (k.indexOf("group3_1/protectionofabutments") !== -1) {
                                            newGJson.properties.bprotectabut = e[k];
                                        }
                                        if (k.indexOf("piersover") !== -1) {
                                            newGJson.properties.bpiersriver = e[k];
                                        }
                                        if (k.indexOf("group3_1/foundation") !== -1) {
                                            newGJson.properties.bfoundation = e[k];
                                        }
                                        if (k.indexOf("group3_1/galibo_inf") !== -1) {
                                            newGJson.properties.bfreeheight = e[k];
                                        }
                                        if (k.indexOf("group3_1/width") !== -1) {
                                            newGJson.properties.bwidth = e[k];
                                        }
                                        if (k.indexOf("group3_1/span") !== -1 && k.indexOf("group3_1/spans_ms") === -1) {
                                            newGJson.properties.bmaxspan = e[k];
                                        }
                                        if (k.indexOf("group3_1/blenght") !== -1) {
                                            newGJson.properties.blenght = e[k];
                                        }
                                        if (k.indexOf("spans_ms") !== -1) {
                                            newGJson.properties.bspans = e[k];
                                        }
                                        if (k.indexOf("number_spans") !== -1) {
                                            newGJson.properties.bnumberspans = e[k];
                                        }
                                        if (k.indexOf("group3_1/alignment") !== -1) {
                                            newGJson.properties.balignment = e[k];
                                        }
                                        if (k.indexOf("group3_2_/Abuntments_material") !== -1 || k.indexOf("group3_1/Abuntmentsmaterial") !== -1) {
                                            newGJson.properties.bmaterialabutments = e[k];
                                        }
                                        if (k.indexOf("group3_2_/Pier_material") !== -1 || k.indexOf("group3_1/Piermaterial") !== -1) {
                                            newGJson.properties.bmaterialpiers = e[k];
                                        }
                                        if (k.indexOf("group3_2_/Deck_material") !== -1 || k.indexOf("group3_1/Deckmaterial") !== -1) {
                                            newGJson.properties.bmaterialdeck = e[k];
                                        }
                                        if (k.indexOf("group3_2_/Girder_material") !== -1) {
                                            newGJson.properties.bmaterialgirder = e[k];
                                        }
                                        if (k.indexOf("group3_1/obstaculo") !== -1) {
                                            newGJson.properties.bobstaclesaved = e[k];
                                        }
                                        if (k.indexOf("group3_1/entorno") !== -1) {
                                            newGJson.properties.bsurrounding = e[k];
                                        }
                                        if (k.indexOf("group3_1/puente_tipologia") !== -1) {
                                            newGJson.properties.btype = e[k];
                                        }

                                        //ADD TYPE KOBO
                                        if (k.indexOf("_xform_id_string") !== -1) {
                                            newGJson.properties.xform_id_string = e[k];
                                        }
                                        if (k.indexOf("group1_1/type") !== -1) {
                                            newGJson.properties.kobo_type = e[k];
                                        }
                                        if (k.indexOf("Grupo1/Generals/type") !== -1) {
                                            newGJson.properties.kobo_type = e[k];
                                        }


                                    });
                                    // ADD GEOMETRY
                                    newGJson.geometry.coordinates[0] = e._geolocation[1];
                                    newGJson.geometry.coordinates[1] = e._geolocation[0];
                                    // Get the documents collection 
                                    var collection = db.collection('koboinfos');
                                    // Insert
                                    collection.insertOne(newGJson, function (err, result) {
                                        if (err)
                                            console.log(err);
                                        console.log('Inserted:', result.insertedCount);
                                    });

                                }
                            }


                            //console.log('newGJson ' + JSON.stringify(newGJson));
                        });
                        db.close();
                    });



                }).catch(function (err2) {
                    console.log('ERR2 ' + err2);
                });

        });
    }).catch(function (err) {
        console.log('ERR ' + err);
    });