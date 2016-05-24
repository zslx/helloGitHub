<?php
$id = $_GET['id'];
$tpl = '../component/'.$id.'.html';
echo file_get_contents($tpl);