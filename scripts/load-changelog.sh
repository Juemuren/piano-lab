#!/usr/bin/env bash

version="$1"

awk -v version="$version" '
  $0 == "## " version {
    in_section = 1
    print
    next
  }
  in_section && /^## / {
    exit
  }
  in_section {
    print
  }
' CHANGELOG.md
