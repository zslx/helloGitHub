<?php
header('Cache-Control:no-cache');
header('Content-Type:text/event-stream');

/* $time = date('r'); */
$time = date('Y-m-d H:i:s');
/* echo "data: ".date('Y-m-d H:i:s').PHP_EOL; */

/* 协议格式 换行和空行 */
echo "event: ssetime
id: 100
data: 来自服务器的时间:
data: server time {$time}

event: myevent
data: 这是个测试 event
data: 多项数据
id: 101

: this is a comment, 冒号前没有类型是注释，处理时会忽略
event: message
data: three event
data: three event continue

";

flush();