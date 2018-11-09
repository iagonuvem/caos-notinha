module.exports = function(application){
    var mod = '/payments/'

    application.post(mod+'getAllByPayerName', function(req, res){
        application.app.controllers.payment.getAllByPayerName(application,req,res);
    });

    application.post(mod+'getAllByReceiverName', function(req, res){
        application.app.controllers.payment.getAllByReceiverName(application,req,res);
    });

    application.post(mod+'getAllByStatement', function(req, res){
        application.app.controllers.payment.getAllByStatement(application,req,res);
    });

    application.post(mod+'insert', function(req, res){
        application.app.controllers.payment.insert(application,req,res);
    });

    application.post(mod+'check', function(req, res){
        application.app.controllers.payment.check(application,req,res);
    });
}