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
 * Retorna o extrato atual
 * @author Iago Nuvem
 */
module.exports.getCurrentStatement = function(application, req, res){
    var connection = new application.config.dbConnection();
    var StatementDAO = new application.app.models.StatementDAO(connection);
    StatementDAO.getCurrentStatement(res);
}

/**
 * Abre nova notinha
 * @author Iago Nuvem
 */
module.exports.addStatement = function(application, req, res){
    var connection = new application.config.dbConnection();
    var StatementDAO = new application.app.models.StatementDAO(connection);
    StatementDAO.addStatement(req);
}
