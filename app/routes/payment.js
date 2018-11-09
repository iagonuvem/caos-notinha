module.exports = function(application){
    application.get('/getAllPaymentsByPayerName', function(req, res){
        application.app.controllers.payment.getAllPaymentsByPayerName(application,req,res);
    });
}