module.exports = function(application){
    var mod = '/statements/';

    application.get(mod+'getAll', function(req, res){
        application.app.controllers.statement.getAllStatements(application,req,res);
    });

    application.get(mod+'getCurrent', function(req, res){
        application.app.controllers.statement.getCurrentStatement(application,req,res);
    });

    application.post(mod+'insert', function(req, res){
        application.app.controllers.statement.insertStatement(application,req,res);
    });
}