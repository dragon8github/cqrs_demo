"use strict";

const should = require('should');
const Domain = require('cqrs');
const Reply = require('../lib/reply');


describe('Reply',function(){
    var domain = new Domain();
    domain.register(Reply);

    it('create',done => {   
        domain.create('Reply',{authorId:'u001',topicId:'t001'}).catch(err => {
            should.exist(err);
            done(); 
        })
    })
})