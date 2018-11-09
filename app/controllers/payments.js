/**
 * Módulo responsável por buscar todos os pagamentos de um usuario, ordenados por data
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getAllPaymentsByPayerName = function(application, req, res){
    var connection = new application.config.dbConnection();
    var PaymentDAO = new application.app.models.PaymentDAO(connection);
    var user = req.body.user.toString().toLowerCase();
    PaymentDAO.getAllPaymentsByPayerName(user, res);
}