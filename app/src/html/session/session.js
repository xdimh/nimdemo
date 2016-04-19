

NEJ.define([
    'regular!./session.html',
    '{pro}base/regular.js'
], function(_html, _r) {

    var Session = Regular.extend({
        template: _html,

        name: 'session'
    });

    return Session;
});