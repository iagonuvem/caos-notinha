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

        collection.find().toArray(function(err, result){
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
 * @param {nome do usuario} owner 
 */
NotinhasDAO.prototype.getNotinhaByParticipant = function(owner,res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('notinhas');

        collection.find({'participants.nome': owner.toLowerCase()}).toArray(function(err, result){
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
NotinhasDAO.prototype.getNotinhaByPayed = function(owner,res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('notinhas');

        collection.find({'payed_by.nome': owner.toLowerCase()}).toArray(function(err, result){
            // console.log(result);
            res.send(result);  
        });

        client.close();
    });
};


module.exports = function(){
    return NotinhasDAO;
}