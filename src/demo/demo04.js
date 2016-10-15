"use strict";
const Domain = require('cqrs');
const Actor = Domain.Actor;




class User extends Actor {
    constructor(data)
    {
        super({
            name:data.name,
            money:data.money || 0
        })
    }

    jia (data,service) {
        service.apply('jia',data);
    }

    jian (data,service) {
        service.apply('jian',data);
    }

    when(event)
    {
        super.when(event);
        switch(event.name){
                case 'jia':
                    this._data.money += event.data.money;
                    break;
                case 'jian':
                    this._data.money -= event.data.money;
                    break;
        }   
    }
}

class Transfrom extends Actor {
    constructor(data) {
        super({
            fromId:data.fromId,
            toId:data.toId,
            state:null
        })
    }

    * transfrom (data,service) {
        let money = data.money;
        service.apply('begin');
        yield service.sagaCall(`User.${this._data.fromId}.jian`,{money});
        yield service.sagaCall(`User.${this._data.toId}.jia`,{money});
        service.apply('end');
    }

    when(event){
        switch(event.name){
            case 'begin':
                this._data.state = 'begin'
                break;
            case 'end':
                this._data.state = 'end'
                break;
        }
    }
}

var domain = new Domain();

domain.register(User).register(Transfrom);

let fromId,toId

// id生成器 
domain.create("User",{name:"Lee",money:"6500"}).then(function(data){
    fromId = data.id;
    console.log(fromId)
    return domain.create('User',{name:"toUser"});
}).then(function(data){
    toId = data.id;
    console.log(toId)
    // 监听
    domain.once(Domain.Alias().name("end").actorType('Transfrom').get(),function(event){
        console.log("end")
    })
    return domain.create('Transfrom',{fromId,toId});
}).then(function(json){
    console.log(json.id)
    domain.call(`Transfrom.${json.id}.transfrom`,{money:25})
})

