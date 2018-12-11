var ObjectID = require('mongodb').ObjectID;

/**
 * Módulo responsável por buscar todas as notinhas
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getNotinhas = function(application, req, res){
    var connection = new application.config.dbConnection();
    var NotinhaDAO = new application.app.models.NotinhaDAO(connection);
    NotinhaDAO.getNotinhas(res);
}

/**
 * Módulo responsável por buscar a notinha pelo _id
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getNotinhaById = function(application, req, res){
    var connection = new application.config.dbConnection();
    var NotinhaDAO = new application.app.models.NotinhaDAO(connection);
    var _id = ObjectID(req.body._id);
    NotinhaDAO.getNotinhaById(_id, res);
}

/**
 * Módulo responsável por buscar todas as notinhas CRIADAS por determinado usuario
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getNotinhasByOwner = function(application, req, res){
    var connection = new application.config.dbConnection();
    var NotinhaDAO = new application.app.models.NotinhaDAO(connection);
    var user = req.body.user.toString().toLowerCase();
    NotinhaDAO.getNotinhasByOwner(user, res);
}

/**
 * Módulo responsável por buscar todas as notinhas que o usuário pagou alguma parte
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getNotinhasPayedByName = function(application, req, res){
    var connection = new application.config.dbConnection();
    var NotinhaDAO = new application.app.models.NotinhaDAO(connection);
    var user = req.body.user.toString().toLowerCase();
    NotinhaDAO.getNotinhasPayedByName(user, res);
}


/**
 * Módulo responsável por buscar todas as notinhas que o usuario entrou
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getNotinhasByParticipant = function(application, req, res){
    var connection = new application.config.dbConnection();
    var NotinhaDAO = new application.app.models.NotinhaDAO(connection);
    var user = req.body.user.toString().toLowerCase();
    NotinhaDAO.getNotinhasByParticipant(user, res);
}

/**
 * Módulo responsável por calcular o saldo de um usuario
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getBalanceByName = function(application, req, res){
    var connection = new application.config.dbConnection();
    var NotinhaDAO = new application.app.models.NotinhaDAO(connection);
    // console.log(req.body);
    var user = req.body.user.toString().toLowerCase();
    NotinhaDAO.getBalanceByName(user, res);
}

/**
 * Módulo responsável por calcular o saldo de Varios usuario
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getBalanceMulti = function(application, req, res){
    var connection = new application.config.dbConnection();
    var NotinhaDAO = new application.app.models.NotinhaDAO(connection);
    // console.log(req.body.users);
    var users = req.body.users;
    NotinhaDAO.getBalanceMulti(users, res);
}


/**
* Módulo responsável por cadastrar uma notinha no banco
* @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem
 */
module.exports.insertNotinha = function(application,req,res){
    // console.log(req.body)
    var participants = req.body.participants;
    var c = 0;
    //Conta a quantidade de participantes
    for(var i in participants){
        c++;
    }    
    //Divide o valor total para todos os participantes
    var amount_to_pay = req.body.total_value / c;
    
    // Atualiza o valor para cada participante
    for(var i in participants){
        participants[i].amount_to_pay = amount_to_pay;
    }
    var data = {
            "description" : req.body.description,
            "total_value" : parseFloat(req.body.total_value),
            "created_by": req.body.created_by,
            "payed_by": req.body.payed_by,
            "participants": participants,
            "date": new Date().toJSON(),
            "active": 1,
            "checked" : false
    }

    var connection = new application.config.dbConnection();
    var NotinhaDAO = new application.app.models.NotinhaDAO(connection);
    NotinhaDAO.insertNotinha(data,res);
}

/**
* Módulo responsável por alterar uma notinha no banco
* @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem
 */
module.exports.update = function(application,req,res){
    var _id = req.body._id;
    if(!_id){
        res.send({'success' : false, 'msg' : 'Não é possível atualizar sem a referência!'});
    }
    else{
        _id = ObjectID(_id);
    }

    var connection = new application.config.dbConnection();
    var NotinhaDAO = new application.app.models.NotinhaDAO(connection);

    var participants = req.body.participants;
    var c = 0;
    //Conta a quantidade de participantes
    for(var i in participants){
        c++;
    }    
    //Divide o valor total para todos os participantes
    var amount_to_pay = req.body.total_value / c;
    
    // Atualiza o valor para cada participante
    for(var i in participants){
        participants[i].amount_to_pay = amount_to_pay;
    }

    let data = {
            "description" : '',
            "total_value" : 0,
            "payed_by": [],
            "participants": [],
            "updated_at" : new Date().toJSON()

    }

    if(req.body.description != null && req.body.description != ''){
        data.description = req.body.description;
    }else{
        delete data.description;
    }
    
    if(req.body.total_value != null && req.body.total_value != 0) {
        data.total_value = req.body.total_value;
    }else{
        delete data.total_value;
    }

    if(req.body.participants != null && req.body.participants.length > 0){
        data.participants = req.body.participants;
    }else{
        delete data.participants;
    }

    if(req.body.payed_by != null && req.body.payed_by.length > 0){
        data.payed_by = req.body.payed_by;
    }else{
        delete data.payed_by;
    }
        
    // console.log(data);
    NotinhaDAO.update(_id,data,res);
}

/**
 * Módulo responsável por deletar uma notinha
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.delete = function(application, req, res){
    var connection = new application.config.dbConnection();
    var NotinhaDAO = new application.app.models.NotinhaDAO(connection);
    var _id = ObjectID(req.body._id);
    NotinhaDAO.delete(_id,res);
}
