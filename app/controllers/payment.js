var ObjectID = require('mongodb').ObjectID;

/**
 * Módulo responsável por buscar todos os pagamentos FEITOS por um usuario, ordenados por data
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getAllByPayerName = function(application, req, res){
    var connection = new application.config.dbConnection();
    var PaymentDAO = new application.app.models.PaymentDAO(connection);
    var user = req.body.user.toString().toLowerCase();
    PaymentDAO.getAllByPayerName(user, res);
}

/**
 * Módulo responsável por buscar todos os pagamentos RECEBIDOS de um usuario, ordenados por data
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getAllByReceiverName = function(application, req, res){
    var connection = new application.config.dbConnection();
    var PaymentDAO = new application.app.models.PaymentDAO(connection);
    var user = req.body.user.toString().toLowerCase();
    PaymentDAO.getAllByReceiverName(user, res);
}
/**
 * Módulo responsável por checar um pagamento
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getAllByStatement = function(application,req,res){
    var connection = new application.config.dbConnection();
    var PaymentDAO = new application.app.models.PaymentDAO(connection);
    var statement_id = ObjectID(req.body._id);
    PaymentDAO.getAllByStatement(statement_id, res);
}

/**
 * Módulo responsável por checar um pagamento
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.check = function(application,req,res){
    var connection = new application.config.dbConnection();
    var PaymentDAO = new application.app.models.PaymentDAO(connection);
    var payment_id = req.body._id;
    PaymentDAO.checkPayment(payment_id, res);
}

/**
 * Módulo responsável por inserir um pagamento
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.insert = function(application,req,res){
    var connection = new application.config.dbConnection();
    var PaymentDAO = new application.app.models.PaymentDAO(connection);
    
    var data = {
        "statement_id" : ObjectID(req.body.statement_id),
        "payer_id" : ObjectID(req.body.payer_id),
        "payer_name" : req.body.payer_name.toLowerCase(),
        "receiver_id" : ObjectID(req.body.receiver_id),
        "receiver_name" : req.body.receiver_name.toLowerCase(),
        "amount": req.body.amount,
        "date" : new Date().toISOString(),
        "checked" : false
    };

    PaymentDAO.insert(data, res);
}