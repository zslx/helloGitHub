<?php
header('Content-Type:text/plain');
/* header('charset:utf-8'); */
$headers=getallheaders(); // alias apache_request_headers(); OR $_SERVER
$recvdata='之乎者也';

if(isset($_GET['getparams'])) {
  $recvdata= $_GET['getparams'];

  if(isset($headers['tpl'])) {
    $fpath = './plugin/'.$recvdata.'/'.$recvdata.'.html';
    $html = file_get_contents($fpath);
    /* 超时处理，需要多线程同时执行的能力 */
    echo $html;
    return; /* return 返回值不会发到客户端;exit, die */
  }
}else{
  /* $recvdata.= var_export($_SERVER,true); ok*/
  /* $recvdata.= var_export($_POST,true); fail*/
  $recvdata.= var_export($_REQUEST,true);
}

if(isset($_POST['postdatas'])) {
  $recvdata.= $_POST['postdatas'];
}else if(isset($_GET['postdatas'])) { /* why? */
  $recvdata.= $_GET['postdatas'];
}

$ss = sleep(5);

header('xxyy:uull');
echo $ss.' recieved data:'.$recvdata.'<br> http header:'.$headers['myfav'];


/* getallheaders()用来获取请求Header.你也可以使用$_SERVER阵列. */
/* headers_list()用来获取回应Header. */