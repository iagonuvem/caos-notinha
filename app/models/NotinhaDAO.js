/**
 * Orientação a objetos no JS, note que não é definido como 'class'
 * e sim uma função
 */
function NotinhasDAO(conn){
    //Atributos da classe
    this._connection = conn;
}


/**
 * Note que as funções da "classe" Notinha não estão nescessariamente dentro
 *  da classe, é utilizado o metodo "prototype", que significa que essa função
 * é um atributo da classe "Notinhas"
 */
NotinhasDAO.prototype.getNotinhas = function(res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('notinhas');

        collection.find().sort({ "date" : -1 }).toArray(function(err, result){
            // console.log(result);
            res.send(result);  
        });

        client.close();
    });
};

/**
* Retorna uma notinha pelo _id
* @param {id da notinha} _id
* @author Iago Nuvem
*/
NotinhasDAO.prototype.getNotinhaById = function(_id, res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('notinhas');

        collection.findOne({'_id': _id},function(err, result){
            // console.log(result);
            res.send(result);  
        });

        client.close();
    });
}

/**
 * Retorna as notinhas Criadas pelo usuario @owner 
 * @param {nome do usuario} owner
 */
NotinhasDAO.prototype.getNotinhasByOwner = function(owner, res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('notinhas');

        collection.find({'created_by': owner.toLowerCase(), 'active': 1}).toArray(function(err, result){
            // console.log(result);
            res.send(result);  
        });

        client.close();
    });
};

/**
 * Retorna as Notinhas que o usuário está participando
 * @param {nome do usuario} participant 
 */
NotinhasDAO.prototype.getNotinhasByParticipant = function(participant,res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('notinhas');
        
        collection.find({'participants.nickname': participant.toLowerCase() , 'active' : 1}).toArray(function(err, result){
            // console.log(result);
            res.send(result);  
        });

        client.close();
    });
};


/**
 * Retorna as Notinhas que o usuário pagou
 * @param {nome do usuario} owner
 */
NotinhasDAO.prototype.getNotinhasPayedByName = function(owner,res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('notinhas');

        collection.find({'payed_by.nickname': owner.toLowerCase(), 'active': 1}).toArray(function(err, result){
            // console.log(result);
            res.send(result);  
        });

        client.close();
    });
};

/**
 * Retorna as receitas, despesas e balanço de um usuário por Nome
 * @param {nome do usuario} user
 * @returns {receita, despesa e balanco} 
 */
NotinhasDAO.prototype.getBalanceByName = function(user,res){
    
    var conn = this._connection;
    var mongoConnected = conn.connectToMongo(function(client, db){
        const collection = db.collection('notinhas');
        
        collection.find({'payed_by.nickname': user.toLowerCase(), 'active': 1}).toArray(function(err, result){
            // console.log('resultado da primeira: '+result);
            getBalance(conn, result, user, res);
        });
        client.close();
    });

    function getBalance(conn, income_data, user, res){
        balance = 0;
        var mongoConnected = conn.connectToMongo(function(client, db){
            const collection = db.collection('notinhas');
            
            collection.find({'participants.nickname': user.toLowerCase(), 'active': 1}).toArray(function(err, result){
                // console.log(result);
                var receita = 0.0, despesa = 0.0;
                // For para calcular as receitas
                for(var i in income_data){
                   for(var j in income_data[i].payed_by){
                       if(income_data[i].payed_by[j].nickname == user.toLowerCase()){
                           receita += parseFloat(income_data[i].payed_by[j].amount_payed);
                       }
                   }
                }
                // console.log("receita: "+receita);

                // For para calcular as despesas
                for(var i in result){
                    for(var j in result[i].participants){
                        if(result[i].participants[j].nickname == user.toLowerCase()){
                            despesa += parseFloat(result[i].participants[j].amount_to_pay);
                        }
                    }
                }
                // console.log("despesa: "+despesa)

                var data = {
                    'income': receita,
                    'expanse': despesa,
                    'balance': receita - despesa
                }
                
                res.send(data);
            });
            client.close();
        });
        
        return balance;
    }
};

/**
 * Retorna as receitas, despesas e balanço de Todos os usuários
 * @param {Array com nome dos usuarios} user
 * @returns {receita, despesa e balanco} 
 */
