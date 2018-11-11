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
    // console.log(req.body);
    var users = JSON.parse(req.body.users);
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
    
    var participants = JSON.parse(req.body.participants);
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
            "total_value" : req.body.total_value,
            "created_by": req.body.created_by,
            "payed_by": JSON.parse(req.body.payed_by),
            "participants": participants,
            "date": new Date().toJSON(),
            "active": 1,
            "checked" : false
    }

    var connection = new application.config.dbConnection();
    var NotinhaDAO = new application.app.models.NotinhaDAO(connection);
    NotinhaDAO.insertNotinha(data);
}