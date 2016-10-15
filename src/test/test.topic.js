const Topic = require('../lib/Topic');
const Domain = require('cqrs');
const should = require('should');

var topicId;
describe('Topic', function () {
    // create Domain
    var domain = new Domain();
    domain.register(Topic);

    it('#create', function (done) {
        //id生成器
        domain.create('Topic', { title: "mytitle", body: "mybody" }, function (err, Topic) {
            try {
                should.exist(Topic.id);
                //获取Id
                topicId = Topic.id;
                Topic.top.should.eql(false);
                done();
            } catch (e) {
                console.log(e.stack)
            }
        });
    })

    it('#top', function (done) {
        domain.call(`Topic.${topicId}.top`);
        //get 有个bug,第三个参数必填一个函数，否则报错。应该会下个版本修复
        domain.get('Topic', topicId,function(){}).then(function (json) {
            json.top.should.eql(true);
            done();
        }).catch(err => console.log(err.stack))
    })

     it('#untop', function (done) {
        domain.call(`Topic.${topicId}.untop`);
        //get 有个bug,第三个参数必填一个函数，否则报错。应该会下个版本修复
        domain.get('Topic', topicId,function(){}).then(function (json) {
            json.top.should.eql(false);
            done();
        }).catch(err => console.log(err.stack))
    })


     it('#update', function (done) {
        domain.call(`Topic.${topicId}.update`,{title:"mytitle",body:"mybody"});
        //get 有个bug,第三个参数必填一个函数，否则报错。应该会下个版本修复
        domain.get('Topic', topicId,function(){}).then(function (json) {
            json.title.should.eql("mytitle");
            json.body.should.eql("mybody");
            done();
        }).catch(err => console.log(err.stack))
    })
})