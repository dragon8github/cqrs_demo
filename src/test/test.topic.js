const Domain = require('cqrs');
const should = require('should');
const Topic = require('../lib/Topic');

var topicId;
describe('Topic', function () {
    // create Domain
    var domain = new Domain();
    domain.register(Topic);

    var eventname = Domain.Alias().actorType('Topic').name('create').get();
    domain.on(eventname, function handle(event) {
        console.log("create event",event);  //没有打印出任何东西
    });

    var eventname2 = Domain.Alias().actorType('Topic').name('top').get();
    domain.on(eventname2, function handle(event) {
        console.log(event); //成功打印出json
    });

    it('#create', function (done) {
        //id生成器
        domain.create('Topic', { title: "mytitle", body: "mybody" }, function (err, Topic) {            
            try {         
                if(err) { console.log(err); return false}       
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
        domain.call(`Topic.${topicId}.update`,{title:"1",body:"mybody"}).catch(function(err){
             //先测试错误情况下是否正常
            should.exist(err);
          
             //再测试正常情况下
            domain.call(`Topic.${topicId}.update`,{title:"mytitle",body:"mybody"});
            domain.get('Topic', topicId,function(){}).then(function (json) {
                    json.title.should.eql("mytitle");
                    json.body.should.eql("mybody");
                    done();
            })
        });
    })
})