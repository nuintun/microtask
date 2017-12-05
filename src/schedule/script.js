/**
 * @module script
 * @license MIT
 * @version 2017/12/05
 */

var fragment = document.createDocumentFragment();

export default {
  /**
   * @method support
   * @returns {boolean}
   */
  support: function() {
    return 'onreadystatechange' in document.createElement('script');
  },
  /**
   * @method install
   * @param {Function} handler
   * @returns {Function}
   */
  install: function(handler) {
    return function() {
      var script = document.createElement('script');

      script.onreadystatechange = function() {
        handler();

        // Remove event
        script.onreadystatechange = null;

        // Remove script
        fragment.removeChild(script);

        // Free script
        script = null;
      };

      fragment.appendChild(script);
    };
  }
};
