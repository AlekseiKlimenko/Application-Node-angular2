siteApp.controller('taskController', ['$scope', '$rootScope', 'taskService', '$timeout', function ($scope, $rootScope, taskService, $timeout) {
    var self = this;
    this.allTasks = [],
    this.infoMsgError = '',
    this.createTaskSuccess = '';

    this.createTask = function () {
        taskService.createTask(this.taskText).then(function (newTask) {
            if(angular.isObject(newTask)){
                self.allTasks.push(newTask);
                self.infoMsgError = '';
                self.taskText = '';
                self.createTaskSuccess = 'creating a task successfully';
                $timeout(function () {
                    self.createTaskSuccess = '';
                },2000);
            }else {
                self.infoMsgError = newTask;
            }
        })
    };

    this.getTasks = function () {
        taskService.getTasks().then(function(tasks){
            self.allTasks = tasks;
        })
    };

    return $scope.taskController = this;
}]);