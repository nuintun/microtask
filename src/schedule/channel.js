/**
 * @module channel
 * @license MIT
 * @author nuintun
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
    // IE MessageChannel slower than script state change
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
