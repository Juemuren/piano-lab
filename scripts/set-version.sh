#!/bin/sh

version=$1

pnpm version "$version" \
	--message "chore: release v$version" \
	--no-git-checks
