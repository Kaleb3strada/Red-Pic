// const mysql=require('mysql2');
// const conexion=mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Calebs-12',
//     database: 'aweb',
//     port: 3307
// });
const mysql=require('mysql2');
const conexion=mysql.createConnection({
    host: 'bsnvvzziwnldvbzbq92z-mysql.services.clever-cloud.com',
    user: 'uh4edj3rka2yx5x9',
    password: 'odB45nbpAVjHCGr0Tz2a',
    database: 'bsnvvzziwnldvbzbq92z',
    port: 3306
});
conexion.connect((err)=>{
    if(err){
        console.log("chales no se conecto esta madre");
        console.log(err);
    }
    else{
        console.log("epsitoso");
    }
});
exports.conexion=conexion;