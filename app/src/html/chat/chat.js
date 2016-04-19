
NEJ.define([
    'regular!./chat.html',
    '{pro}base/regular.js',
    '{module}chatTool/chatTool.js'
], function(_html, _r, ChatTool) {

    var Chatbox = Regular.extend({
        template: _html,

        name: 'chat-box'
    });

    return Chatbox;

});