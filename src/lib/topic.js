"use strict";
const validator = require('validator');
const Domain = require('cqrs');
const Actor = Domain.Actor;

let _validator = (title,body) => {
    return title && body && validator.isLength(title,{min:2,max:30}) && validator.isLength(body,{min:2,max:1000});
}

class Topic extends Actor{
    constructor(data){
        if(!_validator(data.title,data.body)){throw new Error('create error')};
        super({
            authorId:data.authorId,
            title:data.title,
            body:data.body,
            fine:false,
            top:false,
            createTime:Date.now(),
            updateTime:Date.now(),
            accessNum:0
        })
    }
    //置顶
    top(data,service){
        service.apply('top')
    }
    //取消置顶
    untop(data,service){
        service.apply('untop')
    }
     //加精
    fine(data,service){
        service.apply('fine')
    }
     //取消加精
    unfine(data,service){
        service.apply('unfine')
    }
     //访问
    access(data,service){
        service.apply('access')
    }
    //访问
    update(data,service){
        if(!_validator(data.title,data.body)){throw new Error('update error')};
        service.apply('update',{title:data.title,body:data.body})
    }

    when(event){
        switch(event.name){
            case 'access':
                ++this._data.accessNum;
                break;
            case 'top':
                this._data.top = true;
                break;
            case 'untop':
                this._data.top = false;
                break;
            case 'fine':
                this._data.fine = true;
                break;
            case 'unfine':
                this._data.fine = false;
                break;
            case 'update':
                this._data.title = event.data.title;
                this._data.body = event.data.body;
                this._updateTime = Date.now();
                break;
        }
    }
}


module.exports = Topic;