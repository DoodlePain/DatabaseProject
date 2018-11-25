var express = require('express')
var app = express()
const bodyParser = require('body-parser')
var mysql = require('mysql')

var connection = mysql.createConnection({host: 'localhost', user: 'root', password: 'banana', database: 'Faceit'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/Server/query', (req, res) => {
    console.log("Query request from " + req.headers['x-forwarded-for']);
    connection
        .query('SELECT * FROM Server;', function (error, results, fields) {
            if (error) 
                throw error;
            res.json({response: results})
        });
})

app.get('/Server/count', (req, res) => {
    console.log("Query count request from " + req.headers['x-forwarded-for']);
    connection
        .query('SELECT COUNT(ip) AS length FROM Server;', function (error, results, fields) {
            if (error) 
                throw error;
            res.json({response: results})
        });
})

app.get('/Server/countServerByLocation', (req, res) => {
    console.log("Query count server by location from " + req.headers['x-forwarded-for']);
    connection
        .query('SELECT COUNT(ip) AS Number, locazione FROM `Server` GROUP BY locazione;', function (error, results, fields) {
            if (error) 
                throw error;
            res.json({response: results})
        });
})

app.get('/Server/deleteServer', (req, res) => {
    console.log("Delete Server table data request");
    connection
        .query('DELETE FROM `Server` WHERE tick=128;', function (error, results, fields) {
            if (error) 
                throw error;
            console.log('The solution is: ', results);
            res.json({response: results})
        });
})

app.post('/Server/insert', (req, res) => {
    console.log("Random data insert into Server table request");
    var query1 = "INSERT INTO Server (ip,locazione,porta,tick) VALUES  ('"+req.body.ip+"','"+req.body.locazione+"',"+req.body.porta+","+req.body.tick+")"
    connection
        .query(query1, function (error, results, fields) {
            if (error) 
                throw error;
        })
    res.json({note: "Recorded"})
})

app.post('/Utente/insert', (req, res) => {
    let resp = 0 
    connection.query("select COUNT(*) FROM `Utente` WHERE `FK_Statistiche` = "+req.body.FK_Statistiche, (error, result,fields) =>{
        resp = parseInt(JSON.stringify(result).slice(13,14))
        console.log(resp);
        if(resp===0){
            console.log("Adding " +req.body.username);
            var query1 = 'INSERT INTO Utente (username,email,lingua,nome,sesso,data_di_nascita,indirizzo,tfa,steamid,FK_Statistiche) VALUES ("'+req.body.username+'","'+req.body.email+'","'+req.body.lingua+'","'+req.body.nome+'","'+req.body.sesso+'","'+req.body.data_di_nascita+'","'+req.body.indirizzo+'",'+req.body.tfa+',"'+req.body.steamid+'",'+req.body.FK_Statistiche+');'
            connection
            .query(query1, function (error, results, fields) {
                if (error) 
                throw error;
            })
        } else if(resp >0) {
            console.log("Skipped " +req.body.username);
        }
    })
    
    res.json({note: "Recorded"})
})


app.post('/testquery', (req,res)=>{
    let querytext = req.body.test
    console.log(querytext);
    
    connection.query(querytext, (err,result,fields)=>{
        res.json({result})
    })
})

app.post('/Statistiche/insert', (req, res) => {
    console.log("Random data insert into Server table request");
    var query1 = "insert into Statistiche (elo,livello,lega,class_nazionale,class_continentale,partite_giocate,partite_vinte,partite_perse,winrate) VALUES ('"+req.body.elo+"',"+req.body.livello+",'"+req.body.lega +"',"+req.body.class_nazionale +","+req.body.class_continentale +","+req.body.partite_giocate +","+req.body.partite_vinte +","+req.body.partite_perse +","+req.body.winrate+")"
    connection
        .query(query1, function (error, results, fields) {
            if (error) 
                throw error;
        }) 
    res.json({note: "Recorded"})
})

app.post('/Sponsor/insert', (req, res) => {
    console.log("Random data insert into Sponsor table request");
    var query1 = "insert into Sponsor (nome,nazione,ambito,societa) VALUES ('"+req.body.nome+"','"+req.body.nazione +"','"+req.body.ambito +"','"+req.body.societa +"')"
    connection
        .query(query1, function (error, results, fields) {
            if (error) 
                throw error;
        }) 
    res.json({note: "Recorded"})
})

app.post('/Statistiche/getId', (req,res) => {
    var query = "select id_stat from Statistiche;"
    var queryResult = {}
    connection
        .query(query, (error, result,fields) => {
            setValue(result)
            res.json({
                result
            })
        }
    )
    function setValue(value) {
        queryResult = value;
    }

    
})

// app.post('/Server/insert', (req, res) => {
//     console.log("Random data insert into Server table request");
//     var query1 = "INSERT INTO Server (ip,locazione,porta,tick) VALUES ('"+req.body.ip+"','"+req.body.locazione+"',"+req.body.porta+","+req.body.tick+")"
//     connection
//         .query(query1, function (error, results, fields) {
//             if (error) 
//                 throw error;
//         })
//     res.json({note: "Recorded"})
// })

app.listen(3001, () => {
    console.log('Listening on http://localhost:3001 ...');
})
 