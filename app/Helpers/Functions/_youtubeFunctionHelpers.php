<?php

function getIdFromYoutubeVideoUrl(string $url): string|int|bool
{
  $urlComponents = parse_url($url);
  
  $urlQuery = isset($urlComponents['query'])
    ? $urlComponents['query'] : false;

  if (!$urlQuery) return false;

  parse_str($urlQuery, $params);

  return $params['v'];
}
