#!/bin/sh
# Join rendered parts and add the song: sh mux.sh <audio> <out.mp4> part1.mp4 part2.mp4 ...
audio="$1"; out="$2"; shift 2
list=$(mktemp); for p in "$@"; do echo "file '$(realpath "$p")'" >> "$list"; done
ffmpeg -v error -y -f concat -safe 0 -i "$list" -i "$audio" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$out"
rm -f "$list"
