var app = angular.module('congress', ['angularUtils.directives.dirPagination', 'ui.bootstrap', 'angular.filter']);
app.run(function($rootScope) {
    $rootScope.favoriteLegislators = JSON.parse(localStorage.getItem("favLegs"));
    $rootScope.favBill = JSON.parse(localStorage.getItem("favBills"));
    $rootScope.favoriteCommittees = JSON.parse(localStorage.getItem("favComs"));
});

app.controller("legDataCtrl", ['$scope', '$http', 'filterFilter', '$rootScope', function ($scope, $http, filterFilter, $rootScope) {
    
    $http({
        method: 'GET',
        url: 'congress.php',
        params: {
            dbType: "legislators"
        }
    }).success(function (data) {
        $scope.legData = data.results;
        $scope.state = data.results;
        $scope.house = data.results;
        $scope.senate = data.results;
        $scope.stateNames = data.results;
        
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.maxSize = 5;
        $scope.totalItems = data.results.length;
    });
    $scope.filterState = function (term) {
        if(angular.isUndefined(term) || term == null) {
            term = "";
            
        } 
        var obj = {
            state_name: term.state_name
        };

        $scope.state = filterFilter($scope.legData, obj);
    };
    
    $scope.orderBy = function(array, key) {
        var sorted = array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        return sorted;
    };
    
    $scope.viewLegislatorDetails = function (legJson) {
        viewLegDetails(legJson, $scope, $http)
    };
    $scope.star = '#ffffff';
    $scope.favoriteLegs = function(legJson, favbutton){
        
        var elem = favbutton.target;
        //$(elem.id).removeClass('fa-star-o');
        //$(elem.id).addClass('fa-star');
        $scope.star = 'yellow';
        var curFavLegs = JSON.parse(localStorage.getItem("favLegs"));
        var exists = false;
        if(curFavLegs == null) {
            curFavLegs = [];
            curFavLegs.push(legJson);
        } else {
            angular.forEach(curFavLegs, function(value, key) {
                if(value.bioguide_id == legJson.bioguide_id) {
                    exists = true;  
                }
            });
            if(!exists) {
                curFavLegs.push(legJson);
            }
        }
        localStorage.setItem("favLegs", JSON.stringify(curFavLegs));
        $rootScope.favoriteLegislators = JSON.parse(localStorage.getItem("favLegs"));
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
app.controller("billDataCtrl", ['$scope', '$http', 'filterFilter', '$sce', '$rootScope', function ($scope, $http, filterFilter, $sce, $rootScope) { 
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.maxSize = 5;
        
    $http({
        method: 'GET',
        url: 'congress.php',
        params: {
            dbType: "bills",
            activeStatus: "true"
        }
    }).success(function (data) {
        $scope.activeBills = data.results;
        $scope.totalItems += data.results.length;
    });
    $http({
        method: 'GET',
        url: 'congress.php',
        params: {
            dbType: "bills",
            activeStatus: "false"
        }
    }).success(function (data) {
        $scope.newBills = data.results;
        $scope.totalItems += data.results.length;
    });
    $scope.star = '#ffffff';
    $scope.favoriteBill = function(billJson){
        
        var curFavBills = JSON.parse(localStorage.getItem("favBills"));
        var exists = false;
        $scope.star = 'yellow';
        if(curFavBills == null) {
            curFavBills = [];
            curFavBills.push(billJson);
        } else {
            angular.forEach(curFavBills, function(value, key) {
                if(value.bill_id == billJson.bill_id) {
                    exists = true;  
                }
            });
            if(!exists) {
                curFavBills.push(billJson);
            }
        }
        localStorage.setItem("favBills", JSON.stringify(curFavBills));
        $rootScope.favBill = JSON.parse(localStorage.getItem("favBills"));
    };
    $scope.viewBillDetails = function (billJson) {
        $scope.billDetails = billJson;
        $scope.pdf = $sce.trustAsResourceUrl(billJson.last_version.urls.pdf);
    };
    
}]);

app.controller("comDataCtrl", ['$scope', '$http', 'filterFilter', '$rootScope', function ($scope, $http, filterFilter, $rootScope) {    
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
    $scope.star = '#ffffff';
    $scope.favoriteCommittee = function(comJson){
        
        var curFavComs = JSON.parse(localStorage.getItem("favComs"));
        var exists = false;
        $scope.star = 'yellow';
        if(curFavComs == null) {
            curFavComs = [];
            curFavComs.push(comJson);
        } else {
            
            angular.forEach(curFavComs, function(value, key) {
                if(value.committee_id == comJson.committee_id) {
                    exists = true;  
                }
            });
            if(!exists) {
                curFavComs.push(comJson);
            }
        }
        localStorage.setItem("favComs", JSON.stringify(curFavComs));
        $rootScope.favoriteCommittees = JSON.parse(localStorage.getItem("favComs"));
    };
}]);
app.controller("favDataCtrl", ['$scope', 'filterFilter', '$rootScope', '$http', '$sce', function ($scope, filterFilter, $rootScope, $http, $sce) {    
  
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.maxSize = 5;
    $scope.favoriteBills = $rootScope.favBill;
    $scope.favoriteComs = $rootScope.favoriteCommittees;
    $scope.favoriteLegs = $rootScope.favoriteLegislators;
    
    $scope.$watch("favoriteLegislators", function() {
        $scope.favoriteLegs = $rootScope.favoriteLegislators;
    });
    $scope.$watch("favBill", function() {
        $scope.favoriteBills = $rootScope.favBill;
    });
    $scope.$watch("favoriteCommittees", function() {
        $scope.favoriteComs = $rootScope.favoriteCommittees;
    });
    $scope.removeFavorite = function(dbType, item) {
        var index = 0;
        if('Legislators' == dbType) {
            index =$scope.favoriteLegs.indexOf(item)
            $scope.favoriteLegs.splice(index,1);  
            localStorage.setItem("favLegs", JSON.stringify($scope.favoriteLegs));
        } else if('Bills' == dbType) {
            index=$scope.favoriteBills.indexOf(item)
            $scope.favoriteBills.splice(index,1); 
            localStorage.setItem("favBills", JSON.stringify($scope.favoriteBills));
        } else if('Committees' == dbType) {
            index=$scope.favoriteComs.indexOf(item)
            $scope.favoriteComs.splice(index,1);  
            localStorage.setItem("favComs", JSON.stringify($scope.favoriteComs));
        }
    };
    $scope.viewBillDetails = function (billJson) {
        $scope.billDetails = billJson;
        $scope.pdf = $sce.trustAsResourceUrl(billJson.last_version.urls.pdf);
    };
    $scope.viewLegislatorDetails = function (legJson) {
        viewLegDetails(legJson, $scope, $http)
    };
    
}]);
app.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1) : '';
    }
});
function getTermCompletePercentage(startDate, endDate) {
    var start = new Date(startDate), 
    end = new Date(endDate), 
    today = new Date(), 
    percentComplete = Math.round(((today - start) / (end - start)) * 100);
    return percentComplete;
}
function viewLegDetails (legJson, $scope, $http) {

    $scope.legDetails = legJson;
    $scope.percTermComp = getTermCompletePercentage(legJson.term_start, legJson.term_end);
    $http({
    method: 'GET',
    url: 'congress.php',
    params: {
        dbType: "bills",
        sponsor_id: legJson.bioguide_id
    }
    }).success(function (data) {
        $scope.legBills = data.results;
    });
    $http({
    method: 'GET',
    url: 'congress.php',
    params: {
        dbType: "committees",
        member_id: legJson.bioguide_id
    }
    }).success(function (data) {
        $scope.legComs = data.results;
    });
};
$(document).ready(function () {
   /*Menu-toggle*/
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        if(!$('#main-navbar').hasClass("hide")) {
            $('#page-content').css("padding-top", "0");
        } else {
            $('#page-content').css("padding-top", "50px");
        }
        $("#main-navbar").toggleClass("hide");
        $('#page-content').toggleClass("col-sm-10");
        $('#page-content').toggleClass("col-sm-12");
        $('#page-content').toggleClass("col-lg-10");
        $('#page-content').toggleClass("col-lg-12");
        $('#page-content').toggleClass("col-xs-3");
        $('#page-content').toggleClass("col-xs-9");
        
    });
    
    $("#myCarousel").carousel({
        interval: false
    });
});
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
