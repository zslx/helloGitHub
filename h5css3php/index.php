<?php
/* some php program */
$hname=$_SERVER['SERVER_NAME'];
$phpvar='hello from Server: '.$hname;


/* load html, 这样，在html模板里可以用php变量 */
include dirname(__FILE__) . '/tpl.html';
/* echo 'host:'.$hname.'<br>'; */
