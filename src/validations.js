import BasisArray from "./array";
import * as util from "./util";

function isBlank(v) {
  return v == null ||
    (util.type(v) === 'string' && v.match(/^\s*$/)) ||
    util.type(v) === 'array' && v.length === 0 ||
    v instanceof BasisArray && v.length === 0;
}

var Validations = {
  // Public: Adds a validator to the model that checks the given attributes for presence.
  //
  // ...names - One or more attribute names.
  // opts     - An optional object containing zero or more of the following options:
  //   if - A function that determines whether presence is required. If this returns false, then the
  //        presence validator will not run.
  //
  // Returns the receiver.
  validatesPresence: function() {
    var names = Array.from(arguments),
        opts  = util.type(names[names.length - 1]) === 'object' ? names.pop() : {};

    names.forEach(function(name) {
      this.validate(name, function() {
        if (opts.if && !opts.if.call(this)) { return; }
        var v = this[`${name}BeforeCoercion`] != null ? this[`${name}BeforeCoercion`] : this[name];
        if (isBlank(v)) { this.addError(name, 'must be present'); }
      });
    }, this);

    return this;
  },

  // Public: Adds a validator to the model that checks to make sure the given attributes are valid
  // numbers.
  //
  // ...names - One or more attribute names.
  // opts     - An optional object containing zero or more of the following options:
  //   nonnegative - Ensure that the number is not negative.
  //
  // Returns the receiver.
  validatesNumber: function() {
    var names = Array.from(arguments),
        opts  = util.type(names[names.length - 1]) === 'object' ? names.pop() : {};

    names.forEach(function(name) {
      this.validate(name, function() {
        if (util.type(this[name]) === 'number') {
          if (opts.nonnegative && this[name] < 0) {
            this.addError(name, 'must not be negative');
          }
        }
        else if (!isBlank(this[`${name}BeforeCoercion`])) {
          this.addError(name, 'is not a number');
        }
      });
    }, this);

    return this;
  },
};

export default Validations;
