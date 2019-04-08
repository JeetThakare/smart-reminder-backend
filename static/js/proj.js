var projApp = angular.module('projApp', ['projApp']);


projApp.controller('projController', function projController($scope, $http, $timeout, $filter) {
    $scope.list = [];
    $http.defaults.headers.post["Content-Type"] = "application/json";
    $http.get("/project/reminders")
        .then(function successCallback(response) {
            $scope.list = response.data;
            console.log($scope.list)
        }, function errorCallback(response) {
            console.log("Unable to perform get request");
        });

    createNotifications = function() {
        console.log($scope.reminder);
        console.log($scope.show_on);
        let dateSplit = $scope.show_on.toString().split(" ");
        let year = dateSplit[3];
        let month = dateSplit[1];
        let day = dateSplit[2];
        this.date = day + "-" + month + "-" + year;
        console.log(this.name, this.date);
        let obj = {
            "reminder": $scope.reminder,
            "show_on": this.date
        }
        angular.element('#myModal').modal('hide');
        $http({
                url: '/project/createreminder',
                method: "POST",
                data: obj
            })
            .then(function(response) {
                    if (response.data.status) {
                        $scope.list = response.data;
                    } else {
                        alert("error adding reminder");
                    }
                },
                function(response) { // optional
                    console.log("Unable to perform post request");
                });
    }
})