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
    var payment_id = ObjectID(req.body._id);
    PaymentDAO.checkPayment(payment_id, res);
    res.send({'msg' : 'Pagamento verificado com sucesso!'})
}