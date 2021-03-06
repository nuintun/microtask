/**
 * @module microtask
 * @author nuintun
 * @license MIT
 * @version 0.0.1
 * @description A pure JavaScript cross browser microtask.
 * @see https://github.com/nuintun/microtask#readme
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('microtask', factory) :
  (global = global || self, global.microtask = factory());
}(this, function () { 'use strict';

  /**
   * @module task
   * @author nuintun
   * @license MIT
   */

  /**
   * @class Task
   * @constructor
   * @param {Function} task
   * @param {Array} args
   * @returns {Task}
   */
  function Task(task, args) {
    this.task = task;
    this.args = args;
  }

  /**
   * @method run
   */
  Task.prototype.run = function() {
    var task = this.task;
    var args = this.args;

    switch (args.length) {
      case 0:
        return task();
      case 1:
        return task(args[0]);
      case 2:
        return task(args[0], args[1]);
      case 3:
        return task(args[0], args[1], args[2]);
      default:
        return task.apply(null, args);
    }
  };

  /**
   * @module native
   * @author nuintun
   * @license MIT
   */

  // Used to match `RegExp`
  // [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
  var REGEXP_CHAR_RE = /[\\^$.*+?()[\]{}|]/g;
  // Used to detect if a method is native
  var IS_NATIVE_RE = Function.prototype.toString.call(Function);

  IS_NATIVE_RE = IS_NATIVE_RE.replace(REGEXP_CHAR_RE, '\\$&');
  IS_NATIVE_RE = IS_NATIVE_RE.replace(/Function|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?');
  IS_NATIVE_RE = new RegExp('^' + IS_NATIVE_RE + '$');

  /**
   * @function native
   * @param {any} value
   * @returns {boolean}
   */
  function native(value) {
    return typeof value === 'function' && IS_NATIVE_RE.test(value);
  }

  /**
   * @module promise
   * @author nuintun
   * @license MIT
   */

  var Promise = window.Promise;

  var promise = {
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

  /**
   * @module mutation
   * @author nuintun
   * @license MIT
   */

  var Mutation = window.MutationObserver || window.WebKitMutationObserver;

  var mutation = {
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

  /**
   * @module channel
   * @author nuintun
   * @license MIT
   */

  var VBArray = window.VBArray;
  var MessageChannel = window.MessageChannel;

  var channel = {
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

  /**
   * @module script
   * @author nuintun
   * @license MIT
   */

  var script = {
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

  /**
   * @module timeout
   * @author nuintun
   * @license MIT
   */

  var timeout = {
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

  /**
   * @module index
   * @author nuintun
   * @license MIT
   */

  var schedule;
  var queue = [];
  var draining = false;
  // Use chain: promise > mutation > channel > script > timeout
  var schedules = [promise, mutation, channel, script, timeout];

  /**
   * @function drain
   */
  function drain() {
    for (var i = 0; i < queue.length; i++) {
      queue[i].run();
    }

    queue = [];
    draining = false;
  }

  // Install schedule
  for (var i = 0, length = schedules.length; i < length; i++) {
    schedule = schedules[i];

    if (schedule.support()) {
      schedule = schedule.install(drain);

      break;
    }
  }

  /**
   * @function slice
   * @description Faster slice arguments
   * @param {Array|arguments} args
   * @param {number} start
   * @returns {Array}
   * @see https://github.com/teambition/then.js
   */
  function slice(args, start) {
    start = start >>> 0;

    var length = args.length;

    if (start >= length) {
      return [];
    }

    var rest = new Array(length - start);

    while (length-- > start) {
      rest[length - start] = args[length];
    }

    return rest;
  }

  /**
   * @function microtask
   * @param {Function} task
   */
  function microtask(task) {
    var args = slice(arguments, 1);

    // Equivalent to push, but avoids a function call. It's faster then push
    queue[queue.length] = new Task(task, args);

    if (!draining) {
      draining = true;

      schedule();
    }
  }

  return microtask;

}));
