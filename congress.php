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
        $url = "http://congress.api.sunlightfoundation.com/bills?per_page=all&apikey=1d4e5439054e4043a9db003f419da734";
    } elseif ($dbType == 'committees') {
        $url = "http://congress.api.sunlightfoundation.com/committees?per_page=all&apikey=1d4e5439054e4043a9db003f419da734";
    }
    $resp = file_get_contents($url);
    echo $resp;
    
    if($dbType == "bills") {
			$outputTable = "<br><br><br><table class='resultCss' id='resultsTable' ><thead>";
			$outputTable .= "<th>Bill ID</th><th>Short Title</th><th>Chamber</th><th>Details</th></thead><tbody>";
			
			foreach($results as $item)
			{
				if(is_array($item)) {
					
	    			foreach($item as $sub)
	    			{
						if (is_array($sub))
						{
							$sponsor = $sub['sponsor']['first_name'] . ' ' . $sub['sponsor']['last_name'];
							$lastActionWithDate = $sub['last_version']['version_name'] . ", " . $sub['last_action_at'];
							
							$data = array(
									$sub["bill_id"],
									$sponsor,
									$sub['short_title'],
									$sub['introduced_on'],
									$lastActionWithDate,
									$sub['last_version']['urls']['pdf']
							);
							
							$jsArray = '["' . implode('", "', $data) . '"]';
							
							$outputTable .= "<tr><td>";
							$outputTable .= $sub["bill_id"];
							$outputTable .= "</td><td>";
							$outputTable .= $sub["short_title"];
							$outputTable .= "</td><td>";
							$outputTable .= $sub["chamber"];
							$outputTable .= "</td><td>";
							//$outputTable .= "<a href='#' onclick='viewBill($jsArray);'>";
							$outputTable .= "View Details</a></td>";
							$outputTable .= "</tr>";
						}		
					}
				}
			}
			$outputTable .= "</tbody></table>";
		}//DB Type = Bills
		elseif($dbType == "amendments") {
			$outputTable = "<br><br><br><table class='resultCss' id='resultsTable' ><thead>";
			$outputTable .= "<th>Amendment ID</th><th>Amendment Type</th><th>Chamber</th><th>Introduced On</th></thead><tbody>";
			foreach($results as $item)
			{
				if(is_array($item)) {
	    			foreach($item as $sub)
	    			{
						if (is_array($sub))
						{
							$outputTable .= "<tr><td>";
							$outputTable .= $sub["amendment_id"];
							$outputTable .= "</td><td>";
							$outputTable .= $sub["amendment_type"];
							$outputTable .= "</td><td>";
							$outputTable .= $sub["chamber"];
							$outputTable .= "</td><td>";
							$outputTable .= $sub["introduced_on"];
							$outputTable .= "</td></tr>";
						}
					}
				}
			}
			$outputTable .= "</tbody></table>";
		}
?>