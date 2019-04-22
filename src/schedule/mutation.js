/**
 * @module mutation
 * @license MIT
 * @author nuintun
 */

import native from '../native';

var Mutation = this.MutationObserver || this.WebKitMutationObserver;

export default {
  /**
   * @method support
   * @returns {boolean}
   */
  support: function() {
    return native(Mutation);
  },
  /**
   * @method install
   * @param {Function} handler
   * @returns {Function}
   */
  install: function(handler) {
    var toggle = true;
    var observer = new Mutation(handler);
    var element = document.createTextNode('');

    observer.observe(element, {
      characterData: true
    });

    return function() {
      element.data = toggle = !toggle;
    };
  }
};
