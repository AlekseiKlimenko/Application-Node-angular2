let Datastore = require('nedb'),
    users =  new Datastore({filename : 'users'}),
    tasks =  new Datastore({filename : 'tasks'});

users.loadDatabase();
tasks.loadDatabase();

users.ensureIndex({fieldName: 'userName'});

module.exports.users = users;
module.exports.tasks = tasks;