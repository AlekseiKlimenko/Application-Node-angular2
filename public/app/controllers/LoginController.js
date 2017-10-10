siteApp.controller('loginController', ['$scope', '$rootScope', 'userService', '$state',
    function ($scope, $rootScope, userService, $state) {
    this.sendLoginForm = function () {
        if($rootScope.currentUser == null){
            userService.loginUser(this.userName, this.userPassword).then(function (user) {
                $rootScope.currentUser = user;
                $state.go('tasks');
            })
        }
    }
    return $scope.loginController = this;
}]);