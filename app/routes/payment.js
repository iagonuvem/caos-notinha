module.exports = function(application){
    var mod = '/payments/'

    application.post(mod+'getAllByPayerName', function(req, res){
        application.app.controllers.payment.getAllPaymentsByPayerName(application,req,res);
    });

    application.post(mod+'getAllByReceiverName', function(req, res){
        application.app.controllers.payment.getAllPaymentsByReceiverName(application,req,res);
    });

    application.post(mod+'getAllByStatement', function(req, res){
        application.app.controllers.payment.getAllByStatement(application,req,res);
    });

    application.post(mod+'check', function(req, res){
        application.app.controllers.payment.checkPayment(application,req,res);
    });
}