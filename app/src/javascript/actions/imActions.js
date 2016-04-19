/**
 * im actions
 * @version 1.0
 * @author hzzhuzhenyu(hzzhuzhenyu@corp.netease.com)
 * Created by hzzhuzhenyu on 2016/4/19.
 */


NEJ.define([
    'npm/redux/dist/redux.min',
    'pro/stores/appStore'
], function (redux,appStore) {
    var bindActionCreators = Redux.bindActionCreators,
        _actionCreators,store = appStore();

    _actionCreators = {
        showSearchFriends : function() {
            return {
                type : 'SHOW_ADD_FRIENDS'
            }
        },
        beginAddFriends : function() {
           return {
               type : 'BEGIN_ADD_FRIENDS'
           }
        },
        friendsAddDone : function(data) {
            return {
                type : 'ADD_FRIENDS_DONE',
                data : data
            }
        },
        addFirends : function(account,nimSdk) {
            console.log('account:',account);
            return function (dispatch) {
                dispatch(_actionCreators.beginAddFriends())
                return nimSdk.addFirends(account, function (data) {
                    dispatch(_actionCreators.friendsAddDone(data))
                });
            }
        }
    };

    return bindActionCreators(_actionCreators,store.dispatch);
});

