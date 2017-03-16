var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var nodemailer = require('nodemailer');

var app = new express();

// mysql 链接参数
var connectConfig = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'webapp'
}
var str_liancha = "SELECT * FROM reprintedarticle \
INNER JOIN reprintedcategory \
ON reprintedarticle.categoryId = reprintedcategory.id \
WHERE reprintedarticle.categoryId = 1  \
AND reprintedarticle.title LIKE '__1%'\
"
var str_edit = "UPDATE users SET name = 'kljlkjlkjlkjlk' ,`password`='12321132134534654'";

var str_add = "INSERT INTO users (name, password) VALUES ('likun', '123456')"
app.use(express.static('webapp'));

app.use(bodyParser.json());// for parsing application/json

app.post('/reprintArticle/queryByPage.node', function(req, res){

    var num = (parseInt(req.body.pageNum) - 1) * parseInt(req.body.pageSize);
    var str = 'SELECT * FROM reprintedarticle LIMIT ' + num + ',' + parseInt(req.body.pageSize);
    var obj = {}

    obj.pageNum = num;
    obj.pageSize = req.body.pageSize;

    queryBypage(str, req, res, obj);
});

function queryBypage(str,req,res, obj){
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
        obj.list = rows
        res.send(obj);
       
    });
     //关闭连接
    connection.end();

}

// 发送邮件
app.post('/reprintArticle/sendEmail.node', function(req, res){
    var obj = req.body;
    sendEmail(obj,res);
});

function sendEmail(obj,res) 
{
    // 邮件发送默认值
    var transporter = nodemailer.createTransport({
        service: 'qq',
        auth: {
            user: '1628242411@qq.com',
            pass: 'vzchlyomduqnbhfb',
        }
    });
    var mailOptions = {  
        from: '1628242411@qq.com', // 发送者  
        to: '1628242411@qq.com', // 接受者,可以同时发送多个,以逗号隔开  
        subject: obj.text, // 标题  
        //text: 'Hello world', // 文本  
        html: obj.contentHtml   
    };

    transporter.sendMail(mailOptions, function (err, info) {  
        if (err) {  
            console.log(err);  
            return;  
        }  
        res.send('success');

        console.log('发送成功');  
    });  
}

app.listen(3000, function(){
    console.log('your blog ruuning at 3000');
});