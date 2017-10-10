let express = require('express'),
    router = express.Router(),
    path = require('path');


var cluster = require('cluster');

router.get('/', function(req, res) {
    console.log(req.sesion)
    res.sendFile(path.resolve('../public/index.html'));
    console.log(cluster.isMaster);
    console.log('main page');
});

// router.get('/login', function (req, res) {
//     res.sendFile(path.resolve('../public/index.html'));
//     console.log('login page');
// })

router.get('/workers',function (req, res) {
    console.log('worker page');
});

router.post('/new-message', function(req, res) {
    // console.log('reg',req);
});


module.exports = router;