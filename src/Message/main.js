module.exports = class ActorMessage {

  // CONSTRUCTOR :: STRING, ACTOR, * -> this
  constructor(actorID, customer, content) {
    this._address = actorID;    // Where this message was being sent to
    this._customer = customer;  // Actor this message was being sent from
    this._content = content;    // Value being sent in message
  }

  // :: VOID -> STRING
  // Returns address of where this message was sent to:
  address() {
    return this._address;
  }

  // :: VOID -> ACTOR
  // Return reference to actor that send this message
  customer() {
    return this._customer;
  }

  // :: VOID -> this._content
  // Returns value sent in message:
  content() {
    return this._content;
  }

  // :: VOID -> STRING
  // Returns type of content value as STRING:
  typeOfContent() {
    if (this._content === undefined) return "undefined";
    if (this._content === null) return "null";
    return this._content.constructor.name;
  }

  /**
   *
   *  Static Methods
   *
   */

   // :: STRING, ACTOR, * -> MESSAGE
   // Static factory method:
   static init(actorID, customer, content) {
     return new ActorMessage(actorID, customer, content);
   }

}
