var ObjectID = require('mongodb').ObjectID;

/**
 * Método de login
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.login = function(application, req, res){
    var connection = new application.config.dbConnection();
    var UserDAO = new application.app.models.UserDAO(connection);
    var user = {
        'nickname' : req.body.login.toString().toLowerCase(),
        'password' : application.app.customs.encrypt.md5(req.body.password)
    }

    UserDAO.login(user,res);
}

/**
 * Método responsavel por buscar usuário pelo apelido
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getByName = function(application, req, res){
    var connection = new application.config.dbConnection();
    var UserDAO = new application.app.models.UserDAO(connection);
    var user = {
        'nickname' : req.body.nickname.toString().toLowerCase()
    }

    UserDAO.getByName(user,res);
}

/**
 * Módulo responsável por buscar todos os usuários
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.getAll = function(application, req, res){
    var connection = new application.config.dbConnection();
    var UserDAO = new application.app.models.UserDAO(connection);
    UserDAO.getAll(res);
}

/**
 * Módulo responsável por inserir um usuario
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.insert = function(application,req,res){
    var connection = new application.config.dbConnection();
    var UserDAO = new application.app.models.UserDAO(connection);

    var data = {
        'name' : req.body.name,
        'nickname': req.body.nickname.toString().toLowerCase(),
        'phone': req.body.phone,
        'password' : application.app.customs.encrypt.md5(req.body.password),
        'img' : '',
        'admin': 0
    };
    // console.log(data);
    UserDAO.insert(data,res);
}

/**
 * Módulo responsável por alterar dados do usuário
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.update = function(application,req,res){
    // console.log(req.body);
    var _id = req.body._id;
    if(!_id){
        res.send({'success' : false, 'msg' : 'Não é possível atualizar sem a referência!'});
    }
    else{
        _id = ObjectID(_id);
    }

    var connection = new application.config.dbConnection();
    var UserDAO = new application.app.models.UserDAO(connection);

    let data = {
        'name' : '',
        'nickname': '',
        'phone': '',
        'password' : ''
    };

    if(req.body.name != null && req.body.name != ''){
        data.name = req.body.name;
    }else{
        delete data.name;
    }
    
    if(req.body.nickname != null && req.body.nickname != '') {
        data.nickname = req.body.nickname.toString().toLowerCase();
    }else{
        delete data.nickname;
    }

    if(req.body.phone != null && req.body.phone != ''){
        data.phone = req.body.phone;
    }else{
        delete data.phone;
    }

    if(req.body.password != null && req.body.password != ''){
        data.password = application.app.customs.encrypt.md5(req.body.password);
    }else{
        delete data.password;
    }
        
    // console.log(data);
    UserDAO.update(_id,data,res);
}

/**
 * Módulo responsável por deletar um usuario
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.delete = function(application, req, res){
    var connection = new application.config.dbConnection();
    var UserDAO = new application.app.models.UserDAO(connection);
    var _id = ObjectID(req.body._id);
    UserDAO.delete(_id,res);
}

/**
 * Módulo responsável por tornar um usuário admin
 * @param {Instancia do Express} application 
 * @param {Dados da requisição} req 
 * @param {Dados para resposta} res
 * @author Iago Nuvem 
 */
module.exports.setAdmin = function(application, req, res){
    var connection = new application.config.dbConnection();
    var UserDAO = new application.app.models.UserDAO(connection);
    var _id = ObjectID(req.body._id);
    UserDAO.setAdmin(_id,req.body.type,res);
}