<?php
$rawpost = file_get_contents('php://input');
$postdata = json_decode($rawpost);

$username = $postdata->u;

$malUrl = 'http://myanimelist.net/malappinfo.php?status=all&u=' . $username .  '&type=anime';

include 'constants.php';

$http['http']['method'] = 'GET';
$http['http']['header'] = $useragent;

$context = stream_context_create($http);

$xml = file_get_contents($malUrl, false, $context);

// Thanks to http://www.lonhosford.com/lonblog/2011/01/07/php-simplexml-load-xml-file-preserve-cdata-remove-whitespace-between-nodes-and-return-json/
$xml = preg_replace('~\s*(<([^>]*)>[^<]*</\2>|<[^>]*>)\s*~','$1',$xml);
// Convert CDATA into xml nodes.
$xml = simplexml_load_string($xml,'SimpleXMLElement', LIBXML_NOCDATA);
// Return JSON.
echo json_encode($xml);

?>