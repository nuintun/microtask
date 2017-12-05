/**
 * @module promise
 * @license MIT
 * @version 2017/12/05
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
