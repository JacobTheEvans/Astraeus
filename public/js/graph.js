var app = angular.module("main.graph",["ngRoute"]);

app.config(["$routeProvider", function($routeProvider) {
  $routeProvider.when("/graph", {
    templateUrl: "/views/templates/graph.tpl.html",
    controller: "graphController"
  })
}]);


app.controller("graphController", ["$scope", "$timeout", "dataRequests", function($scope,$timeout,dataRequests) {
  $scope.feq = 10;
  $scope.yLabel = "Temperature";
  $scope.dataToPlot = [];
  $scope.type = "max_temp";
  $scope.displayName = "Highest Temperature Fahrenheit";
  $scope.setType = function(type) {
    $(".mdl-layout__drawer").toggleClass("is-visible")
    $scope.type = type;
    if(type == "min_temp_fahrenheit") {
      $scope.displayName = "Lowest Temperature Fahrenheit";
      $scope.yLabel = "Temperature";
    } else if(type == "max_temp_fahrenheit") {
      $scope.displayName = "Highest Temperature Fahrenheit";
      $scope.yLabel = "Temperature";
    } else if(type == "min_temp") {
      $scope.displayName == "Lowest Temperature Celsius";
      $scope.yLabel = "Temperature";
    } else if(type == "max_temp") {
      $scope.displayName = "Highest Temperature Celsius";
      $scope.yLabel = "Temperature";
    } else if(type == "pressure") {
      $scope.displayName = "Average Pressure";
      $scope.yLabel = "Pressure";
    }
    dataRequests.getData($scope.setData,$scope.logError);
  };
  $scope.setData = function(response) {
    $scope.dataToPlot = [];
    var counter = 0;
    for(var i = 0; i < response.data.length; i++, counter++) {
      var date = new Date(response.data[i].terrestrial_date);
      if(counter == $scope.feq) {
        var average = 0;
        var sample = response.data.slice( i - counter, i);
        for(var x = 0; x < sample.length; x++) {
          average += sample[x][$scope.type];
        }
        average = Math.floor(average / sample.length);
        $scope.dataToPlot.push({key:$scope.type, value: average, date: date.getFullYear() + "/" + date.getMonth() + "/" + date.getDay()});
        counter = 0;
      }
    }
  };
  $scope.$watch("feq", function() {
    dataRequests.getData($scope.setData,$scope.logError);
  });
  $scope.logError = function(response) {
    console.log("Error", response.status, response.data);
  };
  $scope.$on('$viewContentLoaded', () => {
    $timeout(() => {
      componentHandler.upgradeAllRegistered();
      dataRequests.getData($scope.setData,$scope.logError);
    })
  });
}])
