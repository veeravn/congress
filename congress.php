<?php
// define variables and set to empty values
    $dbType = $_GET["dbType"];
    $results = array();
    $url = "";
    $jsArray = "";
    $outputTable = "";
    if($dbType == "legislators" ) {
        //create the urls to call the webservice.
        $url = "http://104.198.0.197:8080/legislators?per_page=all";
    } elseif ($dbType == 'bills') {
        $url = "http://104.198.0.197:8080/bills?history.active={$_GET['activeStatus']}&last_version.urls.pdf__exists=true&order=introduced_on__desc&per_page=50";
    } elseif ($dbType == 'committees') {
        $url = "http://104.198.0.197:8080/committees?per_page=all&order=name__asc";
    }
    if($dbType == "committees" && $_GET["member_id"] != null) {
        $url = "http://104.198.0.197:8080/committees?member_ids={$_GET['member_id']}";
    }
    if($dbType == "bills" && $_GET["sponsor_id"] != null) {
        $url = "http://104.198.0.197:8080/bills?sponsor_id={$_GET['sponsor_id']}";
    }
    
    if($_GET["bioguide_id"] != null) {
    	$url = "http://104.198.0.197:8080/legislators?bioguide_id={$_GET['bioguide_id']}";
    }
    if($_GET["bill_id"] != null) {
    	$url = "http://104.198.0.197:8080/bills?bill_id={$_GET['bill_id']}";
    }
    if($_GET["committee_id"] != null) {
    	$url = "http://104.198.0.197:8080/committees?committee_id={$_GET['committee_id']}";
    }
    
    $resp = file_get_contents($url);
    echo $resp;
?>