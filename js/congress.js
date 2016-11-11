var app = angular.module('congress', ['angularUtils.directives.dirPagination', 'ui.bootstrap']);
app.run(function($rootScope) {
    $rootScope.favoriteLegislators = JSON.parse(localStorage.getItem("favLegs"));
    $rootScope.favBill = JSON.parse(localStorage.getItem("favBills"));
    $rootScope.favoriteCommittees = JSON.parse(localStorage.getItem("favComs"));
    
});

app.controller("legDataCtrl", ['$scope', '$http', 'filterFilter', '$rootScope', function ($scope, $http, filterFilter, $rootScope) {
    $scope.usStates = [
    { name: 'ALABAMA', abbreviation: 'AL'},
    { name: 'ALASKA', abbreviation: 'AK'},
    { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
    { name: 'ARIZONA', abbreviation: 'AZ'},
    { name: 'ARKANSAS', abbreviation: 'AR'},
    { name: 'CALIFORNIA', abbreviation: 'CA'},
    { name: 'COLORADO', abbreviation: 'CO'},
    { name: 'CONNECTICUT', abbreviation: 'CT'},
    { name: 'DELAWARE', abbreviation: 'DE'},
    { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
    { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
    { name: 'FLORIDA', abbreviation: 'FL'},
    { name: 'GEORGIA', abbreviation: 'GA'},
    { name: 'GUAM', abbreviation: 'GU'},
    { name: 'HAWAII', abbreviation: 'HI'},
    { name: 'IDAHO', abbreviation: 'ID'},
    { name: 'ILLINOIS', abbreviation: 'IL'},
    { name: 'INDIANA', abbreviation: 'IN'},
    { name: 'IOWA', abbreviation: 'IA'},
    { name: 'KANSAS', abbreviation: 'KS'},
    { name: 'KENTUCKY', abbreviation: 'KY'},
    { name: 'LOUISIANA', abbreviation: 'LA'},
    { name: 'MAINE', abbreviation: 'ME'},
    { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
    { name: 'MARYLAND', abbreviation: 'MD'},
    { name: 'MASSACHUSETTS', abbreviation: 'MA'},
    { name: 'MICHIGAN', abbreviation: 'MI'},
    { name: 'MINNESOTA', abbreviation: 'MN'},
    { name: 'MISSISSIPPI', abbreviation: 'MS'},
    { name: 'MISSOURI', abbreviation: 'MO'},
    { name: 'MONTANA', abbreviation: 'MT'},
    { name: 'NEBRASKA', abbreviation: 'NE'},
    { name: 'NEVADA', abbreviation: 'NV'},
    { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
    { name: 'NEW JERSEY', abbreviation: 'NJ'},
    { name: 'NEW MEXICO', abbreviation: 'NM'},
    { name: 'NEW YORK', abbreviation: 'NY'},
    { name: 'NORTH CAROLINA', abbreviation: 'NC'},
    { name: 'NORTH DAKOTA', abbreviation: 'ND'},
    { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
    { name: 'OHIO', abbreviation: 'OH'},
    { name: 'OKLAHOMA', abbreviation: 'OK'},
    { name: 'OREGON', abbreviation: 'OR'},
    { name: 'PALAU', abbreviation: 'PW'},
    { name: 'PENNSYLVANIA', abbreviation: 'PA'},
    { name: 'PUERTO RICO', abbreviation: 'PR'},
    { name: 'RHODE ISLAND', abbreviation: 'RI'},
    { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
    { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
    { name: 'TENNESSEE', abbreviation: 'TN'},
    { name: 'TEXAS', abbreviation: 'TX'},
    { name: 'UTAH', abbreviation: 'UT'},
    { name: 'VERMONT', abbreviation: 'VT'},
    { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
    { name: 'VIRGINIA', abbreviation: 'VA'},
    { name: 'WASHINGTON', abbreviation: 'WA'},
    { name: 'WEST VIRGINIA', abbreviation: 'WV'},
    { name: 'WISCONSIN', abbreviation: 'WI'},
    { name: 'WYOMING', abbreviation: 'WY' }
];
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
        
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.maxSize = 5;
        $scope.totalItems = data.results.count;
    });
    $scope.filterState = function (term) {
        if(angular.isUndefined(term) || term == null) {
            term = "";
            
        } 
        var obj = {
            state_name: term.name
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
        
        $scope.star = checkFavorite('legislators', legJson.bioguide_id)
        viewLegDetails(legJson, $scope, $http)
    };
    
    $scope.favoriteLegs = function(legJson, favbutton){

        var elem = favbutton.target;
        console.log(elem.id);
        var exists = false;
        var curFavLegs = JSON.parse(localStorage.getItem("favLegs"));
        
        if(curFavLegs == null) {
            curFavLegs = [];
            $scope[legJson.bioguide_id] = true;
            curFavLegs.push(legJson);
        } else {
            if(!$scope[legJson.bioguide_id]) {
                
                $scope[legJson.bioguide_id] = true;
                angular.forEach(curFavLegs, function(value, key) {
                    if(value.bioguide_id == legJson.bioguide_id) {
                        exists = true;  
                    }
                });
                if(!exists) {
                    curFavLegs.push(legJson);
                }
            } else {
                
                $scope[legJson.bioguide_id] = false;
                removeFavLeg(legJson);
                $rootScope.favoriteLegislators = JSON.parse(localStorage.getItem("favLegs"));
                $scope.star = checkFavorite('legislators', legJson.bioguide_id);
                return;
            }
        }
        
        
        localStorage.setItem("favLegs", JSON.stringify(curFavLegs));
        $rootScope.favoriteLegislators = JSON.parse(localStorage.getItem("favLegs"));
        $scope.star = checkFavorite('legislators', legJson.bioguide_id);
        
        
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
function removeFavLeg (legislatorJson) {
    var curFavLegs = JSON.parse(localStorage.getItem("favLegs"));
    var index = -1;
    var exists = false;
    angular.forEach(curFavLegs, function(value, key) {
        
        if(!exists) {
            index++;
            if(value.bioguide_id == legislatorJson.bioguide_id) {
                exists = true;
            }
        }
    });
    if(index >= 0) {
        curFavLegs.splice(index,1);  
    }
    localStorage.setItem("favLegs", JSON.stringify(curFavLegs));
    
}
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
        $scope.totalItems += data.results.count;
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
        $scope.totalItems += data.results.count;
    });
    $scope.favoriteBill = function(billJson, favbutton){
        console.log(favbutton.target.id);
        
        var elem = favbutton.target;
        
        var curFavBills = JSON.parse(localStorage.getItem("favBills"));
        var exists = false;
        
        if(curFavBills == null) {
            curFavBills = [];
            $scope[billJson.bill_id] = true;
            curFavBills.push(billJson);
        } else {
            if(!$scope[billJson.bill_id]) {
                $scope[billJson.bill_id] = true;
                angular.forEach(curFavBills, function(value, key) {
                    if(value.bill_id == billJson.bill_id) {
                        exists = true;  
                    }
                });
                if(!exists) {
                    curFavBills.push(billJson);
                }
            } else {
                
                $scope[billJson.bill_id] = false;
                removeFavBill(billJson);
                $rootScope.favBill = JSON.parse(localStorage.getItem("favBills"));
                $scope.star = checkFavorite('bills', billJson.bill_id);
                return;
            }
        }
        localStorage.setItem("favBills", JSON.stringify(curFavBills));
        $rootScope.favBill = JSON.parse(localStorage.getItem("favBills"));
        $scope.star = checkFavorite('bills', billJson.bill_id);
    };
    $scope.viewBillDetails = function (billJson) {
        $scope.billDetails = billJson;
        $scope.star = checkFavorite('bills', billJson.bill_id)
        $scope.pdf = $sce.trustAsResourceUrl(billJson.last_version.urls.pdf);
    };
    
}]);
function removeFavBill (billJson) {
    var curFavBills = JSON.parse(localStorage.getItem("favBills"));
    var index = -1;
    var exists = false;
    angular.forEach(curFavBills, function(value, key) {
        
        if(!exists) {
            index++;
            if(value.bill_id == billJson.bill_id) {
                exists = true;
            }
        }
    });
    if(index >= 0) {
        curFavBills.splice(index,1);  
    }
    localStorage.setItem("favBills", JSON.stringify(curFavBills));
    
}
app.controller("comDataCtrl", ['$scope', '$http', 'filterFilter', '$rootScope', function ($scope, $http, filterFilter, $rootScope) { 
    $scope.star = "";
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
        $scope.totalItems = data.results.count;
    });
    $scope.orderBy = function(array, key) {
        var sorted = array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        return sorted;
    }
    $scope.checkFavCom = function(id) {
        var f = JSON.parse(localStorage.getItem('favComs'));
        returnVal = "";
        exists = false;
        $.each(f, function(index, value) {
            if(!exists) {
                if(value.committee_id == id) {
                    returnVal= 'fa fa-star fa-3x fav';
                    exists = true;
                }
                else{
                    returnVal= 'fa fa-star fa-3x unfav';
                }
            }
        });
        
        return returnVal;
    };
    
    
    $scope.favoriteCommittee = function(comJson, favbutton){
        console.log(favbutton.target.id);
        var curFavComs = JSON.parse(localStorage.getItem("favComs"));
        
        var elem = favbutton.target;
        var exists = false;
        if(curFavComs == null) {
            curFavComs = [];
            $scope[comJson.committee_id] = true;
            curFavComs.push(comJson);
        } else {
            if(!$scope[comJson.committee_id]) {
                
                $scope[comJson.committee_id] = true;
                angular.forEach(curFavComs, function(value, key) {
                    if(value.committee_id == comJson.committee_id) {
                        exists = true;  
                    }
                });
                if(!exists) {
                    curFavComs.push(comJson);
                }
            } else {
                $scope[comJson.committee_id] = false;
                removeFavCom(comJson);
                $rootScope.favoriteCommittees = JSON.parse(localStorage.getItem("favComs"));
                $scope.checkFavCom(comJson.committee_id);
                return;
            }
        }
        localStorage.setItem("favComs", JSON.stringify(curFavComs));
        $rootScope.favoriteCommittees = JSON.parse(localStorage.getItem("favComs"));
        $scope.checkFavCom(comJson.committee_id);
    };
}]);
function removeFavCom (comJson) {
    var curFavComs = JSON.parse(localStorage.getItem("favComs"));
    var index = -1;
    var exists = false;
    angular.forEach(curFavComs, function(value, key) {
        if(!exists) {
            index++;
            if(value.committee_id == comJson.committee_id) {
                exists = true;
            }
        }
    });
    if(index >= 0) {
        curFavComs.splice(index,1);  
    }
    localStorage.setItem("favComs", JSON.stringify(curFavComs));
    
}
app.controller("favDataCtrl", ['$scope', 'filterFilter', '$rootScope', '$http', '$sce', function ($scope, filterFilter, $rootScope, $http, $sce) {    
  
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.maxSize = 5;
    $scope.favoriteBills = $rootScope.favBill;
    $scope.favoriteComs = $rootScope.favoriteCommittees;
    $scope.favoriteLegs = $rootScope.favoriteLegislators;
    $scope.star = "fav";
    $scope.removeFavorite = function(dbType, item) {
        var index = 0;
        if('Legislators' == dbType) {
            removeFavLeg(item);
            $rootScope.favoriteLegislators = JSON.parse(localStorage.getItem('favLegs'));
            $scope.star = checkFavorite('legislators', item.bioguide_id);
        } else if('Bills' == dbType) {
            removeFavBill(item);
            $rootScope.favBill = JSON.parse(localStorage.getItem('favBills'));
            $scope.star = checkFavorite('bills', item.bill_id);
        } else if('Committees' == dbType) {
            removeFavCom(item);
            $rootScope.favoriteCommittees = JSON.parse(localStorage.getItem('favComs'));
            $scope.star = checkFavorite('committees', item.committee_id);
        }
    };
    $scope.$watch("favoriteLegislators", function() {
        $scope.favoriteLegs = $rootScope.favoriteLegislators;
    });
    $scope.$watch("favBill", function() {
        $scope.favoriteBills = $rootScope.favBill;
    });
    $scope.$watch("favoriteCommittees", function() {
        $scope.favoriteComs = $rootScope.favoriteCommittees;
    });
    
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
function checkFavorite(dbType, id) {
    var star = '';
    var favLegs = JSON.parse(localStorage.getItem('favLegs'));
    var favBills = JSON.parse(localStorage.getItem('favBills'));
    if(dbType == 'legislators') {
        angular.forEach(favLegs, function(value, key) {
            if(value.bioguide_id == id) {
                star = 'fav';
            }
        });

    } else if(dbType == 'bills') {
        angular.forEach(favBills, function(value, key) {
            if(value.bill_id == id) {
                star = 'fav';
            }
        });
    } else {
        star = 'unfav';            
    }
    if(star == '') {
        star = 'unfav';
    }
    return  star;
};
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
        if($(window).width()>= 768) {
            if(!$('.side-bar').hasClass("hide")) {
                $('.content').css("padding-left", "0");
            } else {
                $('.content').css("padding-left", "200px");
            }
        }
        if($(window).width()< 768) {
            if(!$('.side-bar').hasClass("hide")) {
                $('.content').css("padding-left", "0");
            } else {
                $('.content').css("padding-left", "60px");
            }
        }
        $(".side-bar").toggleClass("hide");
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
