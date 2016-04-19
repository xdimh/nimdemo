
NEJ.define([
    'base/klass',
    'util/cache/cookie',
    '{pro}base/const.js'
], function(_k, _ck, _c) {

    var map = {
        PC: '电脑版',
        Web: '网页版',
        Android: '手机版',
        iOS: '手机版',
        WindowsPhone: '手机版'
    }

    var NimSDK = _k._$klass();
    var pro = NimSDK.prototype;

    pro.__init = function(app) {
        var accid = _ck._$cookie('accid');
        var token = _ck._$cookie('token');
        if(!token) {
            window.location.href = '/template/login.html';
            return;
        }

        this.app = app;
        this.sysMsgDone = false;
        this.teamMemberDone = false;
        this._initNimSDK(accid, token);
    }

    pro._initNimSDK = function(accid, token) {
        this.sdk = new NIM({
            debug: false,
            appKey: _c.appkey,
            account: accid,
            token: token,

            // 连接
            onconnect: function() { console.log('connect success!') },
            ondisconnect: onDisconnect,
            onerror: function(err) { console.log('error: ' + err) },
            onwillreconnect: onWillReconnect,

            // 个人信息
            onmyinfo: onMyInfo._$bind(this),
            onupdatemyinfo: onMyInfo._$bind(this),

            // 好友
            onusers: onUsers._$bind(this),
            onupdateuser: onUpdateUsers._$bind(this),

            // 会话
            onsessions: onSessions._$bind(this),
            onupdatesession: onSessions._$bind(this),

            // 同步完成
            //onsyncteammembersdone: onSyncTeamMembersDone._$bind(this),
            onsyncdone: onSyncDone._$bind(this),

            // 系统通知
            onsysmsg: onSysMsg._$bind(this),

            // 消息
            onmsg: onMsg._$bind(this)
        });

        function onDisconnect(err) {
            console.log('连接断开')
            if(err) {
                switch(err.code) {
                    case 302:
                        alert(err.message)
                        break;
                    case 'kicked':
                        var str = err.from;
                        alert('你的账号被' + (map[str] || '其他端') + '踢出下线.')
                        break;
                }
                _ck._$cookie('accid', '');
                _ck._$cookie('token', '');
                window.location.href = '/template/login.html';
            }
        }

        // 此时说明 `SDK` 已经断开连接
        // 需界面上提示用户连接已断开，而且正在重新建立连接
        function onWillReconnect() {

        }

        function onMyInfo(data) {
            var profile = this.app.data.selfProfile;
            profile.account = data.account;
            profile.nick = data.nick;
            profile.avatarUrl = data.avatar || _c.defaultAvatar;
            profile.gender = data.gender === 'unknown' ? '' : data.gender;
            profile.addr = data.addr || '';
            profile.remark = data.remark || '他很懒, 什么也没有留下';
        }

        function onUsers(users) {
            console.log(users)
            for(var i = 0; i < users.length; i++) {
                if(!users[i].avatar) users[i].avatar = _c.defaultAvatar;
            }
            this.app.data.list.fs = users;
        }
        function onUpdateUsers(users) {
            console.log(users)
            for(var i = 0; i < users.length; i++) {
                if(!users[i].avatar) users[i].avatar = _c.defaultAvatar;
            }
            this.app.data.list.fs = this.sdk.mergeUsers(this.app.data.list.fs, users);
        }

        function onSysMsg(msg) {
            if(msg.type === 'addFriend') {

            }
        }

        function onMsg(msg) {
            console.log(msg)
            this.app.data.chat.msgs.push({
                user: 'other',
                content: msg.text
            });
            this.app.$update();
        }

        function onSessions(sessions) {
            console.log(sessions)
            if(this.app.data.list.old) {
                this.app.data.list.old = this.sdk.mergeSessions(this.app.data.list.old, sessions)
            }
            this.app.data.list.sessions = [];
            for(var i = 0; i < this.app.data.list.old.length; i++) {
                var s = this.app.data.list.old[i];
                this.app.data.list.sessions.push({
                    scene: s.scene,
                    account: s.to,
                    nick: s.lastMsg.target,
                    lastmsg: s.lastMsg.text
                });
            }
            this.app.$update();
        }

        function onSyncDone() {
            this.sysMsgDone = true;
            this.app.$update();
        }
    }   

    pro.sendTextMsg = function(scene, to, text, callback) {
        this.sdk.sendText({
            scene: scene || 'p2p',
            to: to,
            text: text,
            done: callback
        });
    }

    pro.addFriend = function(account, callback) {
        this.sdk.addFriend({
            account: account,
            done: callback
        });
    }

    pro.add

    return NimSDK;
});