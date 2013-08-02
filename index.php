<?php
// $items = array();
// $items[0] = array(array(0,0,0,0,0,0,0,0,0), array(0,0,0,0,0,0,0,0,0));
// $items[2] = array(array(0,0,0,0,0,0,0,0,0), array(0,0,0,0,0,0,0,0,0));
// echo json_encode($items);
for($i = 256; $i <= 421; $i++)
{
	echo '["'.$i.'", ""],<br>';
}