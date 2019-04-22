/**
 * @module task
 * @license MIT
 * @author nuintun
 */

/**
 * @class Task
 * @constructor
 * @param {Function} task
 * @param {Array} args
 * @returns {Task}
 */
export default function Task(task, args) {
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
