var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = new express();

var connectConfig = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'webapp'
}

app.use(express.static('webapp'));

app.use(bodyParser.json());// for parsing application/json

app.post('/reprintArticle/queryByPage.node', function(req, res){
    console.log('get req data :')
    console.log(req.body);

    var num = (parseInt(req.body.pageNum) - 1) * parseInt(req.body.pageSize);
    var str = 'SELECT * FROM reprintedarticle LIMIT ' + num + ',' + parseInt(req.body.pageSize);
    queryBypage(str, req, res);
});

function queryBypage(str,req,res){
    var connection = mysql.createConnection(connectConfig);

    connection.connect();
    //查询
    connection.query(str, function(err, rows, fields) {
        if (err) {
            console.log(err);
        };
        if(rows === []){
            return console.log('没有数据');
        }
        res.send(rows);
       
    });
     //关闭连接
    connection.end();

}

app.listen(3000, function(){
    console.log('your blog ruuning at 3000');
});