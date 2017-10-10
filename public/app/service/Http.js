siteApp.factory('Http',[ "$http", "$q", function($http, $q) {

    var Http = {},
        urlsStatus = {};

    $http.defaults.headers.post.Accept =  "*/*";
    $http.defaults.headers.post['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8";

    Http.post = function(url, data) {
        var deffered = $q.defer();

        data = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }).join('&');

        $http({
            method: 'POST',
            url: url,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (res) {
           deffered.resolve(res);
        },function (error) {
            deffered.reject(error);
        });
        return deffered.promise;
    };



    Http.put = function(url, data) {
        var deffered = $q.defer();

        data = $.param(data);

        $http({
            method: 'PUT',
            url: url,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function (response) {

            deffered.resolve(response);
        }).error(function(response, status) {

            deffered.reject(response);
        });

        return deffered.promise;
    };

    Http.get = function(url, dataObj) {
        var deffered = $q.defer();

        dataObj = dataObj || {};

        url += "?";

        angular.forEach(dataObj, function(value, key) {
            url += (key + "=" + value + "&")
        });

        if(url[url.length-1] === "&" || url[url.length-1] === "?") {
            url = url.slice(0, -1);
        }

        if(!angular.isObject(urlsStatus[url]) ||
            urlsStatus[url].status == false
        ) {

            urlsStatus[url] = {
                status: true,
                promise: deffered.promise
            };

        } else {

            return urlsStatus[url].promise;
        }

        $http.get(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(function (res) {
            deffered.resolve(res);
        },function(error){
            deffered.reject(error);
        });

        return deffered.promise;
    };
    return Http;
}]);