
NEJ.define([
    'util/chain/chainable',
    'util/ajax/rest',
    'util/cache/cookie'
], function($, _j, _ck) {

    var laccount = $('#lg .j-account'),
        lpassword = $('#lg .j-password'),
        login = $('#lg .j-login'),
        lsw = $('#lg .j-switch');

    var raccount = $('#rg .j-account'),
        rnickname = $('#rg .j-nickname'),
        rpassword = $('#rg .j-password'),
        register = $('#rg .j-register'),
        rsw = $('#rg .j-switch');

    login._$on('click', function() {
        _ck._$cookie('accid', laccount[0].value);
        _ck._$cookie('token', lpassword[0].value);
        window.location.href = '/template/';
    });

    register._$on('click', function() {
        var accid = raccount[0].value;
        var token = rpassword[0].value;
        var nickname = rnickname[0].value;
        _j._$request('/api/user/add', {
            type: 'json',
            method: 'POST',
            data: {
                accid: accid,
                token: token,
                name: nickname
            },
            onload: function(_data) {
                _data = JSON.parse(_data);
                if(_data.code == 200) {
                    _ck._$cookie('accid', _data.info.accid);
                    _ck._$cookie('token', _data.info.token);
                    window.location.href = '/template/';
                } 
            },
            onerror: function() {

            }
        })
    });

    lsw._$on('click', function() {
        $('#lg')._$addClassName('f-dn');
        $('#rg')._$delClassName('f-dn');
    });

    rsw._$on('click', function() {
        $('#rg')._$addClassName('f-dn');
        $('#lg')._$delClassName('f-dn');
    });
});