<?php
// define variables and set to empty values
    $dbType = $_GET["dbType"];
    $results = array();
    $url = "";
    $jsArray = "";
    $outputTable = "";
    if($dbType == "legislators" ) {
        //create the urls to call the webservice.
        $url = "http://congress.api.sunlightfoundation.com/legislators?per_page=all&apikey=1d4e5439054e4043a9db003f419da734";
    } elseif ($dbType == 'bills') {
        $url = "http://congress.api.sunlightfoundation.com/bills?history.active={$_GET['activeStatus']}&per_page=50&apikey=1d4e5439054e4043a9db003f419da734";
    } elseif ($dbType == 'committees') {
        $url = "http://congress.api.sunlightfoundation.com/committees?per_page=all&apikey=1d4e5439054e4043a9db003f419da734";
    }
    if($dbType == "committees" && $_GET["member_id"] != null) {
        $url = "http://congress.api.sunlightfoundation.com/committees?member_ids={$_GET['member_id']}&apikey=1d4e5439054e4043a9db003f419da734";
    }
    if($dbType == "bills" && $_GET["sponsor_id"] != null) {
        $url = "http://congress.api.sunlightfoundation.com/bills?sponsor_id={$_GET['sponsor_id']}&apikey=1d4e5439054e4043a9db003f419da734";
    }
    $resp = file_get_contents($url);
    echo $resp;
?>