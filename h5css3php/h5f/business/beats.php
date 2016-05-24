<?php
header('Content-Type:text/plain');
$r = $_GET['n']+1;
echo $r.' from server';