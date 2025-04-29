<?php

// Checks if the value exists, otherwise returns the default
function valueParamExistsOrDefault($param, $default = false)
{
  return isset($param) && !empty($param)
    ? $param : $default;
}

// Checks if the value of an index exists within the array, otherwise returns the default
function indexParamExistsOrDefault($array, $index, $default = false)
{
  return isset($array) && isset($array[$index]) ? $array[$index] : $default;
}

// Checks if the value exists in an object
function objParamExistsOrDefault($obj, $param, $default = false)
{
  if (!is_object($obj)) return $default;

  return isset($obj) && isset($obj->$param) ? $obj->$param : $default;
}

// Verifies a value depending on type (array or object), otherwise returns the default
function verifyValue($data, $param, $default = false, $verifyType = 'array')
{
  if ($verifyType == 'array') {
    return valueParamExistsOrDefault(indexParamExistsOrDefault($data, $param), $default);
  }
  
  if ($verifyType == 'obj') {
    return valueParamExistsOrDefault(objParamExistsOrDefault($data, $param), $default);
  }
}
