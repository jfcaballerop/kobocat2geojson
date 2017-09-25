var tj = require('togeojson'),
    fs = require('fs'),
    // node doesn't have xml parsing or a dom. use xmldom 
    DOMParser = require('xmldom').DOMParser,
    ArgumentValidator = require('argument-validator');

var _error_noexist = 'No existe el fichero';
var _error_unexp = 'Unexpected return of path';
var pathutils = require('path');
var Regex = require("regex");
var exec = require('child_process').exec;
var http = require('http');
var request = require('request');

exports.connect2Kobo = function(username, password, kobohost, kobopath) {
    var options = {
        auth: {
            user: username,
            pass: password,
            sendImmediately: false
        }
    };

    request.get(kobohost + kobopath, options, function(error, response, body) {
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.

        if (response.statusCode == 201 || response.statusCode == 200) {
            console.log('\n\nHOST ' + kobohost + ':: ' + username + ' - ' + password +
                '\nBODY:\n' + body);
            return ('ok');
        } else {
            console.log('error:', error); // Print the error if one occurred
            console.log('error: ' + response.statusCode);
            console.log(body);
        }
        // request = http.get(options, function(res) {
        //     console.log('STATUS: ' + res.statusCode);
        //     console.log('HEADERS: ' + JSON.stringify(res.headers));
        //     res.setEncoding('utf8');

        //     var body = "";
        //     res.on('data', function(data) {
        //         body += data;
        //     });
        //     res.on('end', function() {
        //         console.log(body);
        //     });
        //     res.on('error', function(e) {
        //         console.log("Got error: " + e.message);
        //         return ('CONNECTION ERR ' + e.message);
        //     });
        // });
        // request.end();
    });
};

exports.replace = function(objetivo, reemplazos) {
    var param_encontrados = objetivo.match(/%(.*?)%/g);

    if (param_encontrados) {
        var nombre_param = null,
            valor_reemplazo = null;

        for (var i = 0; i < param_encontrados.length; i++) {
            nombre_param = param_encontrados[i].replace(/%/g, '');
            valor_reemplazo = reemplazos[nombre_param];

            objetivo = objetivo.replace(param_encontrados[i], valor_reemplazo);
        }
    }

    return objetivo;
};

exports.parse2savemongo = function(path, collection, host, port, db, user, pass, authdb) {
    ArgumentValidator.string(path, 'path');
    ArgumentValidator.notNull(path, 'path');
    ArgumentValidator.string(collection, 'collection');
    ArgumentValidator.notNull(collection, 'collection');
    ArgumentValidator.string(port, 'port');
    ArgumentValidator.notNull(host, 'host');
    ArgumentValidator.string(db, 'db');
    ArgumentValidator.notNull(db, 'db');
    ArgumentValidator.string(user, 'user');
    ArgumentValidator.notNull(user, 'user');
    ArgumentValidator.string(pass, 'pass');
    ArgumentValidator.notNull(pass, 'pass');
    ArgumentValidator.string(authdb, 'authdb');
    ArgumentValidator.notNull(authdb, 'authdb');

    if (fs.existsSync(path)) {

        var path_stat = fs.statSync(path);

        if (path_stat.isFile()) {
            var fileconv;
            var converted;
            file = pathutils.basename(path);
            if (pathutils.extname(file) === '.gpx') {
                console.log('GPX Translate ' + file);
                fileconv = new DOMParser().parseFromString(fs.readFileSync(path, 'utf8'));
                converted = tj.gpx(fileconv, { styles: true });

            } else if (pathutils.extname(file) === '.kml') {
                console.log('KML Translate ' + file);
                fileconv = new DOMParser().parseFromString(fs.readFileSync(path, 'utf8'));
                converted = tj.kml(fileconv, { styles: true });
            }
            console.log(JSON.stringify(converted));
            // Parse file
            // {"type":"FeatureCollection","features":[
            // var regex = new Regex(/^.*\[/);
            var patt_ini = /^.*\"features\"\:\[/ig;
            var patt_fin = /\]\}$/ig;
            // La parte de geometry no hace falta cambiarla
            //var patt_geo = /\"geometry\"/ig;
            //.replace(patt_geo, 'location')
            // console.log('Resultado ' + patt_ini.test(JSON.stringify(converted)));
            // console.log('Resultado Fin ' + patt_fin.test(JSON.stringify(converted)));
            var converted_string = JSON.stringify(converted);
            fs.writeFileSync('/tmp/' + pathutils.basename(file, pathutils.extname(file)) + '.geojson', converted_string.replace(patt_ini, '[').replace(patt_fin, ']'), 'utf8');
            var command = 'mongoimport "/tmp/' + pathutils.basename(file, pathutils.extname(file)) + '.geojson"' +
                ' -c ' + collection + ' --host ' + host + ' --port ' + port + ' --db ' + db + ' -u "' + user +
                '" -p "' + pass + '" --authenticationDatabase "' + authdb + '" --jsonArray';

            exec(command, function(error, stdout, stderr) {
                console.log(file + ' stdout: ' + stdout);
                console.log(file + ' stderr: ' + stderr);
                if (error !== null) {
                    console.log(file + ' exec error: ' + error);
                }
            });
            return path;

        } else if (path_stat.isDirectory()) {
            fs.readdirSync(path).forEach(function(file) {
                // Por cada archivo del directorio
                // Comprobar que es un fichero, para no bajar recursivamente
                var fileconv;
                var converted;
                if (fs.statSync(path + '/' + file).isFile()) {
                    if (pathutils.extname(file) === '.gpx') {
                        console.log('GPX Translate ' + file);
                        fileconv = new DOMParser().parseFromString(fs.readFileSync(path + '/' + file, 'utf8'));
                        converted = tj.gpx(fileconv, { styles: true });

                    } else if (pathutils.extname(file) === '.kml') {
                        console.log('KML Translate ' + file);
                        fileconv = new DOMParser().parseFromString(fs.readFileSync(path + '/' + file, 'utf8'));
                        converted = tj.kml(fileconv, { styles: true });
                    }
                    //console.log(JSON.stringify(converted));
                    // Parse file
                    // {"type":"FeatureCollection","features":[
                    // var regex = new Regex(/^.*\[/);
                    var patt_ini = /^.*\"features\"\:\[/ig;
                    var patt_fin = /\]\}$/ig;
                    // La parte de geometry no hace falta cambiarla
                    //var patt_geo = /\"geometry\"/ig;
                    //.replace(patt_geo, 'location')
                    // console.log('Resultado ' + patt_ini.test(JSON.stringify(converted)));
                    // console.log('Resultado Fin ' + patt_fin.test(JSON.stringify(converted)));
                    var converted_string = JSON.stringify(converted);
                    fs.writeFileSync('/tmp/' + pathutils.basename(file, pathutils.extname(file)) + '.geojson', converted_string.replace(patt_ini, '[').replace(patt_fin, ']'), 'utf8');
                    var command = 'mongoimport "/tmp/' + pathutils.basename(file, pathutils.extname(file)) + '.geojson"' +
                        ' -c ' + collection + ' --host ' + host + ' --port ' + port + ' --db ' + db + ' -u "' + user +
                        '" -p "' + pass + '" --authenticationDatabase "' + authdb + '" --jsonArray';

                    exec(command, function(error, stdout, stderr) {
                        console.log(file + ' stdout: ' + stdout);
                        console.log(file + ' stderr: ' + stderr);
                        if (error !== null) {
                            console.log(file + ' exec error: ' + error);
                        }
                    });
                }
            });
            return path;
        } else {
            return _error_unexp;
        }
    } else {
        return _error_noexist;
    }
};