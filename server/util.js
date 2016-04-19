
'use strict';

const crypto = require('crypto')
let _ = module.exports;

_.random = function() {
    try {
        let buf = crypto.randomBytes(32);
        return buf.toString('hex');
    } catch(err) {
        throw err;
    }
}

_.timestamp = function() {
    return +new Date();
}

_.checkSum = function(appSecret, nonce, curTime) {
    let hash = crypto.createHash('sha1');
    hash.update(appSecret + nonce + curTime);
    return hash.digest('hex');
}