const ActorSys =  require("../src/main.js");

Behaviors = {
  "add":ActorSys.Behavior.init(function (actor, message, resolve, reject) {
    let content = message.content();
    setTimeout(() => {
      console.log(content.x + content.y);
      resolve(this);
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
  "adder":ActorSys.Behavior.init(function (actor, message, resolve, reject) {
    resolve(Behaviors.sum(message.content()))
  }),
  "sum":(x) => ActorSys.Behavior.init(function (actor, message, resolve, reject) {
    message.content(val=>{
      if (val === "print") {
        console.log(x);
        resolve(Behaviors.adder);
      } else {
        resolve(Behaviors.sum(x+message.content()));
      }
    })
  })
}

System = ActorSys.Actor.init()
  .spawn("foreward", function (actor, message, resolve, reject) {
    message.content(([address, value]) => {
      message.customer().send(address, value)
      resolve(this);
    })
  })
  .spawn("print", function (actor, message, resolve, reject) {
    console.log(message.content());
    resolve(this);
  })
  .spawn("add", Behaviors.adder)
  .send("foreward", ["print", "hey"])
  .send("add", 1)
  .send("add", "print")
  .send("add", 2)
  .send("add", 4)
  .send("add", "print")
