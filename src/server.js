var express = require('express')
var app = express()
const bodyParser = require('body-parser')
var mysql = require('mysql')

var connection = mysql.createConnection({host: 'localhost', user: 'root', password: '****', database: 'Faceit'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/query', (req, res) => {
    connection
        .query('SELECT * FROM Server;', function (error, results, fields) {
            if (error) 
                throw error;
            console.log('The solution is: ', results);
            res.json({response: results})
        });
})

app.get('/deleteServer', (req, res) => {
    connection
        .query('DELETE FROM `Server` WHERE tick=128;', function (error, results, fields) {
            if (error) 
                throw error;
            console.log('The solution is: ', results);
            res.json({response: results})
        });
})

app.post('/insert', (req, res) => {
    var query1 = "INSERT INTO Server (ip,locazione,porta,tick) VALUES ('"+req.body.ip+"','"+req.body.locazione+"',"+req.body.porta+","+req.body.tick+")"
    connection
        .query(query1, function (error, results, fields) {
            if (error) 
                throw error;
        })
    res.json({note: "Recorded"})
})

app.listen(3001, () => {
    console.log('Listening on http://localhost:3001 ...');
})
 