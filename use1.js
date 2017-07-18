/**
 * Created by wb-ysb252760 on 2017/7/17.
 */


/**
 * 手工映射 ，简单版
 */

exports.setting = function (req,res) {
    // TODO
}

var routers = [];

var use = function (path,action) {
    routers.push([path,action]);
}

/**
 * 在入口程序中判断 URL，然后执行对应的逻辑，于是就完成可基本的路由映射过程
 */

function aa(req,res) {
    var pathname = url.parse(req.url).pathname;
    for (var i = 0;i < routers.length;i++){
        var route = routers[i];
        if(pathname === route[0]){
            var action = route[1];
            action(req,res);
            return;
        }
    }
    // 处理404
    handle404(req,res);
}


/**
 * 正则匹配,太复杂，省略
 * 功能就是将
 * /profile/:username => /profile/jacksontian , /profile/hoover
 */

var pathRegexp = function (path) {
    //TODO 最后返回一个路径的匹配正则
}

// 改造路由注册部分

var use = function (path,action) {
    routers.push([pathRegexp(path),action]);
}


// 匹配部分

function bb(req,res) {
    var pathname = url.parse(req.url).pathname;
    for(var i = 0;i<routers.length;i++){
        var route = routes[i];
        // 正则匹配
        if(route[0].exec(pathname)){
            var action = route[1];
            action(req,res);
            return;
        }
    }
    // 处理404
    handle404(req,res);
}


/**
 * 参数解析
 * 1.获取路径映射中的参数名字，也就是 /profile/:username 中的 username
 * 2.将匹配的参数添加到 req.params 上
 * 3.修改后的正则匹配函数返回值为 {keys:keys,regexp:new RegExp("^" + path + "$")}
 */


// 在此修改匹配规则

function cc(req,res) {
    var path = url.parse(req.url).pathname;
    for(var i = 0;i<routers.length;i++){
        var route = routers[i];
        // 正则匹配
        var reg = route[0].regexp;
        var keys = route[0].keys;
        var matched = reg.exec(pathname);
        if(matched){
            // 抽取具体值
            var params = {};
            for(var j = 0;j<keys.length;j++){
                var value = matched[j];
                if(value){
                    params[keys[j]] = value;
                }
            }
            req.params = params;

            var action = route[1];
            action(req,res);
        }
    }
}


/**
 * RESTful
 * 1. 全称表现层状态转化
 * 2. 他的操作行为主要体现在行为上
 * eg：POST  /user/jacksontian
 *     DELETE   /user/jacksontian
 *     PUT    /user/jacksontian
 *     GET    /user/jacksontian
 * 3. 具体来说是要在设计时就区分具体的请求方法
 */


var routers = {"all":[]};
var app = {};
app.use = function (path,action) {
    routers.all.push([pathRegexp(path),action]);
};

['get','put','delete','post'].forEach(function (method) {
    routers[method] = [];
    app[method] = function (path,action) {
        routers[method].push([pathRegexp(path),action]);
    }
});


/**
 * 1. 这里的路由能够识别请求方法，并将业务分发。
 * 2. 为了让路由匹配和分发更清晰，我们将匹配和分发分离
 */

// 匹配部分

var match = function (pathname,routes) {
    for(var i = 0;i<routes.length;i++){
        var route = routes[i];
        //正则匹配
        var reg = route[0].regexp;
        var keys = route[0].keys;
        var matched = reg.exec(pathname);
        if(matched){
            //抽取具体值
            var params = {};
            for(var j = 0;j<keys.length;j++){
                var value = matched[j];
                if(value){
                    params[keys[i]];
                }
            }
            req.params = params;

            var action = route[0];
            action(req,res);
            return true;
        }
    }
    return false;
}


// 分发部分


