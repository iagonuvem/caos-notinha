module.exports = function(application){
    application.get('/getNotinhas', function(req, res){
        application.app.controllers.notinha.getNotinhas(application,req,res);
    });

    application.post('/getNotinhasByOwner', function(req, res){
        application.app.controllers.notinha.getNotinhasByOwner(application,req,res);
    });

    application.post('/getNotinhasPayedByName', function(req, res){
        application.app.controllers.notinha.getNotinhasPayedByName(application,req,res);
    });

    application.post('/getNotinhasByParticipant', function(req, res){
        application.app.controllers.notinha.getNotinhasByParticipant(application,req,res);
    });

    application.post('/getBalanceByName', function(req, res){
        application.app.controllers.notinha.getBalanceByName(application,req,res);
    });

    application.post('/getBalanceMulti', function(req, res){
        application.app.controllers.notinha.getBalanceMulti(application,req,res);
    });

    application.post('/insertNotinha', function(req, res){
        application.app.controllers.notinha.insertNotinha(application,req,res);
    });
}