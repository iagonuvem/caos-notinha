function PaymentDAO(conn){
    this._connection = conn;
}

/**
 * Busca Todos os pagamentos efetuados por determinado pagador
 * @param {Nome do usuario} user
 * @author Iago Nuvem
 */
PaymentDAO.prototype.getAllByPayerName = function(user,res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('payments');

        collection.find({'payer_name': user}).toArray(function(err, result){
            // console.log(result);
            res.send(result);  
        });

        client.close();
    });
}

/**
 * Busca todos os pagamentos recebidos por determinado receptor
 * @param {Nome do usuario} user
 * @author Iago Nuvem
 */
PaymentDAO.prototype.getAllByReceiverName = function(user,res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('payments');

        collection.find({'receiver_name': user}).toArray(function(err, result){
            // console.log(result);
            res.send(result);  
        });

        client.close();
    });
}

/**
 * Busca todos os pagamentos de determinada notinha
 * @param {_id do documento da fatura(statement)} statement_id
 * @author Iago Nuvem
 */
module.exports.getAllByStatement = function(statement_id, res){
    var ObjectID = require('mongodb').ObjectID;

    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('payments');

        collection.find({'statement_id': ObjectID(statement_id)}).toArray(function(err, result){
            // console.log(result);
            res.send(result);  
        });

        client.close();
    });
}

/**
 * Checa um pagamento
 * @param {ObjectId do documento do pagamento} payment_id
 * @author Iago Nuvem
 */
PaymentDAO.prototype.checkPayment = function(payment_id,res){
    var ObjectID = require('mongodb').ObjectID;

    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('payments');

        collection.updateOne({'_id' : ObjectID(payment_id) },{ $set : {'checked': true}},function(err,res){
            if(err){
                throw err;
            }
        });

        client.close();
    });
}

module.exports = function(){
    return PaymentDAO;
}