var express = require('express');

var app = new express();

app.use(express.static('webapp'));

app.listen(3000, function(){
    console.log('your blog ruuning at 3000');
});