module.exports = function(application){
    var mod = '/users/';

    application.post(mod+'getByName',function(req,res){
        application.app.controllers.user.getByName(application,req,res);
    })

    application.get(mod+'getAll', function(req, res){
        application.app.controllers.user.getAll(application,req,res);
    })

    application.post(mod+'login', function(req, res){
        application.app.controllers.user.login(application,req,res);
    })

    application.post(mod+'delete', function(req, res){
        application.app.controllers.user.delete(application,req,res)
    })

    application.post(mod+'insert', function(req, res){
        application.app.controllers.user.insert(application,req,res)
    })

    application.post(mod+'update', function(req, res){
        application.app.controllers.user.update(application,req,res)
    })

    application.post(mod+'setAdmin', function(req, res){
        application.app.controllers.user.setAdmin(application,req,res)
    })
}