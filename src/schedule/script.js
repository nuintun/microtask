/**
 * @module script
 * @license MIT
 * @author nuintun
 */

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
        script.parentNode.removeChild(script);

        // Free script
        script = null;
      };

      document.documentElement.appendChild(script);
    };
  }
};
