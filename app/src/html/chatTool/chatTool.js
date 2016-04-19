
NEJ.define([
    'regular!./chatTool.html',
    '{pro}base/regular.js'
], function(_html, _r, ChatTool) {

    var ChatTool = Regular.extend({
        template: _html,

        name: 'chat-tool',

        send: function() {
            var con = this.$refs.editor.innerHTML;
            this.$refs.editor.innerHTML = '';
            this.$emit('sendmsg', con);
        }
    });

    return ChatTool;

});