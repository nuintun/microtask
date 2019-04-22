/**
 * @module promise
 * @license MIT
 * @author nuintun
 */

import native from '../native';

var Promise = this.Promise;

export default {
  /**
   * @method support
   * @returns {boolean}
   */
  support: function() {
    return native(Promise);
  },
  /**
   * @method install
   * @param {Function} handler
   * @returns {Function}
   */
  install: function(handler) {
    return function() {
      Promise.resolve().then(handler);
    };
  }
};
