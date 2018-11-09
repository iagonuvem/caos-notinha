module.exports = function(application){
    var mod = '/notinhas/';

    application.get(mod+'getAll', function(req, res){
        application.app.controllers.notinha.getNotinhas(application,req,res);
    });

    application.post(mod+'getByOwner', function(req, res){
        application.app.controllers.notinha.getNotinhasByOwner(application,req,res);
    });

    application.post(mod+'getPayedByName', function(req, res){
        application.app.controllers.notinha.getNotinhasPayedByName(application,req,res);
    });

    application.post(mod+'getByParticipant', function(req, res){
        application.app.controllers.notinha.getNotinhasByParticipant(application,req,res);
    });

    application.post(mod+'getBalanceByName', function(req, res){
        application.app.controllers.notinha.getBalanceByName(application,req,res);
    });

    application.post(mod+'getBalanceMulti', function(req, res){
        application.app.controllers.notinha.getBalanceMulti(application,req,res);
    });

    application.post(mod+'insert', function(req, res){
        application.app.controllers.notinha.insertNotinha(application,req,res);
    });
}