"use strict";

const Actor = require('cqrs').Actor;

class User extends Actor {
    constructor (data) {
        super ({
             loginName : data.loginName,
             nickName : data.loginName, //昵称默认和登录名一样
             password:data.password,
             num:0,
             email:data.email
        })
    }

    plus(data,service) {
        service.apply('plus',data);
    }

    update(data,service) {
        if(data.nickName){
            service.apply('updateNickName',data.nickName);
        }

        if(data.email){
            service.apply('updateEmail',data.email);
        }
    }

    updatePwd(data,service){
       service.apply('update',data.num); 
    }

    when(event){
        switch(event.name){
            case 'updatePwd':
                this._data.password = event.data;
                break;
            case 'updateEmail':
                this._data.email = event.data;
                break;
             case 'updateNickName':
                this._data.nickName = event.data;
                break;
            case 'plus':
                this._data.num += event.data;
                break;
        }
    }

}

module.exports = User;