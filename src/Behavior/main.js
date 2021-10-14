module.exports = class ActorBehavior {

  // CONSTRUCTOR :: ACTOR, MESSAGE, RESOLVE, REJECT -> PROMISE(BEHAVIOR) -> this
  constructor(fn) {
    this._fn = fn
  }

  // :: ACTOR, MESSAGE -> PROMISE(BEHAVIOR)
  // Applies function of behavior to the given ACTOR and MESSAGE in the context of THIS behavior:
  become(actor, message) {
    return new Promise((resolve, reject) => {
      this._fn.apply(this, [actor, message, resolve, reject]);
    })
  }

  /**
   *
   *  Static Methods
   *
   */

   // :: ACTOR, MESSAGE, RESOLVE, REJECT -> PROMISE(BEHAVIOR) -> BEHAVIOR
   // Static factory method:
   static init(fn) {
     return new ActorBehavior(fn);
   }

}
