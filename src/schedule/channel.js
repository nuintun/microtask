/**
 * @module channel
 * @license MIT
 * @version 2017/12/05
 */

import native from '../native';

var VBArray = this.VBArray;
var MessageChannel = this.MessageChannel;

export default {
  /**
   * @method support
   * @returns {boolean}
   */
  support: function() {
    // IE MessageChannel slower than image error
    return !native(VBArray) && native(MessageChannel);
  },
  /**
   * @method install
   * @param {Function} handler
   * @returns {Function}
   */
  install: function(handler) {
    var channel = new MessageChannel();

    channel.port1.onmessage = handler;

    return function() {
      channel.port2.postMessage(0);
    };
  }
};
