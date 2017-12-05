/**
 * @module mutation
 * @license MIT
 * @version 2017/12/05
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
    var called = 0;
    var observer = new Mutation(handler);
    var element = document.createTextNode('');

    observer.observe(element, {
      characterData: true
    });

    return function() {
      element.data = called = ++called % 2;
    };
  }
};
