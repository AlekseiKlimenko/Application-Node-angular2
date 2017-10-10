let express = require('express'),
    log = require('./libs/log')(module),
    userStorage = require( INCPATH + '/storage').users,
    tasksStorage = require( INCPATH + '/storage').tasks,
    workerManager = require( INCPATH + '/workerManager');

router = express.Router();

router.post('/login', function (req, res) {
    let user = req.body;
    if(user.userName == 'admin' && user.userPassword == 'admin'){
        userStorage.insert({userName: user.userName, userPassword: user.userPassword}, function(err, data){
            res.status(200);
            res.cookie('authUser', JSON.stringify(data), {maxAge: 900000});
            res.send(data);
            res.end();
        });
        return;
    }
});

router.get('/logout', function (req, res) {
    userStorage.find({_id: req.query.userId}, function (err, docs) {
        if(docs.length > 0){
            userStorage.remove({_id: req.query.userId}, {}, function (err, done) {
                if(!err){
                    res.status(200);
                    res.clearCookie('authUser');
                    res.send('user logout');
                    res.end();
                }
            });
        }else {
            res.send('no such user');
            res.end();
        }
    })
});

router.get('/get-tasks',function (req, res) {
    tasksStorage.find({}, function (err, data) {
        res.status(200);
        if(!err){
            res.send(data);
        }else {
            res.send([]);
        }
        res.end();
    })
});

router.post('/create-task',function (req, res) {
    //Пришла новая задача для выполнение, сообщаем мастеру.
    workerManager.emit('newTask', req.body.taskText.replace('/n',''));
    workerManager.once('sendNewFinisTask', function (newTask) {
        res.send(!newTask.error ? newTask : newTask.error);
        res.end();
    })
});

module.exports = router;