<?php
// define variables and set to empty values
    $dbType = $_GET["dbType"];
    $results = array();
    $url = "";
    $jsArray = "";
    $outputTable = "";
    if($dbType == "legislators" ) {
        //create the urls to call the webservice.
        $url = "http://104.198.0.197:8080/legislators?per_page=all&apikey=1d4e5439054e4043a9db003f419da734";
    } elseif ($dbType == 'bills') {
        $url = "http://104.198.0.197:8080/bills?history.active={$_GET['activeStatus']}&last_version.urls.pdf__exists=true&per_page=50&apikey=1d4e5439054e4043a9db003f419da734";
    } elseif ($dbType == 'committees') {
        $url = "http://104.198.0.197:8080/committees?per_page=all&apikey=1d4e5439054e4043a9db003f419da734";
    }
    if($dbType == "committees" && $_GET["member_id"] != null) {
        $url = "http://104.198.0.197:8080/committees?member_ids={$_GET['member_id']}&apikey=1d4e5439054e4043a9db003f419da734";
    }
    if($dbType == "bills" && $_GET["sponsor_id"] != null) {
        $url = "http://104.198.0.197:8080/bills?sponsor_id={$_GET['sponsor_id']}&apikey=1d4e5439054e4043a9db003f419da734";
    }
    $resp = file_get_contents($url);
    echo $resp;
?>