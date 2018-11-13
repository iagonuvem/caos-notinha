var ObjectID = require('mongodb').ObjectID;

/**
* Busca todas as notinhas ordenadas por data
* @author Iago Nuvem
*/
module.exports.getAllStatements = function(application,req,res){
    var connection = new application.config.dbConnection();
    var StatementDAO = new application.app.models.StatementDAO(connection);
    StatementDAO.getAllStatements(res);
}

/**
 * Retorna o extrato atual INICIAL
 * @author Iago Nuvem
 */
module.exports.getCurrentStatement = function(application, req, res){
    var connection = new application.config.dbConnection();
    var StatementDAO = new application.app.models.StatementDAO(connection);
    StatementDAO.getCurrentStatement(res);
}

/**
* Retorna o extrato descontando os Pagamentos feitos de DETERMINADA NOTINHA
* @author Iago Nuvem 
*/
module.exports.getBalanceById = function(application,req,res){
    var connection = new application.config.dbConnection();
    var StatementDAO = new application.app.models.StatementDAO(connection);
    var _id = ObjectID(req.body._id);
    StatementDAO.getBalanceById(_id,res);
}

/**
* Retorna o extrato descontando os Pagamentos feitos de DETERMINADO USUARIO
* @author Iago Nuvem 
*/
module.exports.getBalanceByUser = function(application,req,res){
    var connection = new application.config.dbConnection();
    var StatementDAO = new application.app.models.StatementDAO(connection);
    var user = req.body.user.toString().toLowerCase();
    StatementDAO.getBalanceByUser(user,res);
}

/**
 * Abre nova notinha
 * @author Iago Nuvem
 */
module.exports.insertStatement = function(application, req, res){
    var connection = new application.config.dbConnection();
    var StatementDAO = new application.app.models.StatementDAO(connection);
    StatementDAO.insertStatement(res,req);
}
