const ActorSys =  require("../src/main.js");

Behaviors = {
  "add":ActorSys.Behavior.init((actor, message, resolve, reject) => {
    let content = message.content();
    setTimeout(function () {
      console.log(content.x + content.y);
      resolve(Behaviors.add);
    }, 1000);
  }),
  "addTo": (x) => ActorSys.Behavior.init((actor, message, resolve, reject) => {
    let content = message.content();
    setTimeout(function () {
      console.log(x + content);
      resolve(Behaviors.addTo(x));
    }, 1000);
  }),
  "addToThen":(x,y) =>  ActorSys.Behavior.init((actor, message, resolve, reject) => {
    let content = message.content();
    setTimeout(function () {
      console.log(content.x + content.y);

    }, 1000);
  }),
}

System = ActorSys.Actor.init()
  .spawn("add5", Behaviors.addTo(5))
  .send("add5", 10)
  .send("add5", 20)

System2 = ActorSys.Actor.init()
  .spawn("add3", Behaviors.addTo(3))
  .send("add3", 20)
  .send("add3", 20)
