<?php
require("Services_JSON.class.php");
$out = array(
			array(
				"selector"		=> "#userContent",
				"content"		=> "This content is returned via ajax",
				"updateMethod"	=> "replace"),
			array(
				"selector"		=> "#dynamicParagraph",
				"content"		=> "This content is returned via ajax",
				"updateMethod"	=> "append"),
			array(
				"selector"		=> "#defaultBehaviorEx",
				"content"		=> "This content is returned via ajax"),
			array(
				"script"		=> "alert('hello world !')"),
		);

		
$json = new Services_JSON();
echo $json->encode($out);
?>