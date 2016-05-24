<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

/* $time = date('r'); */
$time = date('Y-m-d H:i:s');
/* echo "data: ".date('Y-m-d H:i:s').PHP_EOL; */
echo "data:server time {$time}\n\n";
flush();