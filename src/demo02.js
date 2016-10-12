"use strict";
const Domain = require('cqrs');
const Actor = Domain.Actor;

class User extends Actor {
    constructor(data) {
        //valiadate
        if(!data || data.name.length < 3)  throw new Error('args error!!');
        // 继承
        super(data);
    }

    //领域方法 产生领域事件
    changeName(data, service) {
        //validate
        if(!data || data.name.length < 2)  throw new Error('args error!！!');
        //调用事件
        service.apply("changeName",data);
    }

    // 更改自身的属性必须通过when
    when(event) {
        //如果要使用删除功能必须使用这个
        super.when(event);
        // 根据事件的名称进行更改属性
        switch(event.name) {
            case "changeName":
                //对私有属性进行处理
                this._data.name = event.data.name;
            break;
        }
    }
}

//创建一个领域层
const domain = new Domain()
//注册
domain.register(User);


// 传统方式创建actor
// domain.create('User',{name:"lee"},function(err,json){
//     if(err) {
//         console.log(err)
//     } else {
//         console.log(json)
//     }
// })

//promise 方式创建actor
// let promise = domain.create('User',{name:"lee"});
// promise.then(function(json){
//     console.log(json)
// }).catch(err => console.log(err));  //必须有catch才能捕捉返回的错误 

//promise 方式创建actor,将Lee更新为mp,再删除的过程
let userId; 
let promise = domain.create('User',{name:"lee"}); 
promise.then(function(json) {
    return json.id
}).then(function(id) {
    userId = id
    // 注意第一个参数使用了es6 字符模板,尽管更新了属性，id也不会变化（废话）
    return domain.call(`User.${userId}.changeName`,{name:'mp'});
}).then(function(result) {
    return domain.get("User",userId);
}).then(function(json){
    //神坑！！remove返回的promise中并没有json对象.必须重新利用get获取。
    return domain.remove("User",userId); 
}).then(function() {
    return domain.get("User",userId);
}).then(function(json){
    console.log(json)
})
.catch(err => console.log(err));  //必须有catch才能捕捉返回的错误

 



