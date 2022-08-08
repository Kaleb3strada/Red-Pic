const express=require('express');
const cors=require('cors');
const jwt=require('jsonwebtoken');
const db=require('./database');
const crypto=require('crypto');
const database=db.conexion;
const redpic=express();

redpic.set('view engine','ejs');
redpic.use(express.json());
redpic.use(cors());

redpic.use(express.static('public'));

redpic.get('/',(req,res)=>{
    res.render('pages/index');
});
redpic.get('/register',(req,res)=>{
    res.render('pages/register');
});
redpic.get('/login',(req,res)=>{
    res.render('pages/login');
});

redpic.post('/login', (req, res) => {
     const reqData = {}; 
     var login = req.body.login;
    var passwd = req.body.password;
    database.query('select * from usuarios where login=? and password=sha1(?)', [login, passwd], (err, rows, fields) => { 
        if (!err) {
            const hash = crypto.createHash('sha1').update(passwd).digest('hex'); 
            if (rows.length == 1 && rows[0].login == login && rows[0].password == hash) { 
                const user = rows[0]; 
                jwt.sign({ user: user }, 'accessKey', { expiresIn: '10m' }, (err, token) => { 
                    res.json({ token: token })
                 }) 
                } else { 
                    res.sendStatus(403);
                 } } else { 
                    res.sendStatus(503); 
                } 
            }); 
        })
function verifyToken(req, res, next){
    const bearerHeader=req.headers['authorization'];
    if(typeof bearerHeader!=='undefined'){
        const bearerToken=bearerHeader.split(" ")[1];
        req.token=bearerToken;
        console.log(bearerToken);
        next();
    }
    else{
        res.sendStatus(403);
    }
}
redpic.post('/auth',(req,res)=>{
    var token=req.body.token;
    try{
        var decoded=jwt.verify(token, 'accessKey');
        jwt.verify(token, 'accessKey', (err, authData)=>{
            if(err){
                res.sendStatus(403);
            }
            else{
                res.sendStatus(200);
            }
        });
    }catch(error){
        res.sendStatus(500);
    }
});
redpic.post("/nuevoUser", (req, res) => {
    var Email = req.body.email;
    var User = req.body.login;
    var Password = req.body.password;
    var resultado = {};

    database.query("insert into usuarios(login,password,email) values(?,sha1(?),?);", [User, Password, Email], (error, rows, fields) => {
        if (error) {
            resultado.estado = false;
            resultado.mensaje = error;
            res.json(resultado);
        } else {
            resultado.estatus = true;
            resultado.mensaje = "Registro exitoso";
            console.log(resultado);
            resultado.filas = rows.affectedRows;
            res.json(resultado);
        }
    });
});

redpic.listen(process.env.PORT || 8080);
console.log("Estoy corriendo en el puerto 8080");