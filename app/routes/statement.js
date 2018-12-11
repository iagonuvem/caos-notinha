module.exports = function(application){
    var mod = '/statements/';

    application.get(mod+'getAll', function(req, res){
        application.app.controllers.statement.getAllStatements(application,req,res);
    });

    application.get(mod+'getCurrent', function(req, res){
        application.app.controllers.statement.getCurrentStatement(application,req,res);
    });

    application.post(mod+'getBalanceById', function(req,res){
        application.app.controllers.statement.getBalanceById(application,req,res);
    })

    application.post(mod+'getBalanceByUserStatement', function(req,res){
        application.app.controllers.statement.getBalanceByUserStatement(application,req,res);
    })

    application.post(mod+'getBalanceByUser', function(req,res){
        application.app.controllers.statement.getBalanceByUser(application,req,res);
    })

    application.post(mod+'insert', function(req, res){
        application.app.controllers.statement.insertStatement(application,req,res);
    });
}