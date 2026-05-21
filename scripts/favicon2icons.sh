#!/bin/sh

# png
magick -background none public/favicon.svg -resize 32x32 src-tauri/icons/32x32.png
magick -background none public/favicon.svg -resize 64x64 src-tauri/icons/64x64.png
magick -background none public/favicon.svg -resize 128x128 src-tauri/icons/128x128.png
magick -background none public/favicon.svg -resize 256x256 src-tauri/icons/128x128@2x.png
magick -background none public/favicon.svg -resize 512x512 src-tauri/icons/icon.png

# ico
magick src-tauri/icons/32x32.png \
  src-tauri/icons/64x64.png \
  src-tauri/icons/128x128.png \
  src-tauri/icons/128x128@2x.png \
  src-tauri/icons/icon.png \
  src-tauri/icons/icon.ico

# icns
magick src-tauri/icons/32x32.png \
  src-tauri/icons/64x64.png \
  src-tauri/icons/128x128.png \
  src-tauri/icons/128x128@2x.png \
  src-tauri/icons/icon.png \
  src-tauri/icons/icon.icns