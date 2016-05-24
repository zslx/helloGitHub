<?php
/* some php program */
$hname=$_SERVER['SERVER_NAME'];
$phpvar='hello from Server Template: '.$hname;

/* load html, 这样，在html模板里可以用php变量 -- 服务器端模板 */
include dirname(__FILE__) . '/index.html';
/* echo 'host:'.$hname.'<br>'; */
