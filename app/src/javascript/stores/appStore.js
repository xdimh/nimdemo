/**
 * 整个应用状态容器
 * @version 1.0
 * @author hzzhuzhenyu(hzzhuzhenyu@corp.netease.com)
 * Created by hzzhuzhenyu on 2016/4/19.
 */

NEJ.define([
    'npm/redux/dist/redux.min',
    'npm/redux-thunk/dist/redux-thunk',
    'pro/reducers/reducers'
],function(redux,reduxThunk,rootReducer){

    function thunkMiddleware(_ref) {
        var dispatch = _ref.dispatch;
        var getState = _ref.getState;

        return function (next) {
            return function (action) {
                if (typeof action === 'function') {
                    return action(dispatch, getState);
                }

                return next(action);
            };
        };
    };

    return function appStore(initialState) {
        return Redux.createStore(rootReducer,initialState,Redux.applyMiddleware(thunkMiddleware));
    };
});
