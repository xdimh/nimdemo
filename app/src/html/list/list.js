
NEJ.define([
    'regular!./list.html',
    '{pro}base/regular.js',
    '{module}session/session.js',
    '{module}friends/friends.js'
], function(_html, _r, Session, Friends) {

    var List = Regular.extend({
        template: _html,

        name: 'list'
    });

    return List;
});