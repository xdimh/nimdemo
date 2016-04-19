
NEJ.define([
    'regular!./card.html',
    '{pro}base/regular.js'
], function(_html, _r) {

    var Card = Regular.extend({
        template: _html,

        name: 'card'
    });

    return Card;

});