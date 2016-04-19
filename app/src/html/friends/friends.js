
NEJ.define([
    'regular!./friends.html',
    '{pro}base/regular.js'
], function(_html, _r) {

    var Friends = Regular.extend({
        template: _html,

        name: 'friends'
    });

    return Friends;
});