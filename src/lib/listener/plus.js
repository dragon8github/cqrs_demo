const Domain = require('cqrs');

module.exports = function(domain){

console.log("Domain.Alias()",Domain.Alias());
    var eventname = Domain.Alias().actorType('Topic').name('create').get();
        domain.on(eventname,function handle(event){  
        domain.get('Topic',event.actorId).then(topicJSON => {
             domain.call(`User.${topicJSON.authorId}.plus`,3);
        })
    });


    // var eventname2 = Domain.Alias().actorType('Reply').name('create').get();
    // domain.on(eventname,function handle(event){
    //     domain.get('Reply',event.actorId).then(replyJSON => {
    //          domain.call(`User.${replyJSON.authorId}.plus`,{num:2})
    //     })
    // });
}