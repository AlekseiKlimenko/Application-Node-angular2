'use string'
global.ABSPATH = __dirname;
global.INCPATH = ABSPATH + '/libs';

let express = require("express"),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    path = require('path'),
    cluster = require('cluster'),
    cpuCount = require('os').cpus().length,
    app = express();

let routeConfig = require( ABSPATH + '/routeConfig'),
    apiConfig = require( ABSPATH +'/apiConfig'),
    log = require( INCPATH + '/log' )(module),
    authorizeUrls = require(INCPATH + '/autorization'),
    config = require( INCPATH + '/config' ),
    tasksStorage = require( INCPATH + '/storage').tasks,
    workerManager = require( INCPATH + '/workerManager');

// app.use(express.favicon()); // отдаем стандартную фавиконку, можем здесь же свою задать
// app.use(express.methodOverride()); // поддержка put и delete

if(cluster.isMaster){
    log.info('Create master process');
    var mainProcess = cluster.fork();

    mainProcess.on('message', function(msg) {
        if(msg.type = 'finishTask'){
            if(!msg.error){
                tasksStorage.insert({
                    resultTask: msg.task,
                    taskCode: msg.taskCode,
                    idProcess: msg.processId
                }, function (err, data) {
                    workerManager.emit('sendNewFinisTask', data);
                })
            }else {
                workerManager.emit('sendNewFinisTask', {error:msg.error});
            }
        }
    });

    var workerIds = [];
    log.info('Create workers == ' + cpuCount);
    for(var i = 0; i < cpuCount; i++) {
        cluster.fork();
    }
    for(wid in cluster.workers) {
        workerIds.push(wid);
    }

    //слушаем события прихода новых тасок
    workerManager.on('newTask', function (newTask) {
        log.info('Send new task!');
        //Сообщаем всем процессам о новой задаче.
        workerManager.notifyWorkers(workerIds, cluster,
            {
                type: 'createTask',
                from: 'master',
                task: newTask
            })
    });

    cluster.on('online', function(worker) {
        log.info('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        mainProcess = cluster.fork();
    });

    app.use('/static', express.static('../public'));
    app.use(session({
        secret: 'your secret here',
        cookie: { path: '/', httpOnly: true, maxAge: 1000*60*60*24 }
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/', authorizeUrls() ,routeConfig);
    app.use('/api', apiConfig);

    app.use(function(req, res, next) {
        log.debug('Not found URL:',req.url);
        res.status(404).send('Sorry cant find that!');
    });

    app.use(function(err, req, res, next) {
        log.error('Internal error:',res.statusCode,err.message);
        res.status(500).send('Something broke!');
    });

    app.listen(config.get('port'), () => {
        log.info('Server up, listen port config.get(\'port\')!');
    });
}else {
    process.on('message', (msg) => {
        if(msg.type == 'createTask'){
            //слушаем мастера когда нужно выполнить задачи
            var finishTask = workerManager.createTask(msg.task);
            if(finishTask){
                process.send({
                    type: 'finishTask',
                    from: 'worker',
                    taskCode: msg.task,
                    task: finishTask,
                    processId: process.pid
                })
            }else {
                process.send({
                    type: 'finishTask',
                    from: 'worker',
                    error: 'invalid function'
                })
            }
        }
    })
}



