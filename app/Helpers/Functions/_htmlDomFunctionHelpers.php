<?php

function generateElementAttributes(array $attributes = []): string
{
  $attrString = '';

  foreach ($attributes as $key => $value) {

    if (!$value || empty($value)) continue;

    $key = htmlspecialchars($key);
    $value = htmlspecialchars($value);

    $attrString .= ' ' . $key . '="' . $value . '"';
  }

  return $attrString;
}

function generateOpeningTag(string $tag, array $attributes = [], bool $printElement = true): string|null
{

  $attrString = generateElementAttributes($attributes);

  $tagElement = "<{$tag}{$attrString}>";

  if (!$printElement) return $tagElement;

  echo $tagElement;
  return null;
}

function generateClosingTag(string $tagname, bool $printElement = true): string|null
{
  $tagElement = '</' . $tagname . '>';

  if (!$printElement) return $tagElement;

  echo $tagElement;
  return null;
}

function generatePictureImage(array $pictureOptions = [], bool $printElement = true): string|null
{
  $imageUrl = verifyValue($pictureOptions, 'imageUrl');
  $imageMobileUrl = verifyValue($pictureOptions, 'imageMobileUrl');

  if (!$imageUrl) return null;

  $pictureAttributes = indexParamExistsOrDefault($pictureOptions, 'pictureAttributes', []);

  $imageAttributes = indexParamExistsOrDefault($pictureOptions, 'imageAttributes', []);

  $sourceAttributes = indexParamExistsOrDefault($pictureOptions, 'sourceAttributes', []);

  // Generate the <picture> tag with attributes
  $html = generateOpeningTag('picture', array_merge(['class' => 'picture-image'], $pictureAttributes), false);

  // Generate the <source> tag if a mobile image is provided
  if ($imageMobileUrl) {

    $sourceAttributes = array_merge(['media' => '(max-width: 768px)', 'srcset' => $imageMobileUrl], $sourceAttributes);

    $html .= generateOpeningTag('source', $sourceAttributes, false);
  }

  // Merge the 'src' attribute with other image attributes
  $imgAttributes = array_merge(['src' => $imageUrl, 'loading' => 'lazy'], $imageAttributes);

  // Generate the <img> tag with merged attributes
  $html .= generateOpeningTag('img', $imgAttributes, false);

  // Generate the closing </picture> tag
  $html .= generateClosingTag('picture', false);

  // Output or return the HTML string
  if (!$printElement) return $html;

  echo $html;
  return null;
}
