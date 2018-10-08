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
 * Retorna as notinhas Criadas pelo usuario @owner 
 * @param {nome do usuario} owner
 */
NotinhasDAO.prototype.getNotinhasByOwner = function(owner, res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('notinhas');

        collection.find({'created_by': owner.toLowerCase()}).toArray(function(err, result){
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
        
        collection.find({'participants.nome': participant.toLowerCase()}).toArray(function(err, result){
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

        collection.find({'payed_by.nome': owner.toLowerCase()}).toArray(function(err, result){
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
        
        collection.find({'payed_by.nome': user.toLowerCase(), 'active': 1}).toArray(function(err, result){
            // console.log('resultado da primeira: '+result);
            getBalance(conn, result, user, res);
        });
        client.close();
    });

    function getBalance(conn, income_data, user, res){
        balance = 0;
        var mongoConnected = conn.connectToMongo(function(client, db){
            const collection = db.collection('notinhas');
            
            collection.find({'participants.nome': user.toLowerCase(), 'active': 1}).toArray(function(err, result){
                // console.log('resultado da segunda: '+result);
                var receita = 0, despesa = 0;
                // For para calcular as receitas
                for(var i in income_data){
                   for(var j in income_data[i].payed_by){
                       if(income_data[i].payed_by[j].nome == user.toLowerCase()){
                           receita += income_data[i].payed_by[j].amount_payed;
                       }
                   }
                }
                // console.log("receita: "+receita);

                // For para calcular as despesas
                for(var i in result){
                    for(var j in result[i].participants){
                        if(result[i].participants[j].nome == user.toLowerCase()){
                            despesa += result[i].participants[j].amount_to_pay;
                        }
                    }
                }
                // console.log("despesa: "+despesa)

                var data = {
                    'income': receita,
                    'expanse': despesa,
                    'balance': receita-despesa
                }
                
                res.send(data);
            });
            client.close();
        });
        
        return balance;
    }
};


/**
 * Insere uma notinha no banco
 * @param {dados da notinha} data
 */
NotinhasDAO.prototype.insertNotinha = function(data){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('notinhas');

        collection.insert(data);

        client.close();
    });
};

module.exports = function(){
    return NotinhasDAO;
}