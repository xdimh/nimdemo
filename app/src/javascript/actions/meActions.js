/**
 * 个人面板actions
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
        showSelf : function() {
            return {
                type : 'SHOW_SELF'
            }
        }
    };

    return bindActionCreators(_actionCreators,store.dispatch);

});

