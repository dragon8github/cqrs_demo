"use strict";

const Domain = require('cqrs');
const User = require('../lib/User');
const should = require('should');


describe('User',function(){
    const domain = new Domain();
    domain.register(User);
    let userId;


    it('#create',done => {
        domain.create('User',{loginName:"Lee",password:"123"}).then(function(json){
            userId = json.id;
            json.loginName.should.eql('Lee');
            json.password.should.eql('123');
            done();
        })
    })

    it('#update',done=>{
       
        domain.call(`User.${userId}.update`,{nickName:'Mp',email:"928532756@qq.com"});

        domain.get(`User`,userId,function(){}).then(function(data){
            data.nickName.should.eql('Mp');
            data.email.should.eql('928532756@qq.com');
            done();
        })
    })
})