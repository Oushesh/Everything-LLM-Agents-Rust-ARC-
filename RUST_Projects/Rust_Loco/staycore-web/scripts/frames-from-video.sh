#!/usr/bin/env bash
# Sample a frontend recording into still frames an agent can read.
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: pnpm frames -- path/to/recording.mp4" >&2
  exit 1
fi

video=$1
if [[ ! -f "$video" ]]; then
  echo "video not found: $video" >&2
  exit 1
fi

root=$(cd "$(dirname "$0")/.." && pwd)
name=$(basename "$video")
name=${name%.*}
out="$root/e2e/.frames/$name"
mkdir -p "$out"
rm -f "$out"/frame-*.png

ffmpeg -y -i "$video" -vf "fps=1,scale=1280:-1" -frames:v 30 "$out/frame-%03d.png" >/dev/null 2>&1

count=$(find "$out" -name 'frame-*.png' | wc -l | tr -d ' ')
echo "$count frames in $out"
