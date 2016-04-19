
NEJ.define([
    'regular!./me.html',
    '{pro}base/regular.js',
    '{module}card/card.js',
    'pro/actions/meActions'
], function(_html, _r, Card,meActions) {
    var Me = Regular.extend({
        template: _html,
        name: 'me',
        onAvatarClick : function() {
            //dispatch  action to show self card
            meActions.showSelf();
        }
    });

    return Me;
});