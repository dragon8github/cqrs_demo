"use strict";
const Domain = require('cqrs');
const Actor = Domain.Actor;

class User extends Actor {
    constructor(data) {
        // 继承
        super(data);
    }

    //领域方法 产生领域事件
    changeName(data, service) {
        service.apply("changeName",data);
    }

    // 更改自身的属性必须通过when
    when(event) {
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

domain.create('User',{name:"Lee"},function(err,json){
    console.log(json);
})