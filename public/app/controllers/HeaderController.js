siteApp.controller('headerController', ['$scope', '$rootScope', 'userService', function ($scope, $rootScope, userService) {
    this.logoutUser = function () {
        userService.logoutUser($rootScope.currentUser.userId).then(function (user) {
            $rootScope.currentUser = user;
        })
    };
    return $scope.headerController = this;
}]);