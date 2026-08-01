#!/bin/sh

fd --extension ts --extension tsx --search-path src --exec wc --lines |
	sort --numeric-sort --reverse |
	head --lines 10
