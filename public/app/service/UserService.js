siteApp.factory('userService', ['$cookies', '$rootScope', 'Http', '$q', function($cookies, $rootScope, Http, $q) {
    var userService = {
        initUser: function () {
            var currentUser = $cookies.get('authUser');
            if(currentUser != null){
                return JSON.parse(currentUser);
            }else {
                return null;
            }
        },
        loginUser: function (name, password) {
            var deferred =  $q.defer();
            Http.post('/api/login',{
                userName: name,
                userPassword: password
            }).then(function (response) {
                $cookies.put('authUser', JSON.stringify({
                    'userName': response.data.userName,
                    'userPassword': response.data.userPassword,
                    'userId': response.data._id
                }));
                deferred.resolve(response.data);
            })
            return deferred.promise;
        },
        logoutUser: function (currentUserId) {
            var deferred =  $q.defer();
            Http.get('/api/logout',{
                userId: currentUserId
            }).then(function (response) {
                if(response.status == 200){
                    deferred.resolve(null);
                }
            });
            return deferred.promise;
        }
    }
    return userService;
}]);