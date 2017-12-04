/**
 * @module image
 * @license MIT
 * @version 2017/12/04
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
    var image = new Image();

    image.onerror = handler;

    return function() {
      image.src = '';
    };
  }
};
