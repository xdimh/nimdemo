

NEJ.define([
    'regular!./im.html',
    '{pro}base/regular.js',
    '{pro}base/const.js',
    '{pro}base/nim.js',
    '{module}me/me.js',
    '{module}list/list.js',
    '{module}chat/chat.js',
    '{module}search/search.js',
    'pro/actions/imActions'
], function(_html, _r, _c, NimSDK, Me, List, Chatbox, Search,imActions) {

    var IM = Regular.extend({
        template: _html,

        name: 'IM',

        init: function() {
            var _this = this;
            this.nimsdk = new NimSDK(this);
        },


        //data : store.getState(),

        //data: {
        //    type: '',          // 右侧面板显示
        //    selfProfile: {
        //            account: '',
        //            nick: '',
        //            avatarUrl: '',
        //            gender: '',
        //            addr: '',
        //            remark: '',
        //            card: {
        //                isShow: false,
        //                size: 220,
        //                type: 'self'
        //            }
        //    },
        //    list: {
        //        old: [],
        //        index: 1,
        //        sessions: [],
        //        fs: []
        //    },
        //    chat: {
        //        to: {},
        //        msgs: []
        //    },
        //    search: {
        //        status: 'hide',
        //        scon: ''
        //    }
        //},

        //显示自己的名片
        showSelf: function() {
            this.data.selfProfile.card.isShow = !this.data.selfProfile.card.isShow;
            this.$update();
        },
        // 显示给自己发消息的面板
        showSendSelf: function() {
            console.log('send self')
        },
        // 显示给好友发消息面板
        showSendFriends: function($event)  {
            console.log($event)
            this.data.type = 'chat';
            this.data.chat.to.account = $event.account;
            this.data.chat.to.nick = $event.nick;
            this.data.chat.to.avatar = $event.avatar || _c.defaultAvatar;
            this.$update();
        },
        sendMsg: function($event) {
            var _this = this;
            var toAccount = this.data.chat.to.account;
            this.nimsdk.sendTextMsg('p2p', toAccount, $event, function() {
                _this.data.chat.msgs.push({
                    user: 'me',
                    content: $event
                });
                _this.$update();
            });
        },
        showSearch: function() {
            imActions.showSearchFriends();
        },
        addFriend: function() {
            imActions.addFirends(this.data.search.scon,this.nimsdk);
        }
    });

    return IM;

});