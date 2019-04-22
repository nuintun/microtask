/**
 * @module timeout
 * @license MIT
 * @author nuintun
 */

export default {
  /**
   * @method support
   * @returns {boolean}
   */
  support: function() {
    return true;
  },
  /**
   * @method install
   * @param {Function} handler
   * @returns {Function}
   */
  install: function(handler) {
    return function() {
      setTimeout(handler, 0);
    };
  }
};
