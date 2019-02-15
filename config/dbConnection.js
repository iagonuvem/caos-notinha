var MongoModule = require('mongodb').MongoClient;
 
const url = 'mongodb://tatooine.mongodb.umbler.com:48254';
const dbName = 'notinha';
 
function dbConnection(){
 this._MongoClient = undefined;
 this._MongoDB = undefined;
}
 
dbConnection.prototype.connectToMongo = function(callback){
  	// Create a new MongoClient
	const client = new MongoModule(url);

	// Use connect method to connect to the Server
	client.connect(function(err) {
	  assert.equal(null, err);
	  console.log("Connected successfully to server");

	  const db = client.db(dbName);

	  return callback(client,db);
	});

  // MongoModule.connect(url, { useNewUrlParser: true }, function(err, client) {
  // console.log("Server Conectado Com Sucesso!");
  // console.log(client);
  // var MongoClient = client;
  // var MongoDB = client.db(dbName);
  
  // return callback(MongoClient, MongoDB);
  // });
 
}
 
module.exports = function(){
 return dbConnection;
}