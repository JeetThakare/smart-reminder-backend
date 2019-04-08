var bartApp = angular.module('bartApp', ['bartApp']);

// goodreadApp.config(function ($interpolateProvider) {
//     $interpolateProvider.startSymbol('[[');
//     $interpolateProvider.endSymbol(']]');
// });

bartApp.controller('bartController', function bartController($scope, $http, $timeout, $filter) {
    $scope.runmodelLoader = false;
    $scope.stations = null;
    $scope.trainTrips = [];
    $scope.stationDetails = null;
    $scope.counts = 0;
    var s = null;
    var d = null;

    if (localStorage.getItem("count") === null) {
        localStorage.setItem("count", '1');
    } else {
        let count = Number(localStorage.getItem("count")) + 1;
        $scope.counts = count.toString();
        localStorage.setItem("count", $scope.counts);
    }
    setTimeout(() => {
        $scope.isCount = false;
    }, 5000);

    sourceselect = function() {
        if ($scope.selectedSource == null || $scope.selectedSource == "") {
            return
        }
        console.log($scope.selectedSource)
        if ($scope.selectedDest != null || $scope.selectedDest != "") {

        }
        getStationDetails();
        getTrips();
    }

    destselect = function() {

        if ($scope.selectedDest == null || $scope.selectedDest == "") {
            return
        }
        console.log($scope.selectedDest)
        if ($scope.selectedSource != null || $scope.selectedSource != "") {
            getTrips();
        }
    }

    $http.get("/stations")
        .then(function successCallback(response) {
            $scope.stations = response.data;
            console.log($scope.stations)
        }, function errorCallback(response) {
            console.log("Unable to perform get request");
        });


    getTrips = function() {
        console.log("From " + $scope.selectedSource + " to " + $scope.selectedDest)
        if ($scope.selectedSource == null || $scope.selectedDest == null) {
            return
        }
        $http.get("/trips/" + $scope.selectedSource + "/" + $scope.selectedDest)
            .then(function successCallback(response) {
                console.log("got trips")
                $scope.trainTrips = response.data.data;
                console.log($scope.trainTrips);
                getCounter();
                getDirection();
            }, function errorCallback(response) {
                console.log("Unable to perform get request");
            });

    }

    getStationDetails = function() {
        $http.get("/station/" + $scope.selectedSource)
            .then(function successCallback(response) {
                $scope.stationDetails = response.data.data;
                console.log(response.data.data)
            }, function errorCallback(response) {
                console.log("Unable to perform get request");
            });
    }

    setInterval(function() { getTrips() }, 30000);
    // Refresh pagedata in 30 secs

    timer = $timeout(function() {
        $scope.counter--;
        if ($scope.counter > 0) {
            mytimeout = $timeout($scope.onTimeout, 1000);
        } else {
            // $timeout(function() { $scope.displayErrorMsg = false; }, 30000);
            getTrips();
        }
    }, 1000);

    $scope.onTimeout = function() {
        $scope.counter--;
        if ($scope.counter > 0) {
            mytimeout = $timeout($scope.onTimeout, 1000);
        } else {
            // $timeout(function() { $scope.displayErrorMsg = false; }, 30000);
            getTrips();
        }
    }


    getCounter = function() {
        // counter
        var date = new Date();
        let h = date.getHours() % 12 || 12;
        let m = date.getMinutes();
        let seconds = h * 60 * 60 + m * 60;
        console.log($scope.trainTrips);
        let time = $scope.trainTrips.request.trip[0]["@origTimeMin"];
        let split = time.split(" ");
        let timeSplit = split[0].trim();
        let time1 = timeSplit.split(":");
        let hours = time1[0].trim();
        let min = time1[1].trim();
        let timeLeft = (hours * 60 * 60 + min * 60) - (seconds);
        if (timeLeft < 0) {
            timeLeft = -(timeLeft);
        }
        $scope.nextTrain = {
            "leftTime": timeLeft
        }
        console.log("Train leaves in " + $scope.nextTrain.leftTime)
        $scope.counter = $scope.nextTrain.leftTime;

        // $timeout.cancel($scope.onTimeout);
        $timeout($scope.onTimeout, 1000);
    }

    function getDirection() {

        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            mapTypeId: google.maps.MapTypeId.TRANSIT
        });

        directionsDisplay.setMap(map);

        $scope.stations.data.station.forEach(element => {
            console.log(element)
            if (element.abbr == $scope.selectedSource) {
                s = element
            }
            if (element.abbr == $scope.selectedDest) {
                d = element
            }
        });
        console.log(s)
        console.log(d)
        var source = new google.maps.LatLng(
            s.gtfs_latitude,
            s.gtfs_longitude);
        var dest = new google.maps.LatLng(
            d.gtfs_latitude,
            d.gtfs_longitude);
        var request = {
            origin: source,
            destination: dest,
            travelMode: google.maps.DirectionsTravelMode.TRANSIT
        };

        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }
});