

NEJ.define([
    'regular!./search.html',
    '{pro}base/regular.js'
], function(_html, _r) {

    var Search = Regular.extend({
        template: _html,

        name: 'search'
    });

    return Search;

});