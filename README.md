
## redux + regularjs Web-IM 基础架构说明


最近组里有一个Web-IM的项目，在调研项目架构方案的过程中看到蘑菇街的一篇文章[Web-IM前端解决方案](http://mogu.io/web-im-fe-solution-13),给了一定的启发，整个Web-IM应用肯定需要组件化，需要MVVM设计模式，和其他项目一样，根据整个应用进行组件划分，并且为了整个应用的数据单一便于管理和维护，我们打算采用整个应用维持一个数据源，然后自上而下分发到各级子组件分别进行逻辑处理并作相应的渲染的方式进行数据组织。

![初始架构](http://7oxjbb.com1.z0.glb.clouddn.com/init.jpg)

如上图所示，但最后发现数据源维护在顶级组件，子组件为了改变顶级数据源就需要将事件一层一层冒泡到顶级组件委托给顶级组件去处理，当所有组件的事件都由顶级处理的时候，势必会导致顶级组件逻辑变得越来越多，文件也会变得越来越大，到一定阶段代码就会变得难以维护。
所以就需要拆分顶级组件的逻辑为多个文件，将相关的逻辑放在一块，正好最近在看redux，觉得redux这种模式刚好和我们所需要的数据组织方式相吻合，通过redux顶级组件可以将数据源的管理托管给redux，除了数据源还可以将顶级组件的逻辑通过redux的reducer进行拆分，刚好可以解决顶级组件逻辑臃肿的问题。

![改进后](http://7oxjbb.com1.z0.glb.clouddn.com/version0.2.1.jpg)

如上图，子组件不用将事件委托给顶级组件，而是可以通过dispatch action 委托给redux进行统一处理，因为action的特殊性，为了使得有些组件能够更加通用，所以有些子组件依然采用事件委托给上级组件进行处理，这样也不至于导致处理逻辑分的过细。

### 1. redux 在架构中做了什么

![redux流程](http://7oxjbb.com1.z0.glb.clouddn.com/version-0.2.jpg)

在redux模式中，任何操作包括单击，发起ajax请求，ajax请求完成，ajax请求失败，发送消息，数据库连接，等等都被看做是一个action，action通常是一个简单的对象，对象中的type属性代表action的类型，类似于事件类型，除了type这个强制属性，还可以添加data等属性来存储数据信息，便于后续使用。从图中可以看出，Store 是连接其他部分的核心，整个Web-IM的数据源委托给Store进行管理，且Web-IM和Store采用的是发布订阅模式，Web-IM订阅者关注着State的变化，当State一旦发生了改变，Store就会通知Web-IM订阅者,Web-IM得到了最新的State后然后更新他的数据，并对UI进行相应的更新。同时Store也是action的分发器，将Web-IM产生的action分发给Reducers处理，所以通过这样的方式，Web-IM原本集中在顶级组件的事件处理逻辑就可以拆分到多个Reducer中进行处理了。Reducer的功能和Array.reduce方法很像，输入state 和 action，输出新的state交由Store管理。Store就会将state的变更通知给Web-IM进行数据更新和UI更新。具体的redux的一些概念可以参考[Redux 中文文档](http://camsong.github.io/redux-in-chinese/);

### 2. redux 在Web-IM中的具体实现和说明

#### 首先整个应用需要一个Store进行对Actions的分发和管理State并通知Web-IM更新数据源和UI。

```javascript
/**
 * 整个应用状态容器
 * @version 1.0
 * @author hzzhuzhenyu(hzzhuzhenyu@corp.netease.com)
 * Created by hzzhuzhenyu on 2016/4/19.
 */

NEJ.define([
    'npm/redux/dist/redux.min',
    'pro/reducers/reducers'
],function(redux,rootReducer){

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

```

在实现中采用的是NEJ的模块化管理，为了使得项目中不用通过babel将ES6写法转换成ES5,ES3,所以统一采用引入在node_modules/redux/dist/目录下面编译后的redux版本。同时为了使得Store能够和Reducers关联起来，即Store分发的action能够被Reducer处理，Reducer的处理结果能够被Store获取，这里就需要引入reducers模块。在创建store的时候就需要传入``rootReducer``,同时为了能够处理异步的action，需要引入中间件``thunkMiddleware``。中间件的作用可以参考redux文档或则这篇文章[redux的middleware詳解](http://huli.logdown.com/posts/294284-javascript-redux-middleware-details-tutorial)。

#### 实现Store后下面就需要分别实现Action 和 Reducer两部分了。

```javascript

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

```

在实现Action部分的时候使用到了``Redux.bindActionCreators`` 通过这个函数可以将dispatch和actionCreators结合起来，在Web-IM中可以直接调用对应的包装后的方法，使得从产生action到store的分发产生的action一站式完成。 如下代码：
```javascript
引入imActions
//IM组件模板
<div class="opt">
    <a href="javascript:void(0);" on-click={this.showSearch()}>添加好友</a>
    <search status={search.status} scon={search.scon} on-add={this.addFriend()}/>
</div>
//IM组件中的方法
addFriend: function() {
    // 从产生action到store的分发产生的action一站式完成
    imActions.addFirends(this.data.search.scon,this.nimsdk); 
}
```

再来看Reducer部分的实现。一开始根据redux的文档来说每个reducer是一个函数，其中有很多swicth case，且不同的reducer可以关注state的一部分数据片。文档中的reducer看起来是这样的：

```javascript
//state 
{
  visibilityFilter: 'SHOW_ALL',
  todos: [{
    text: 'Consider using Redux',
    completed: true,
  }, {
    text: 'Keep all state in a single tree',
    completed: false
  }]
}

// 只关注todos的reducer
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, {
        text: action.text,
        completed: false
      }];
    case COMPLETE_TODO:
      return [
        ...state.slice(0, action.index),
        Object.assign({}, state[action.index], {
          completed: true
        }),
        ...state.slice(action.index + 1)
      ];
    default:
      return state;
  }
}
//只关注visibilityFilter的reducer
function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
}

//最后通过combineReducers方法得到整个应用的reducer
import { combineReducers } from 'redux';

const todoApp = combineReducers({
  visibilityFilter,
  todos
});

export default todoApp;
```

从代码中看到，虽然通过这种方式可以拆分reducer，从而达到拆分顶级组件逻辑代码的作用，但是一旦整个应用的state变得更加复杂，嵌套更多，势必会导致reducer的嵌套使用，而且像visibilityFilter这样的属性，一个属性就要对应一个reducer，一旦state有多个这样的属性，就会很容易导致reducer过多分的过细的问题。所以这种方式并不是特别的好，因为嵌套变多了可能会导致你的应用变得更加复杂。下面是一种变体：

![目录](http://7oxjbb.com1.z0.glb.clouddn.com/version0.2.4.jpg)

采用map映射的方法来代替switch case,map 对象中的一个key对应于switch的一个case。

```javascript
reducerMaps/rootReducerMap.js
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

reduers/reducers.js
/**
 * 所有处理action & state逻辑汇总
 * @version 1.0
 * @author hzzhuzhenyu(hzzhuzhenyu@corp.netease.com)
 * Created by hzzhuzhenyu on 2016/4/19.
 */

NEJ.define([
    'pro/reducerMaps/rootReducerMap'
], function (rootReducerMap) {
    //初始state
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

```
最后得到的``rootReducer``方法就是需要和Store进行bind的函数。这样由Store统一分发的action就能够被reducer们处理了，然后返回的新的state就可以由Store管理了。

#### 那么如何通知Web-IM 应用的 state已经变更并进行更新数据和UI。
```javascript

NEJ.define([
    '{module}im/im.js',
    'pro/stores/appStore'
], function(IM,appStroe) {
    var store = appStroe();
    // IM 顶级组件初始化的时候得到store的初始state
    var im = new IM({
        data : store.getState()
    });
    //订阅state的变更
    store.subscribe(function () {
        var state = store.getState();
        im.data = NEJ.copy({},state); // 这个地方实际使用的时候不能直将state接赋给data 
        im.$update();
    });

    im.$inject('#app');
});

```
``im.data = NEJ.copy({},state);`` 如果改成im.data = state 这个state可能莫名会多出很多奇怪的属性，因为regularjs库的原因，组件的一些属性可能成为data的属性。所以整个项目在处理action产生新的state时需要不可变数据操作工具类似immutable.js。自此项目架构基本形成。

### 3.集成redux-devtools

安装 [chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

按照如下方式在store上添加代码
``` javascript
 return function appStore(initialState) {
        return Redux.createStore(rootReducer,initialState,Redux.compose(Redux.applyMiddleware(thunkMiddleware),window.devToolsExtension ? window.devToolsExtension() : undefined));
    };
```

添加了``window.devToolsExtension ? window.devToolsExtension() : undefined``这段代码，然后启动应用就可以通过浏览器扩展插件进行调试了。

![redux-devtools](http://7oxjbb.com1.z0.glb.clouddn.com/redux-devtools.jpg)