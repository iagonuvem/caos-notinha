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
PaymentDAO.prototype.getAllByStatement = function(statement_id, res){
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
 * Insere um pagamento
 * @param {JSON com os dados} data
 * @author Iago Nuvem
 */
PaymentDAO.prototype.insert = function(data){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('payments');

        collection.insert(data, function(err,res){
            if(err){
                res.status(500);
                res.send({'success': false, 'msg' : 'Falha ao anotar pagamento!'})
                throw err;
                
            }

            res.send({'success': true,'msg' : 'Pagamento anotado com sucesso!'})
        });

        client.close();
    });
}

/**
 * Checa um pagamento propriedade 'payed' da notinha
 * @param {ObjectId do documento do pagamento} payment_id
 * @author Iago Nuvem
 */
PaymentDAO.prototype.checkPayment = function(payment_id,res){
    var ObjectID = require('mongodb').ObjectID;
    let conn = this._connection;

    new Promise(function(resolve,reject){
        var mongoConnected = conn.connectToMongo(function(client, db){
            const collection = db.collection('payments');
    
            collection.findOne({ _id : ObjectID(payment_id)}, function(err, result){
                if(err){
                    reject(err);
                }
                resolve(result);
            });
    
            client.close();
        });
    })
    .then(function(data){
        var mongoConnected = conn.connectToMongo(function(client, db){
            const collection = db.collection('statements');
            
            collection.findOne({ _id : ObjectID(data.statement_id)}, function(err,result){
                // console.log(result);
                for(var i in result.statement){
                    if(result.statement[i].name == data.payer_name){
                        result.statement[i].balance += data.amount;
                    }
                    if(result.statement[i].name == data.receiver_name){
                        result.statement[i].balance -= data.amount;
                    }
                    // console.log(result.statement[i].balance);
                    if(result.statement[i].balance == 0){
                        setPayed(data.statement_id,result.statement[i].name);
                    }
                }
            });
    
            client.close();
        });

        function setPayed(statement_id, name){
            var mongoConnected = conn.connectToMongo(function(client, db){
                const collection = db.collection('statements');
                
                collection.updateOne({ _id : ObjectID(statement_id), 'statement.name' : name},{ $set : {'statement.$.payed' : true} },function(err,obj){
                    if(err){
                        throw err;
                    }
                    // console.log(obj.result);
                });
        
                client.close();
            });
        }
    })
    .then(function(){
        var mongoConnected = conn.connectToMongo(function(client, db){
            const collection = db.collection('payments');
    
            collection.updateOne({'_id' : ObjectID(payment_id) },{ $set : {'checked': true}},function(err,obj){
                if(err){
                    reject(err);
                }

                if(obj.result.nModified > 0){
                    res.send({'success': true,'msg' : 'Pagamento verificado com sucesso!'});
                }else{
                    res.send({'success': false,'msg' : 'Nenhum dado foi alterado!'});
                }
            });
    
            client.close();
        });
    })
    .catch(function(err){
        res.send({'success': false, 'msg' : 'Houve um erro no servidor!'});
        throw err;
    });
}

module.exports = function(){
    return PaymentDAO;
}