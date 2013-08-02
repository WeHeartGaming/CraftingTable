<?php
// $items = array();
// $items[0] = array(array(0,0,0,0,0,0,0,0,0), array(0,0,0,0,0,0,0,0,0));
// $items[2] = array(array(0,0,0,0,0,0,0,0,0), array(0,0,0,0,0,0,0,0,0));
// echo json_encode($items);
// for($i = 256; $i <= 421; $i++)
// {
// 	echo '["'.$i.'", ""],<br>';
// }
$site = file_get_contents('http://www.minecraftwiki.net/wiki/Data_Values');

preg_match_all('/src="(.*?)" width="25"/i', $site, $out);

$big = array();
foreach ($out[1] as $v) {
	$v = str_replace('thumb/', '', $v);
	$big[] = preg_replace('/\/25px(.*?).png$/i', '', $v);
}
$i = 1;
foreach ($big as $b)
{
	file_put_contents("images_minecraft/".$i.".png", file_get_contents($b));
	$i++;
}