function PaymentDAO(conn){
    this._connection = conn;
}

PaymentDAO.prototype.getAllPaymentsByPayerName = function(user,res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('payments');

        collection.find({'payer_name': user}).toArray(function(err, result){
            // console.log(result);
            res.send(result);  
        });

        client.close();
    });
}
