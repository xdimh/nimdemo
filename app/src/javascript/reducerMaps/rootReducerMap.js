/**
 * 整个web im action处理汇总
 * @version 1.0
 * @author hzzhuzhenyu(hzzhuzhenyu@corp.netease.com)
 * Created by hzzhuzhenyu on 2016/4/19.
 */

NEJ.define([
    './meReducerMap.js',
    './listReducerMap.js',
    './chatReducerMap.js'
], function (meReducerMap,listReducerMap,chatReducerMap) {
    var _rootActionHandler = {
        /*复杂的action handler 可以统一放在这里然后被下面引用*/
    };

    var _rootReducerMap = {
        'SHOW_ADD_FRIENDS' : function(state,action) {
            state.search.status = 'show';
            return state;
        },
        'BEGIN_ADD_FRIENDS' : function(state,action) {
            console.log('begin add data');
        },
        'ADD_FRIENDS_DONE' : function(state,action) {
            console.log('friends add done');
            console.log(action.data);
        }
    };

    var _merge = function() {
      var result = arguments[0],
          leftObjects = Array.prototype.slice.call(arguments,1);
      for(var i = 0,len = leftObjects.length; i < len; i++) {
          NEJ.copy(result,leftObjects[i]);
      }
      return result;
    };

    return _merge({},meReducerMap,listReducerMap,chatReducerMap,_rootReducerMap);
});
