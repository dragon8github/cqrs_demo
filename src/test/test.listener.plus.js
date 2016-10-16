"use strict";

const should = require('should');
const Domain = require('cqrs');
const plus = require('../lib/listener/plus');
const User = require('../lib/user');
const Topic = require('../lib/topic');
const Reply = require('../lib/reply');

describe('plus', done => {
    let authorId = "";
    const domain = new Domain();
    plus(domain);
    domain.register(User).register(Topic).register(Reply);
    //这个语法是异步的
    domain.create('User', { loginName: "Lee", password: "123" }).then(function (json) {
        authorId = json.id;
    }); 
    
    
    it("#plus3", done => {
        domain.create('Topic', {authorId, title: "mytitle", body: "mybody" }).then(function(json){
            domain.get('User',json.authorId).then(function(Json){
                Json.num.should.eql(3);
                done();
            })
        })
    })

})