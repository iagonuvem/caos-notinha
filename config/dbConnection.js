var MongoModule = require('mongodb').MongoClient;
 
const url = 'mongodb://caos:EWpGOyVKPLRN0uC1@tatooine.mongodb.umbler.com:48254?authMechanism=SCRAM-SHA-1&authSource=notinha';
const dbName = 'notinha';
 
function dbConnection(){
 this._MongoClient = undefined;
 this._MongoDB = undefined;
}
 
dbConnection.prototype.connectToMongo = function(callback){
  MongoModule.connect(url, { useNewUrlParser: true }, function(err, client) {
  // console.log("Server Conectado Com Sucesso!");
  console.log(client);
  var MongoClient = client;
  var MongoDB = client.db(dbName);
  
  return callback(MongoClient, MongoDB);
  });
 
}
 
module.exports = function(){
 return dbConnection;
}