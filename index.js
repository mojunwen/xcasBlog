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

    var sqlStr = "SELECT reprintedarticle.*,users.name,reprintedcategory.categoryWord,reprintedcategory.categoryName,reprintedcategory.categoryWord,state.stateName \
                    FROM reprintedarticle \
                    inner JOIN users \
                    ON users.id = reprintedarticle.userId\
                    INNER JOIN reprintedcategory \
                    on reprintedarticle.categoryId = reprintedcategory.id\
                    INNER JOIN state \
                    on reprintedarticle.stateId = state.id\
                    order by reprintedarticle.id \
                    LIMIT " + num + ',' + parseInt(req.body.pageSize);

    var sqlCountStr = "SELECT COUNT(0) FROM reprintedarticle \
                        inner JOIN users \
                        ON users.id = reprintedarticle.userId\
                        INNER JOIN reprintedcategory \
                        on reprintedarticle.categoryId = reprintedcategory.id"
    var obj = {}

    obj.pageNum = req.body.pageNum;
    obj.pageSize = req.body.pageSize;

    // 请求 总页数
    queryCount(sqlCountStr,req, obj);
    // 分页请求文章
    queryBypage(sqlStr, req, res, obj);
});

function queryCount(str, req, obj){
    var connection = mysql.createConnection(connectConfig);
    connection.connect();
    connection.query(str, function(err, rows, fields) {
        if (err) {
            console.log(err);
        };
        if(rows === []){
            return console.log('没有数据');
        }
        obj.pageCount = Math.ceil(rows[0]['COUNT(0)'] / req.body.pageSize) ;
       
    });
     //关闭连接
    connection.end();
}
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

// 上传文章
app.post('/reprintArticle/addArticle.node', function(req, res){
    var obj = req.body;
    
    addArticle(obj,res);
});

function addArticle(obj, res){
    var arr1 = [];
    var arr2 = [];

    for(var i in obj) {
        arr1.push(i);
        arr2.push("'" + obj[i] + "'");
    }

    var str_add = "INSERT INTO reprintedarticle (" + arr1.join(',') +")\
                    VALUES (" + arr2.join(',') + ")";
    
    var connection = mysql.createConnection(connectConfig);

    connection.connect();
    //查询
    connection.query(str_add,[] , function(err, result) {
        if (err) {
            console.log(err);
            res.send('err');
        };
        
    });
    res.send('success');
     //关闭连接
    connection.end();
}

app.listen(3000, function(){
    console.log('your blog ruuning at 3000');
});