/**
 * 所有处理state逻辑汇总
 * @version 1.0
 * @author hzzhuzhenyu(hzzhuzhenyu@corp.netease.com)
 * Created by hzzhuzhenyu on 2016/4/19.
 */

NEJ.define([
    'pro/reducerMaps/rootReducerMap'
], function (rootReducerMap) {
    var initialState = {
        type: '',          // 右侧面板显示
        selfProfile: {
            account: '',
            nick: '',
            avatarUrl: '',
            gender: '',
            addr: '',
            remark: '',
            card: {
                isShow: false,
                size: 220,
                type: 'self'
            }
        },
        list: {
            old: [],
            index: 1,
            sessions: [],
            fs: []
        },
        chat: {
            to: {},
            msgs: []
        },
        search: {
            status: 'hide',
            scon: ''
        }
    };
    return function rootReducer(state, action) {
        state = state || initialState;
        if(!!rootReducerMap[action.type]) {
            return rootReducerMap[action.type](state,action);
        } else {
            return state;
        }
    }
});
