<?php

namespace App\Helpers\Classes;

class SvgHelper
{
    private static $svgArray = [];

    public static function getSvg($svgName, $pathToSvg = 'svg')
    {
        if (isset(self::$svgArray[$svgName])) {
            return self::$svgArray[$svgName];
        }

        $filePath = resource_path("$pathToSvg/{$svgName}.svg");

        if (!file_exists($filePath)) return false;

        return file_get_contents($filePath);
    }
}
