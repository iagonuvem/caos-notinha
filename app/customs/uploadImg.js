'use strict';

/** Module dependencies */
var formidable = require('formidable');
var http = require('http');
var fs = require('fs');

module.exports.upload = function(req, res){
    var form = new formidable.IncomingForm();
  
    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      var image = files.image
        , image_upload_path_old = image.path
        , image_upload_path_new = './upload/'
        , image_upload_name = image.name
        , image_upload_path_name = image_upload_path_new + image_upload_name
        ;
  
      if (fs.existsSync(image_upload_path_new)) {
        fs.rename(
          image_upload_path_old,
          image_upload_path_name,
          function (err) {
          if (err) {
            console.log('Err: ', err);
            res.end('Deu merda na hora de mover a imagem!');
          }
          var msg = 'Imagem ' + image_upload_name + ' salva em: ' + image_upload_path_new;
          console.log(msg);
          res.end(msg);
        });
      }
      else {
        fs.mkdir(image_upload_path_new, function (err) {
          if (err) {
            console.log('Err: ', err);
            res.end('Deu merda na hora de criar o diretório!');
          }
          fs.rename(
            image_upload_path_old,
            image_upload_path_name,
            function(err) {
            var msg = 'Imagem ' + image_upload_name + ' salva em: ' + image_upload_path_new;
            console.log(msg);
            res.end(msg);
          });
        });
      }
    });
}