function dd(req,res) {
    var pathname = url.parse(req.url).pathname;
    // 将请求方法变为小写
    var method = req.method.toLowerCase();
    if(routers.hasOwnProperty(method)){
        // 根据请求方法分发
        if(match(pathname,routers[method])){
            return;
        }else{
            // 如果路径没有匹配成功，尝试让all()来处理
            if(match(pathname,routers.all)){
                return;
            }
        }
    }else{
        // 直接让all()来处理
        if(match(pathname,routers.all)){
            return;
        }
    }
    handle404(req,res);
}


/**
 * 中间件处理
 */

// 修改use方法，将中间件储存起来


app.use = function (path) {
    var handle;
    if(typeof path === "string"){
        handle = {
            // 第一个参数作为路径
            path:pathRegexp(path),
            // 其他的都是处理单元
            stack:Array.prototype.slice.call(arguments,1)
        }
    }else{
        handle = {
            // 第一个参数作为路径
            path:pathRegexp(path),
            // 其他都是处理单元
            stack:Array.prototype.splice.call(arguments,0)
        }
    }
    routers.all.push(handle);
}


// 匹配方法也需要改变

var match = function (pathname,routes) {
    var stacks = [];
    for(var i = 0;i<routers.length;i++){
        var route = routes[i];
        // 正则匹配
        var reg = route.path.reggxp;
        var matched = reg.exec(pathname);
        if(matched){
            //抽取具体值
            var params = {};
            for(var j = 0;j<keys.length;j++){
                var value = matched[j];
                if(value){
                    params[keys[i]];
                }
            }
            req.params = params;

            // 将中间件注册的处理函数储存在数组中
            stacks = stacks.concat(route.stack);

        }
    }

    return stacks;
}

// 这里有中间件的存在，当请求到达时，调用handle方法，递归性的执行中间件，每个中间件执行完后
// 按照约定调用next方法触发下一个中间件执行，知道最后的业务逻辑；

// handle方法


var handle = function (req,res,stack) {
    var next = function () {
        // 从stack 数组中取出中间件并执行
        var middleware = stack.shift();
        if(middleware){
            // 传入next函数自身，是中间件能够执行结束后递归
            middleware(req,res,next);
        }
    }

    // 启动执行
    next()
}

// 改进分发过程

function ff(req,res) {
    var pathname = url.parse(req.url).pathname;
    //请求方法变为小写
    var method = req.method.toLowerCase();
    //获取all方法里的中间件
    var stacks = match(pathname,routers.all);
    if(routers.hasOwnProperty(method)){
        // 根据请求方法分发，获取相关的中间件
        stacks.concat(match(pathname,routers[method]));
    }

    if(stacks.length){
        handle(req,res,stacks)
    }else{
        handle404(req,res);
    }
}


/**
 * 异常处理
 * 1.在中间件运行时的错误需要捕获
 * 2.对于同步中间件，直接用同步方式捕获
 * 3.对于异步中间件，则需要中间件自己将错误用next方法传出
 * 4.异常处理中间件应遵循node的设计规范即错误优先，应有四个参数
 *
 */


// 首先，改造handle方法

var handle = function (req,res,stack) {
    var next = function (err) {
        if(err){
            return handle500(err,req,res,stack);
        }

        // 从stack 数组中取出中间件并执行
        var middleware = stack.shift();
        if(middleware){
            // 传入next函数自身，是中间件能够执行结束后递归
            try{
                middleware(req,res,next);
            }catch(ex){
                next(ex);
            }
            
        }
    }

    // 启动执行
    next()
}


// 异步的处理

var session = function(req,res,next){
	var id = req.cookies.sessionid;
	store.get(id,function(err,session){
        if(err){
            // 将异常通过next方法传递
            return next(err)
        }
        req.session = session;
        next();
	})
}



// 异常处理函数

var handle500 = function (err,req,res,stack) {
    // 选取异常中间件
    stack = stack.filter(function (middleware) {
        return middleware.length === 4;
    })

    var next = function () {
        // 从stack 数组中取出中间件并执行
        var middleware = stack.shift();
        if(middleware){
            // 传入next函数自身，是中间件能够执行结束后递归
            middleware(err,req,res,next);
        }
    }

    // 启动执行
    next()

}
































