var Q = require('q'),
    log = require('./log')(module);
require('util').inherits(workerProcess, require('events').EventEmitter);

function workerProcess(){

    this.notifyWorkers = function (workersArray, cluster, message) {
        workersArray.forEach(function (worker) {
            cluster.workers[worker].send(message);
        });
    };
    this.createTask = function (task) {
        task = String(task);
        try {
            var evalTask = eval(task);
            if(evalTask){
                return evalTask
            }else {
                return null;
            }
        }catch (error){
            log.error('invalid function');
        }
    }
};

module.exports = new workerProcess();