function StatementDAO(conn){
    this._connection = conn;
}

/**
* Busca todas as notinhas ordenadas por data
* @author Iago Nuvem
*/
StatementDAO.prototype.getAllStatements = function(res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('statements');

        collection.find().sort({ "date_close" : -1 }).toArray(function(err, result){
            // console.log(result);
            res.send(result);  
        });

        client.close();
    });
}

/**
 * Retorna o extrato atual
 * @author Iago Nuvem
 */
StatementDAO.prototype.getCurrentStatement = function(res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('statements');

        var date = new Date().toISOString();

        collection.find({'date_open' : {$lte : date}, 'date_close': {$gte: date}}).toArray(function(err, result){
            // console.log(result);
            res.send(result);  
        });

        client.close();
    });
}

/**
 * Abre uma nova notinha
 * @param {date_close} 'data de fechamento'
 * @author Iago Nuvem
 */
StatementDAO.prototype.insertStatement = function(req){
    var conn = this._connection;
    var users = [];

    new Promise(function(resolve,reject){
        var mongoConnected = conn.connectToMongo(function(client, db){
            const collection = db.collection('users');
            
            collection.find().project({nickname: 1}).toArray(function(err, result){
                if(err){
                    reject(err);
                }
                // console.log(result);
                fillData(result);
            });

            client.close();
        });

        function fillData(data){
            for(var i in data){
                users.push(data[i].nickname);
            }
            resolve(users);
        }
    })
    .then(function(data){
        // console.log(JSON.stringify(data));
        var request = require('request');
        // console.log(req.protocol+'://'+req.get('host')+'/getBalanceMulti');
        request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url: req.protocol+'://'+req.get('host')+'/notinhas/getBalanceMulti',
            form: { users : JSON.stringify(data)},
            // json: true
        }, function(error,response,body){
            if (!error && response.statusCode == 200) {
                var data = {
                    'date_open' : new Date().toISOString(),
                    'date_close': req.body.date_close,
                    'statement' : JSON.parse(body)
                }
                // console.log(data);

                // Insere nova fatura
                var mongoConnected = conn.connectToMongo(function(client, db){
                    const collection = db.collection('statements');
                    collection.insertOne(data);
                    client.close();
                });

                // Atualiza as notinhas com a data anterior à data de fechamento da fatura
                var mongoConnected = conn.connectToMongo(function(client, db){
                    const collection = db.collection('notinhas');
                    collection.updateMany({date: { $lte: data.date_open}},{ $set: { active: 0 }}, function(err, res){
                        if(err){
                            res.send({'success': false, 'msg': 'Falha ao fechar notinha!'});
                            throw err;
                        }

                        res.send({'success': true, 'msg': 'Notinha fechada com sucesso!'});
                    });
                    client.close();
                });
            }
            else{
                res.send({'success': false, 'msg': 'Falha ao fechar notinha!'});
            }
        });
    });
}

module.exports = function(){
    return StatementDAO;
}