NotinhasDAO.prototype.getBalanceMulti = function(users,res){
    var conn = this._connection;
    let statement = [];
    let users_count = 0;
    // console.log(users);
    for(var i in users){
        users_count++;
    }
    // console.log("users_count="+users_count);

    new Promise(function(resolve, reject){

        var mongoConnected = conn.connectToMongo(function(client, db){
            const collection = db.collection('notinhas');
            
            for(var i in users){
                let user = users[i];
                collection.find({'payed_by.nickname': user.toLowerCase(), 'active': 1}).toArray(function(err, result){
                    getBalance(conn, result, user, res).then(function(data){
                        fillData(data);
                    });
                });
            }
            client.close();
        });

        function fillData(data){
            statement.push(data);
            // console.log(statement.length+ "/" + users_count);
            if(statement.length == users_count){
                return resolve(statement);
            }
        }
    })
    .then(function(data){
        res.send(data);
        return data
    })
    

    function getBalance(conn, income_data, user,res){

        return new Promise(function(resolve, reject) {
            var mongoConnected = conn.connectToMongo(function(client, db){
                const collection = db.collection('notinhas');
                
                collection.find({'participants.nickname': user.toLowerCase(), 'active': 1}).toArray(function(err, result){
                    // console.log('resultado da segunda: '+result);
                    var receita = 0.0, despesa = 0.0;
                    // For para calcular as receitas
                    for(var i in income_data){
                       for(var j in income_data[i].payed_by){
                           if(income_data[i].payed_by[j].nickname == user.toLowerCase()){
                               receita += parseFloat(income_data[i].payed_by[j].amount_payed);
                           }
                       }
                    }
                    // console.log("receita: "+receita);
    
                    // For para calcular as despesas
                    for(var i in result){
                        for(var j in result[i].participants){
                            if(result[i].participants[j].nickname == user.toLowerCase()){
                                despesa += parseFloat(result[i].participants[j].amount_to_pay);
                            }
                        }
                    }
                    // console.log("despesa: "+despesa)
    
                    var b = receita-despesa;
                    var data = {
                        'name': user,
                        'income': receita,
                        'expanse': despesa,
                        'balance': b
                    }
                    return resolve(data);
                });
                client.close();
            });
            
        }).then(function(result){
            return result;
        })
    }    
};

/**
 * Insere uma notinha no banco
 * @param {dados da notinha} data
 */
NotinhasDAO.prototype.insertNotinha = function(data,res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('notinhas');

        collection.insertOne(data, function(err,obj){
            if(err){
                res.send({'success': false, 'msg' : 'Falha ao inserir notinha!'});
                throw err;
            }

            res.send({'success': true, 'msg' : 'Notinha Cadastrada com sucesso!'});
        });

        client.close();
    });
};

/**
 * Altera uma notinha
 * @param {dados do usuario} data
 * @author Iago Nuvem
 */
NotinhasDAO.prototype.update = function(_id,data, res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('notinhas');
        // console.log(data);
        collection.updateOne({_id : _id},{$set: data}, function(err,obj){
            if(err){
                res.send({'success': false, 'msg' : 'Falha ao alterar notinha!'});
                throw err;
            }

            if(obj.result.nModified > 0){
                res.send({'success': true, 'msg' : 'Notinha alterada com sucesso!'});
            }
            else{
                res.send({'success': false, 'msg' : 'Nenhum dado foi modificado!'});
            }
        });

        client.close();
    });
}

/**
 * Deleta uma notinha do banco
 * @author Iago Nuvem
 * @returns {JSON com status e mensagem}
 */
NotinhasDAO.prototype.delete = function(_id, res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('notinhas');

        collection.remove({_id : _id},function(err, obj){
            if(err){
                res.send({'success': false, 'msg' : 'Falha ao deletar notinha!'});
                throw err;
            }

            // console.log(obj.result);
            if(obj.result.n != 0){
                res.send({'success': true, 'msg' : 'Notinha deletada!'});
            }
            else{
                res.send({'success': false, 'msg' : 'Notinha não cadastrada, impossível deletar!'});
            }
        });

        client.close();
    });
}

module.exports = function(){
    return NotinhasDAO;
}