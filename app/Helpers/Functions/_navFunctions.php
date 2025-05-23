<?php

// Recursive function to generate the menu items with subitems
function generateMenuUlItems(array $items, string $ulContainerIdentifier = 'ul-main-container', int $levelCount = 0): string
{
  if (!$items) return '';

  if ($levelCount > 1) {
    $ulContainerIdentifier = 'ul-child-level level-' . $levelCount;
  }

  $levelCount += 1;

  $arrowDownSvg = App\Helpers\Classes\SvgHelper::getSvg('arrow-down-icon', 'assets/site/svg/icons');

  $output = '<ul class="' . $ulContainerIdentifier . '">';

  foreach ($items as $item) {
    // Check if the item has a 'subitems' key
    $hasSubItems = isset($item['subitems']) && is_array($item['subitems']);

    $url = $item['route'];
    $routeTitle = $item['title'];
    $routeTarget = indexParamExistsOrDefault($item, 'target', '_self');

    $liClass = 'list-item level-' . $levelCount;
    $liClass .= $hasSubItems ? ' has-sub-items' : '';

    $arrowItem = '<span class="arrow-item">' . $arrowDownSvg . '</span>';

    $dataPageId = verifyValue($item, 'data-page-id', '');

    $dataPageId = $dataPageId ?
      $dataPageId : mb_strtolower(str_replace(' ', '-', $routeTitle));

    // Render the item with a submenu
    $output .= '<li class="' . $liClass . '">';
    $output .= '<a href="' . $url . '" target="' . $routeTarget . '" title="' . $routeTitle . '" data-page-id="' . $dataPageId . '">' . $routeTitle . '</a>';

    if ($hasSubItems) {
      // Recursive call for sub-items

      $output .= $arrowItem;
      $output .= generateMenuUlItems($item['subitems'], 'ul-child-container', $levelCount);
    }

    $output .= '</li>';
  }

  $output .= '</ul>';

  return $output;
}
