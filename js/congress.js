var app = angular.module('congress', ['angularUtils.directives.dirPagination', 'angular.filter']);
app.controller("legDataCtrl", ['$scope', '$http', 'filterFilter', function ($scope, $http, filterFilter) {
    $http({
        method: 'GET',
        url: 'congress.php',
        params: {
            dbType: "legislators"
        }
    }).success(function (data) {
        $scope.legData = data.results;
        $scope.stateSorted = data.results;
        $scope.lastNameSorted = data.results;
        $scope.stateSorted = $scope.orderBy($scope.stateSorted, 'state_name');
        $scope.lastNameSorted = $scope.orderBy(data.results, 'last_name');
        
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.totalItems = data.results.length;
    });
    $scope.$watch('searchKeyword', function (term) {
        if(angular.isUndefined(term)) {
            term = "";
            
        } 
        var obj = {
            $: term
        };
        $scope.lastNameSorted = filterFilter($scope.legData, obj);
        $scope.currentPage = 1;
    });
    $scope.$watch('stateFilter', function (term) {
        if(angular.isUndefined(term)) {
            term = "";
            
        } 
        var obj = {
            state_name: term
        };

        $scope.stateSorted = filterFilter($scope.legData, obj);
        $scope.currentPage = 0;
    });
    $scope.orderBy = function(array, key) {
        var sorted = array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        return sorted;
    }
}]).filter('start', function () {
    return function (input, start) {
        if (!input || !input.length) {
            return;
        }
        start = +start;
        return input.slice(start);
    };
});

app.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1) : '';
    }
});
$(document).ready(function () {
   /*Menu-toggle*/
    $("#menu-toggle").click(function(e) {
        $("#main-navbar").toggleClass("hide");
        $('#page-content').toggleClass("col-sm-10");
        $('#page-content').toggleClass("col-sm-12");
    });
    
    $("#myCarousel").carousel({
        interval: false
    });
});

function viewLegislatorDetails(legJson) {
    var legPersonalDetailsTable = "",
        legCommittessTable = "",
        legBillsTable = "";
}