const ActorMessage = require("../Message/main.js");
const ActorBehavior = require("../Behavior/main.js");

module.exports = class Actor {

  // CONSTRUCTOR :: BEHAVIOR, (OBJECT, ACTOR -> VOID), NUMBER -> this
  constructor(behavior, onErr, duration) {
    this._behavior = behavior;           // Behavior of this actor
    this._actors = {};                   // Actor spawned by this actor bound to an ID
    this._queue = [];                    // Messages recieved and not yet processed
    this.processQueue();                 // Initializes queue
  }

  // :: STRING, BEHAVIOR, (OBJECT, ACTOR -> VOID), NUMBER -> this
  // Creates new actor with given behavior bound to given ID:
  spawn(actorID, behavior, onErr, duration) {
    this._actors[actorID] = Actor.init(behavior, onErr, duration);
    return this;
  }

  // :: STRING -> BOOL
  // Returns TRUE if there exists an actor with the given ID, otherwise returns false:
  actorExists(id) {
    return this._actors[id] !== undefined;
  }

  // STRING, * -> this
  // Sends value to actor with the given actorID:
  // NOTE: This throws an exception if an actor does not exist for the given ID:
  send(actorID, val) {
    if (this.actorExists(actorID)) {
      let message = new ActorMessage(actorID, this, val);
      this._actors[actorID].accept(message);
      return this;
    }
    throw new Error(`actor-sys.js ERROR -> Cannot send message: actor with given ID of "${actorID}" does not exist`);
  }

  // :: MESSAGE -> this
  // Adds message to actor queue to be processed in the order that message was recieved:
  accept(message) {
    this._queue.push(message);
    return this;
  }

  // :: (OBJECT, ACTOR -> VOID), NUMBER -> VOID
  // Evaluates each message in queue in the order it was recieved:
  processQueue(onErr, duration) {
    let watchQueue = setInterval(() => {
      if (this._queue.length > 0) {
        clearInterval(watchQueue);
        let message = this._queue.shift();
        this._behavior.become(this, message).then(behavior => {
          this._behavior = behavior;
          this.processQueue(onErr, duration)
        }).catch(onErr);
      }
    }, duration);
  }

  /**
   *
   *  Static Methods
   *
   */

   // :: BEHAVIOR|FUNCTION, (OBJECT, ACTOR -> VOID), NUMBER -> ACTOR
   // Static factor method:
   // NOTE: If function given for behavior, initailize new instance of ActorBehavior with that function
   // NOTE: Defualt error handler for processing message consoles error and stops processing message
   // NOTE: Default duration to check for new message is 100ms
   static init(behavior, onErr, duration) {
     return new Actor(
       typeof(behavior) === 'function'
        ? ActorBehavior.init(behavior)
        : behavior,
      onErr === undefined
        ? (err, actor) =>  {console.log(err)}
        : onErr,
      duration === undefined
        ? 100
        : duration
     );
   }

}
