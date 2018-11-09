module.exports = function(application){

    application.post('/getAllPaymentsByPayerName', function(req, res){
        application.app.controllers.payment.getAllPaymentsByPayerName(application,req,res);
    });

    application.post('/getAllPaymentsByReceiverName', function(req, res){
        application.app.controllers.payment.getAllPaymentsByReceiverName(application,req,res);
    });

    application.post('/getAllByStatement', function(req, res){
        application.app.controllers.payment.getAllByStatement(application,req,res);
    });

    application.post('/checkPayment', function(req, res){
        application.app.controllers.payment.checkPayment(application,req,res);
    });
}