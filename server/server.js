
'use strict';

const path = require('path');
const nim = require('./nim.js');
const express = require('express');
let app = express();

// express server setting
const EXPRESS_ROOT = path.join(__dirname, '../app');
const EXPRESS_PORT = 9000;

function startExpress() {
    let bodyParser = require('body-parser');
    app.use(express.static(EXPRESS_ROOT));
    app.use(express.static(path.join(__dirname, '../')));
    app.use(bodyParser.json());                         // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    // 注册一个云信ID
    app.post('/api/user/add', function(req, res) {
        nim('https://api.netease.im/nimserver/user/create.action', req.body, function(data) {
            res.json(data);
        }, function(err) {
            res.json({ code: 500, info: 'server error!' });
        });
    });

    let server = app.listen(EXPRESS_PORT, function() {
        let host = server.address().address;
        let port = server.address().port;
        console.log('server listening at http://%s:%s', host, port)
    });
}

startExpress();