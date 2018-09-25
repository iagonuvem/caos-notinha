module.exports = function(application){
    application.get('/getNotinhas', function(req, res){
        application.app.controllers.notinha.getNotinhas(application,req,res);
    });

    application.get('/getNotinhasByOwner', function(req, res){
        application.app.controllers.notinha.getNotinhasByOwner(application,req,res);
    });
}