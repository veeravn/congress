var app = angular.module('congress', ['angularUtils.directives.dirPagination', 'ui.bootstrap']);
app.controller("legDataCtrl", ['$scope', '$http', 'filterFilter', function ($scope, $http, filterFilter) {
    $http({
        method: 'GET',
        url: 'congress.php',
        params: {
            dbType: "legislators"
        }
    }).success(function (data) {
        $scope.legData = data.results;
        $scope.state = $scope.orderBy(data.results, 'state_name');
        $scope.house = $scope.orderBy(data.results, 'last_name');
        $scope.senate = $scope.orderBy(data.results, 'last_name');
        
        
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.maxSize = 5;
        $scope.totalItems = data.results.length;
    });
    
    $scope.$watch('stateFilter', function (term) {
        if(angular.isUndefined(term)) {
            term = "";
            
        } 
        var obj = {
            state_name: term
        };

        $scope.state = filterFilter($scope.legData, obj);
        $scope.currentPage = 0;
    });
    $scope.orderBy = function(array, key) {
        var sorted = array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        return sorted;
    };
    function getTermCompletePercentage(startDate, endDate) {
        var start = new Date(startDate), 
        end = new Date(endDate), 
        today = new Date(), 
        percentComplete = Math.round(((today - start) / (end - start)) * 100) + '%';
        return percentComplete;
    };
    $scope.viewLegislatorDetails = function (legJson) {
        var legPersonalDetailsTable = "",
        legCommittessTable = "",
        legBillsTable = "";
        $scope.legDetails = legJson;
        $scope.percTermComp = getTermCompletePercentage(legJson.term_start, legJson.term_end);
    };
    
    
    
}]).filter('start', function () {
    return function (input, start) {
        if (!input || !input.length) {
            return;
        }
        start = +start;
        return input.slice(start);
    };
});
app.controller("billDataCtrl", ['$scope', '$http', 'filterFilter', function ($scope, $http, filterFilter) {    
    $http({
        method: 'GET',
        url: 'congress.php',
        params: {
            dbType: "bills"
        }
    }).success(function (data) {
        $scope.billData = data.results;
        $scope.bills = $scope.orderBy(data.results, 'bill_id');
        
        
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.maxSize = 5;
        $scope.totalItems = data.results.length;
    });
    $scope.orderBy = function(array, key) {
        var sorted = array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        return sorted;
    }
}]);

app.controller("comDataCtrl", ['$scope', '$http', 'filterFilter', function ($scope, $http, filterFilter) {    
    $http({
        method: 'GET',
        url: 'congress.php',
        params: {
            dbType: "committees"
        }
    }).success(function (data) {
        $scope.coms = data.results;
        $scope.committees = $scope.orderBy(data.results, 'committee_id');
        
        
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.maxSize = 5;
        $scope.totalItems = data.results.length;
    });
    $scope.orderBy = function(array, key) {
        var sorted = array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        return sorted;
    }
}]);

app.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1) : '';
    }
});
$(document).ready(function () {
   /*Menu-toggle*/
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#main-navbar").toggleClass("hide");
        $('#page-content').toggleClass("col-sm-10");
        $('#page-content').toggleClass("col-sm-12");
        $('#page-content').toggleClass("col-lg-10");
        $('#page-content').toggleClass("col-lg-12");
    });
    
    $("#myCarousel").carousel({
        interval: false
    });
});

function viewLegislatorDetails(legJson) {
    var legPersonalDetailsTable = "",
        legCommittessTable = "",
        legBillsTable = "";
    legPersonalDetailsTable += "table class='table table-hover' id='legPersonalTable' style='width:50%'><tbody><tr>";
    legPersonalDetailsTable += "<td>https://theunitedstates.io/images/congress/original/"+legJson.bioguide_id +".jpg";
    legPersonalDetailsTable += "</td><td>";
    legPersonalDetailsTable += "<table class='table'><tbody><tr><td>";
    legPersonalDetailsTable += "full name";
    legPersonalDetailsTable += "</td></tr><tr><td>email</td></tr>";
    legPersonalDetailsTable += "<tr><td>Chamber:</td></tr>";
    legPersonalDetailsTable += "<tr><td>Party</td></tr>";
    legPersonalDetailsTable += "</tbody></table></td>";
    legPersonalDetailsTable += "</tr></tbody></table>";
    ("#legPersonalDetails").html(legPersonalDetailsTable);
}
function billsTab() {
    if($("#billContent").hasClass("hide")) {
        $("#billContent").toggleClass("hide");
    }
    if(!$("#legContent").hasClass("hide")) {
        $("#legContent").toggleClass("hide");
    }
    if(!$("#favoritesContent").hasClass("hide")) {
        $("#favoritesContent").toggleClass("hide");
    }
    if(!$("#committeeContent").hasClass("hide")) {
        $("#committeeContent").toggleClass("hide");
    }
}
function legislatorTab() {
    if($("#legContent").hasClass("hide")) {
        $("#legContent").toggleClass("hide");
    }
    if(!$("#billContent").hasClass("hide")) {
        $("#billContent").toggleClass("hide");
    }
    if(!$("#favoritesContent").hasClass("hide")) {
        $("#favoritesContent").toggleClass("hide");
    }
    if(!$("#committeeContent").hasClass("hide")) {
        $("#committeeContent").toggleClass("hide");
    }
}
function committeeTab() {
    if($("#committeeContent").hasClass("hide")) {
        $("#committeeContent").toggleClass("hide");
    }
    if(!$("#legContent").hasClass("hide")) {
        $("#legContent").toggleClass("hide");
    }
    if(!$("#billContent").hasClass("hide")) {
        $("#billContent").toggleClass("hide");
    }
    if(!$("#favoritesContent").hasClass("hide")) {
        $("#favoritesContent").toggleClass("hide");
    }
}
function favoritesTab() {
    if($("#favoritesContent").hasClass("hide")) {
        $("#favoritesContent").toggleClass("hide");
    }
    if(!$("#legContent").hasClass("hide")) {
        $("#legContent").toggleClass("hide");
    }
    if(!$("#billContent").hasClass("hide")) {
        $("#billContent").toggleClass("hide");
    }
    if(!$("#committeeContent").hasClass("hide")) {
        $("#committeeContent").toggleClass("hide");
    }
}