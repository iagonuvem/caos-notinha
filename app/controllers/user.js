var ObjectID = require('mongodb').ObjectID;

/**
 * Módulo responsável por buscar todos os usuários
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getAll = function(application, req, res){
    var connection = new application.config.dbConnection();
    var UserDAO = new application.app.models.UserDAO(connection);
    UserDAO.getAll(res);
}

/**
 * Módulo responsável por deletar um usuario
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.delete = function(application, req, res){
    var connection = new application.config.dbConnection();
    var UserDAO = new application.app.models.UserDAO(connection);
    var _id = ObjectID(req.body._id);
    UserDAO.delete(_id,res);
}