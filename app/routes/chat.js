module.exports = function(application){
    application.get('/chat', function(req, res){
        application.app.controllers.chat.init(application,req,res);
    })

    application.post('/chat', function(req, res){
        application.app.controllers.chat.init(application,req,res);
    })
}