module.exports = class MessageQueue {

  // CONSTRUCTOR :: FUNCTION -> this
  constructor(onErr) {
    this._fns = [];
    this._onErr = onErr
  }

  // :: (next, err) -> this
  // Adds function to queue for processing:
  add(fn) {
    this._fns.push(fn);
    return this;
  }

  // :: (next, err) -> this
  // Add function to front of queue:
  escalate(fn) {
    this._fns.unshift(fn);
    return this;
  }

  // :: VOID -> this
  // Clears all functions in queue:
  clear() {
    return this.escalate((next, err) => {
      this._fns = [];
      next();
    });
  }

  // :: VOID -> this
  // Processes next function in queue if there are any functions to proess:
  next() {
    if (this._fns.length > 0) {
      let fn = this._fns.shift();
      fn(() => {
        this.next();
      }, (err) => {
        this._onErr(err);
      });
    }
    return this;
  }

  /**
   *
   *  Static Methods
   *
   */

  // :: FUNCTION -> syncQueue
  // Static factory method:
  static init(onErr) {
    return new MessageQueue(onErr);
  }

}
