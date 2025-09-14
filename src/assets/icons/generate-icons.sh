#!/bin/bash

# Script to generate PNG icons from SVG
# Requires imagemagick (brew install imagemagick on macOS)

# Generate different sizes
for size in 16 32 48 96 128; do
  echo "Generating icon-${size}.png..."
  convert -background none -resize ${size}x${size} icon.svg icon-${size}.png
done

echo "Icon generation complete!"