const ActorMessage = require("../Message/main.js");
const ActorBehavior = require("../Behavior/main.js");
const MessageQueue = require("../MessageQueue/main.js");

module.exports = class Actor {

  // CONSTRUCTOR :: BEHAVIOR, (OBJECT, ACTOR -> VOID) -> this
  constructor(behavior, onErr) {
    this._behavior = behavior;              // Behavior of this actor
    this._actors = {};                      // Actor spawned by this actor bound to an ID
    this._queue = MessageQueue.init(onErr); // Messages recieved and not yet processed
  }

  // :: STRING, BEHAVIOR, (OBJECT, ACTOR -> VOID) -> this
  // Creates new actor with given behavior bound to given ID:
  spawn(actorID, behavior, onErr) {
    this._actors[actorID] = Actor.init(behavior, onErr);
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
  // NOTE: If only 1 argument is given, assumes message is being "sent" directly to this instance:
  send(actorID, val) {
    switch (arguments.length) {
      case 1:
        let message = new ActorMessage(null, this, actorID);
        this.accept(message);
        return this;
      break;
      case 2:
        if (this.actorExists(actorID)) {
          let message = new ActorMessage(actorID, this, val);
          this._actors[actorID].accept(message);
          return this;
        }
        throw new Error(`actor-sys.js ERROR -> Cannot send message: actor with given ID of "${actorID}" does not exist`);
      break;
      default:
        throw new Error(`actor-sys.js ERROR  -> Invalid number of "${arguments.length}" arugments given for sending a message`);
    }
  }

  // * -> this
  // Sends first message to actor, which also Initalizes the message queue:
  // NOTE: This throws an exception if an actor does not exist for the given ID:
  // NOTE: If only 1 argument is given, assumes message is being "sent" directly to this instance:
  // NOTE: Sending messages without calling "start" will mean messages in queue will remain unread:
  start(actorID, val) {
    switch (arguments.length) {
      case 1:
        this.send(actorID);
        this._queue.next();
        return this;
      break;
      case 2:
        this.send(actorID, val);
        this._actors[actorID]._queue.next();
        return this;
      break;
      default:
        throw new Error(`actor-sys.js ERROR  -> Invalid number of "${arguments.length}" arugments given for starting an actor`);
    }
  }

  // :: MESSAGE -> this
  // Adds message to actor queue to be processed in the order that message was recieved:
  accept(message) {
    this._queue.add((next, err) => {
      this._behavior.become(this, message, behavior => {
        this._behavior = behavior;
        next();
      }, err);
    });
    return this;
  }

  // :: VOID -> this;
  // Clear queue of any pending items:
  clearQueue() {
    this._queue.clear();
    return this;
  }

  // :: STRING -> this
  // Removes child for given ID from children of this instance
  kill(id) {
    if (this.actorExists(id)) {
      this._actors[id].clearQueue();
      delete this._actors[id];
    }
    return this;
  }

  // :: VOID -> this
  // Stops queue for this instance and all of it's children:
  terminate() {
    this.clearQueue();
    Object.keys(this._actors).forEach(id => {
      this.kill(id);
    });
    return this;
  }

  /**
   *
   *  Static Methods
   *
   */

   // :: BEHAVIOR|FUNCTION, (OBJECT, ACTOR -> VOID) -> ACTOR
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
        : onErr
     );
   }

}
