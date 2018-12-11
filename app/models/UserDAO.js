function UserDAO(conn){
    this._connection = conn;
}

/**
* @author Iago Nuvem
* @returns {Dados do usuario}
*/
UserDAO.prototype.getByName = function(user,res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('users');

        collection.findOne({'nickname' : user.nickname}, function(err, result){
            // console.log(result);
            res.send(result);  
        });

        client.close();
    });
}

/**
 * realiza o login
 * @author Iago Nuvem
 * @returns {Status, msg}
 */
UserDAO.prototype.login = function(user,res){
    let conn = this._connection;
    new Promise(function(resolve,reject){
        var mongoConnected = conn.connectToMongo(function(client, db){
            const collection = db.collection('users');

            
                collection.findOne({'nickname' : user.nickname}, function(err, result){
                    if(err){
                        reject(err);
                    }

                    if(!result){
                        resolve({
                            "ok" : 0,
                            "msg": "Usuário Inexistente!"
                        });
                    }
                    else{
                        resolve({
                            "ok" : 1,
                            "data": result
                        });
                    }
                });

                client.close();
            
        });
    })
    .then(function(result){
        if(result.ok == 0){
            res.send(result);
        }
        else{
            if(result.data.password == user.password){
                res.send({
                    "ok" : 1,
                    "msg": "Usuário Logado!",
                    "data": result.data
                });
            }
            else{
                res.send({
                    "ok" : 0,
                    "msg": "Senha Incorreta!",
                });
            }
        }
    })
    .catch(function(err){
        throw err;
    })
}


/**
 * Busca todos os usuários
 * @author Iago Nuvem
 * @returns {Dados dos usuarios}
 */
UserDAO.prototype.getAll = function(res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('users');

        collection.find().toArray(function(err, result){
            // console.log(result);
            res.send(result);  
        });

        client.close();
    });
}

/**
 * Deleta um usuário do banco
 * @author Iago Nuvem
 * @returns {JSON com status e mensagem}
 */
UserDAO.prototype.delete = function(_id, res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('users');

        collection.remove({_id : _id},function(err, obj){
            if(err){
                res.send({'success': false, 'msg' : 'Falha ao deletar usuário!'});
                throw err;
            }

            // console.log(obj.result);
            if(obj.result.n != 0){
                res.send({'success': true, 'msg' : ' Usuário deletado!'});
            }
            else{
                res.send({'success': false, 'msg' : 'Usuário não cadastrado, impossível deletar!'});
            }
        });

        client.close();
    });
}

/**
 * Insere um usuario
 * @param {dados do usuario} data
 * @author Iago Nuvem
 */
UserDAO.prototype.insert = function(data, res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('users');

        collection.insertOne(data, function(err,obj){
            if(err){
                res.send({'success': false, 'msg' : 'Falha ao inserir usuário!'});
                throw err;
            }

            res.send({'success': true, 'msg' : 'Usuário Cadastrado com sucesso!'});
        });

        client.close();
    });
}

/**
 * Altera um usuário
 * @param {dados do usuario} data
 * @author Iago Nuvem
 */
UserDAO.prototype.update = function(_id,data, res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('users');
        // console.log(data);
        collection.updateOne({_id : _id},{$set: data}, function(err,obj){
            if(err){
                res.send({'success': false, 'msg' : 'Falha ao alterar usuário!'});
                throw err;
            }

            if(obj.result.nModified > 0){
                res.send({'success': true, 'msg' : 'Usuário alterado com sucesso!'});
            }
            else{
                res.send({'success': false, 'msg' : 'Nenhum dado foi modificado!'});
            }
        });

        client.close();
    });
}

/**
 * Altera o tipo de usuário no sistema
 * @param {Id do usuario} _id
 * @param {Tipo do usuario (0 ou 1)} type
 * @param {Response do Express} res
 * @author Iago Nuvem
 */
UserDAO.prototype.setAdmin = function(_id,type,res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('users');
        // console.log(data);
        collection.updateOne({_id : _id},{$set: {admin: type}}, function(err,obj){
            if(err){
                res.send({'success': false, 'msg' : 'Falha ao alterar usuário!'});
                throw err;
            }

            if(obj.result.nModified > 0){
                res.send({'success': true, 'msg' : 'Usuário alterado com sucesso!'});
            }
            else{
                res.send({'success': false, 'msg' : 'Nenhum dado foi modificado!'});
            }
        });

        client.close();
    });
}

module.exports = function(){
    return UserDAO;
}