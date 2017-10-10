var siteApp = angular.module('siteApp', [
    'ui.router',
    'ngCookies'
])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$cookiesProvider',


    function ($stateProvider, $urlRouterProvider, $locationProvider, $cookiesProvider) {

        var now = new Date(),
            exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());

        $cookiesProvider.defaults.path = "/";
        $cookiesProvider.defaults.expires = exp;

        $stateProvider
            .state('tasks', {
                url: '/',
                templateUrl: '/static/view/tasks.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/static/view/login.html'
            })
            .state('createTask', {
                url: '/create-task',
                templateUrl: '/static/view/create-task.html',
                authenticate: true
            })
    $urlRouterProvider.otherwise('tasks');
    $locationProvider.hashPrefix('');
}])
.run(['$rootScope', '$state', 'userService', function($rootScope, $state, userService) {
    $rootScope.currentUser = userService.initUser();
    $rootScope.$on('$stateChangeStart', function(event, next) {
        if (next.authenticate && !$rootScope.currentUser) {
            event.preventDefault();
            $state.go('tasks');
        }
    });
}]);
