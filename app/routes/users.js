module.exports = function(application){
    var mod = '/users/';

    application.get(mod+'getAll', function(req, res){
        application.app.controllers.user.getAll(application,req,res);
    })

    application.post(mod+'delete', function(req, res){
        application.app.controllers.user.delete(application,req,res)
    })

    application.post(mod+'update', function(req, res){
        application.app.controllers.user.update(application,req,res)
    })
}