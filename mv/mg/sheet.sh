#!/bin/sh
# contact sheet of a preview dir: sh sheet.sh dir cols
cd "$1" && ffmpeg -loglevel error -y -pattern_type glob -i 'p_*.jpg' -vf "scale=480:-1,tile=${2:-4}x$(( ( $(ls p_*.jpg | wc -l) + ${2:-4} - 1 ) / ${2:-4} ))" -frames:v 1 sheet.jpg
