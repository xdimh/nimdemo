/**
 * 个人名片action处理
 * @version 1.0
 * @author hzzhuzhenyu(hzzhuzhenyu@corp.netease.com)
 * Created by hzzhuzhenyu on 2016/4/19.
 */


NEJ.define(function () {
    var _meActionHandlers = {

    };

    return {
        'SHOW_SELF' : function(state,action) {
            state.selfProfile.card.isShow = !state.selfProfile.card.isShow;
            return state;
        }
    }
});
