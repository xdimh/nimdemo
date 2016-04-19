
'use strict';

const request = require('request');
const config = require('./config.js');
const _ = require('./util.js');

function createHeader() {
    let n = _.random();
    let t = _.timestamp();
    return {
        AppKey: config.AppKey,
        Nonce: n,
        CurTime: t,
        CheckSum: _.checkSum(config.AppSecret, n, t),
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
}

function handleNim(url, params, success, fail) {
    let options = {
        url: url,
        method: 'POST',
        headers: createHeader(),
        form: params
    }
    request(options, function(err, res, body) {
        if(err) {
            fail(err);
            return;
        }
        success(body);
    });
}

module.exports = handleNim;