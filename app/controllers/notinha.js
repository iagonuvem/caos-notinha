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
 * Módulo responsável por buscar todas as notinhas pertencentes a determinado usuario
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getNotinhasByOwner = function(application, req, res){
    var connection = new application.config.dbConnection();
    var NotinhaDAO = new application.app.models.NotinhaDAO(connection);
    NotinhaDAO.getNotinhasByOwner("bitoca", res);
}

/**
 * Módulo responsável por calcular o saldo devedor de um usuario
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getSaldoByName = function(application, req, res){
    var connection = new application.config.dbConnection();
    var NotinhaDAO = new application.app.models.NotinhaDAO(connection);
    var dados = NotinhaDAO.getNotinhasByOwner("bitoca", res);

}