(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('microtask', factory) :
  (global.microtask = factory());
}(this, (function () { 'use strict';

  /**
   * @module native
   * @license MIT
   * @version 2017/12/04
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
   * @license MIT
   * @version 2017/12/04
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
   * @license MIT
   * @version 2017/12/04
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

  /**
   * @module channel
   * @license MIT
   * @version 2017/12/04
   */

  var VBArray = window.VBArray;
  var MessageChannel = window.MessageChannel;

  var channel = {
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

  /**
   * @module image
   * @license MIT
   * @version 2017/12/04
   */

  var image = {
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

  /**
   * @module task
   * @license MIT
   * @version 2017/12/04
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
   * @module index
   * @license MIT
   * @version 2017/12/04
   */

  var schedule;
  var queue = [];
  var slice = Array.prototype.slice;
  // Use chain: promise > mutation > channel > image
  var schedules = [promise, mutation, channel, image];

  /**
   * @function nextTick
   */
  function nextTick() {
    var buffer = queue;

    queue = [];

    for (var i = 0, length = buffer.length; i < length; i++) {
      buffer[i].run();
    }
  }

  // Install schedule
  for (var i = 0, length = schedules.length; i < length; i++) {
    schedule = schedules[i];

    if (schedule.support()) {
      schedule = schedule.install(nextTick);

      break;
    }
  }

  /**
   * @function microtask
   * @param {Function} task
   */
  function microtask(task) {
    var args = slice.call(arguments, 1);

    queue.push(new Task(task, args));

    schedule();
  }

  return microtask;

})));
