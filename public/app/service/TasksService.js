siteApp.factory('taskService', ['Http', '$q', function(Http, $q) {
    var taskService = {
        createTask: function (task) {
            var deferred = $q.defer();
            Http.post('/api/create-task',{'taskText': task}).then(function (res) {
                deferred.resolve(res.data);
            },function (err) {
                deferred.reject();
            });
            return deferred.promise;
        },
        getTasks: function () {
            var deferred = $q.defer();
            Http.get('api/get-tasks').then(function (res) {
                deferred.resolve(res.data);
                console.log('tasks', res);
            },function (err) {
                deferred.reject();
            })
            return deferred.promise;
        }
    }
    return taskService;
}]);
