function UserDAO(conn){
    this._connection = conn;
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
        console.log(data);
        collection.updateOne({_id : _id},{$set: data}, function(err,obj){
            if(err){
                res.send({'success': false, 'msg' : 'Falha ao alterar usuário!'});
                throw err;
            }

            res.send({'success': true, 'msg' : 'Usuário alterado com sucesso!'});
        });

        client.close();
    });
}

module.exports = function(){
    return UserDAO;
}