module.exports.init = function(application, req, res){
    var dadosForm = req.body;

    req.assert('apelido', 'Apelido nao pode ser vazio').notEmpty();
    req.assert('apelido', 'Apelido deve conter de 3 a 15 caracteres').len(3,15);

    var erros = req.validationErrors();

    if(erros){
        res.render('index', {validacao: erros});
        return;
    }
    
    // Enviando para o websocket
    application.get('io').emit(
        'msgUserIn',
        {
            apelido: dadosForm.apelido,
            msg: ' Acabou de entrar no chat!'
        }
    );

    res.render('chat' , {dados: dadosForm});
}