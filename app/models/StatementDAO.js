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
 * Retorna o balanço descontando os pagamentos feitos para determinada notinha
 * @param {Id da fatura(statement)} _id
 * @author Iago Nuvem
 */
StatementDAO.prototype.getBalanceById = function(_id, res){
    let conn = this._connection;
    
    new Promise(function(resolve,reject){
        var mongoConnected = conn.connectToMongo(function(client, db){
            const collection = db.collection('statements');
    
            collection.find({_id : _id}).toArray(function(err, result){
                if(err){
                    res.send({'success' : 0, 'msg': 'Falha ao buscar fatura!'});
                    reject(err);
                }
    
                resolve(result);  
            });
    
            client.close();
        });
    })
    .then(function(data){
        var mongoConnected = conn.connectToMongo(function(client, db){
            const collection = db.collection('payments');
    
            collection.find({statement_id: _id}).toArray(function(err, result){
                if(err){
                    res.send({'success' : 0, 'msg': 'Falha ao buscar pagamentos da fatura!'});
                    throw err;
                }
                var statement_data = data[0];
                // Percorre os pagamentos
                for(var i in result){
                    //Checa se o pagamento foi verificado
                    if(result[i].checked != false){
                        // Percorre o extrato
                        for(var j in statement_data.statement){
                            if(result[i].payer_name == statement_data.statement[j].name){
                                statement_data.statement[j].balance += result[i].amount;
                            }

                            if(result[i].receiver_name == statement_data.statement[j].name){
                                statement_data.statement[j].balance -= result[i].amount;
                            }

                            if(statement_data.statement[j].balance == 0){
                                // var request = require('request');
                                // // console.log(req.protocol+'://'+req.get('host')+'/getBalanceMulti');
                                // request.post({
                                //     headers: {'content-type' : 'application/x-www-form-urlencoded'},
                                //     url: req.protocol+'://'+req.get('host')+'/notinhas/getBalanceMulti',
                                //     form: { users : JSON.stringify(data)},
                                //     // json: true
                                // }, function(error,response,body){
                                //     if (!error && response.statusCode == 200) {
                                //         var data = {
                                //             'date_open' : new Date().toISOString(),
                                //             'date_close': req.body.date_close,
                                //             'statement' : JSON.parse(body)
                                //         }
                                //         // console.log(data);

                                //         // Insere nova fatura
                                //         var mongoConnected = conn.connectToMongo(function(client, db){
                                //             const collection = db.collection('statements');
                                //             collection.insertOne(data);
                                //             client.close();
                                //         });

                                //         // Atualiza as notinhas com a data anterior à data de fechamento da fatura
                                //         var mongoConnected = conn.connectToMongo(function(client, db){
                                //             const collection = db.collection('notinhas');
                                //             collection.updateMany({date: { $lte: data.date_open}},{ $set: { active: 0 }}, function(err, res){
                                //                 if(err){
                                //                     res.send({'success': false, 'msg': 'Falha ao fechar notinha!'});
                                //                     throw err;
                                //                 }

                                //                 res.send({'success': true, 'msg': 'Notinha fechada com sucesso!'});
                                //             });
                                //             client.close();
                                //         });
                                //     }
                                //     else{
                                //         res.send({'success': false, 'msg': 'Falha ao fechar notinha!'});
                                //     }
                                // });
                                statement_data.statement[j].payed = true;
                            }
                        }
                    }
                }
                res.send(statement_data);  
            });
    
            client.close();
        });
    })
    .catch(function(err){
        res.send({'success': false, 'msg' : 'Houve uma falha no servidor!'});
        console.log(err);
    });
}

/**
 * Retorna o balanço descontando os pagamentos feitos de determinado usuario
 * @param {Nome do usuario} user
 * @author Iago Nuvem
 */
StatementDAO.prototype.getBalanceByUser = function(user,res){
    let conn = this._connection;
    
    new Promise(function(resolve,reject){
        var mongoConnected = conn.connectToMongo(function(client, db){
            const collection = db.collection('statements');
    
            collection.find({statement : { $elemMatch: {name: user, payed: false}}}).toArray(function(err, result){
                if(err){
                    res.send({'success' : 0, 'msg': 'Falha ao buscar fatura!'});
                    reject(err);
                }
                
                let data = {
                    'name' : user,
                    'income' : 0,
                    'expanse' : 0,
                    'balance': 0
                };

                for(var i in result){
                    for(var j in result[i].statement){
                        if(result[i].statement[j].name == user){
                            data.income += result[i].statement[j].income;
                            data.expanse += result[i].statement[j].expanse;
                            data.balance += result[i].statement[j].balance;
                        }
                    }  
                }
                resolve(data);  
            });
    
            client.close();
        });
    })
    .then(function(data){
        // console.log(data);
        var mongoConnected = conn.connectToMongo(function(client, db){
            const collection = db.collection('payments');
    
            collection.find({$and : [{$or: [ {payer_name: user}, {receiver_name: user} ]}, {checked : false}]}).toArray(function(err, result){
                if(err){
                    res.send({'success' : 0, 'msg': 'Falha ao buscar pagamentos da fatura!'});
                    reject(err);
                }
                
                for(var i in result){
                    // console.log(result[i].amount);
                    if(result[i].payer_name == data.name){
                        // console.log('payer');
                        data.expanse -= result[i].amount;
                        data.balance += result[i].amount;
                    }
                    if(result[i].receiver_name == data.name){
                        // console.log('receiver');
                        data.income -= result[i].amount;
                        data.balance -= result[i].amount;
                    }
                }

                res.send(data);
            });
    
            client.close();
        });
    })
    .catch(function(err){
        res.send({'success': false, 'msg' : 'Houve uma falha no servidor!'});
        console.log(err);
    });
}

/**
 * Abre uma nova notinha
 * @param {date_close} 'data de fechamento'
 * @author Iago Nuvem
 */
StatementDAO.prototype.insertStatement = function(res,req){
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
                    collection.updateMany({date: { $lte: data.date_open}},{ $set: { active: 0 }}, function(err, result){
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