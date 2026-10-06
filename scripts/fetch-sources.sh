#!/bin/sh
# Downloads the reference files into sources/. They are not committed.
#  - EDRDG KANJIDIC2 + KRADFILE (CC BY-SA 4.0): kanji readings for the review sheets
#  - OPUS OpenSubtitles v2018 Japanese monolingual text (~100 MB): word frequency (scripts/build-freq.js)
set -e
cd "$(dirname "$0")/../sources"
curl -sSLO http://www.edrdg.org/kanjidic/kanjidic2.xml.gz
curl -sSL -o kradfile.gz http://ftp.edrdg.org/pub/Nihongo/kradfile.gz
curl -sSL -o opensubtitles-ja.txt.gz https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2018/mono/ja.txt.gz
gunzip -f kanjidic2.xml.gz kradfile.gz opensubtitles-ja.txt.gz
ls -la
