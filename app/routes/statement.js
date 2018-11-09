module.exports = function(application){
    application.get('/getAllStatements', function(req, res){
        application.app.controllers.statement.getAllStatements(application,req,res);
    });

    application.get('/getCurrentStatement', function(req, res){
        application.app.controllers.statement.getCurrentStatement(application,req,res);
    });

    application.post('/addStatement', function(req, res){
        application.app.controllers.statement.addStatement(application,req,res);
    });
}