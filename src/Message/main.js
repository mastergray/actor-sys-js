module.exports = class ActorMessage {

  // CONSTRUCTOR :: STRING, ACTOR, * -> this
  constructor(actorID, customer, content) {
    this._address = actorID;    // Where this message was being sent to
    this._customer = customer;  // Actor this message was being sent from
    this._content = content;    // Value being sent in message
  }

  // :: VOID|(STRING -> *) -> STRING
  // Applies function address of message, otherwise returns address of where this message was sent to:
  address(fn) {
    return typeof(fn) === 'function'
      ? fn(this._address)
      : this._address;
  }

  // :: VOID|(ACTOR -> *) -> ACTOR|*
  // Applies function to customer of message, otherwise returns reference to actor that send this message
  customer(fn) {
    return typeof(fn) === 'function'
      ? fn(this._customer)
      : this._customer;
  }

  // :: VOID|(*, STRING -> *) -> this._content|*
  // Applies function to content of message and it's type, otherwise returns value sent in message:
  content(fn) {
    return typeof(fn) === 'function'
      ? fn(this._content, this.typeOfContent())
      : this._content;
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
