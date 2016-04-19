
NEJ.define([
    '{module}im/im.js',
    'pro/stores/appStore'
], function(IM,appStroe) {
    var store = appStroe();

    var im = new IM({
        data : store.getState()
    });

    store.subscribe(function () {
        var state = store.getState();
        im.data = state;
        im.$update();
    });

    im.$inject('#app');
});