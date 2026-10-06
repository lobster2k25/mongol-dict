#!/bin/sh
# Downloads the reference files into sources/. They are not committed.
#  - EDRDG KANJIDIC2 + KRADFILE (CC BY-SA 4.0): kanji readings for the review sheets
#  - EDRDG JMdict_e (CC BY-SA 4.0): English fallback in the extension, kept apart from our entries
#  - OPUS OpenSubtitles v2018 Japanese monolingual text (~100 MB): word frequency (ja-mn/tools/build-freq.js)
set -e
mkdir -p "$(dirname "$0")/../sources"
cd "$(dirname "$0")/../sources"
curl -sSLO http://www.edrdg.org/kanjidic/kanjidic2.xml.gz
curl -sSL -o kradfile.gz http://ftp.edrdg.org/pub/Nihongo/kradfile.gz
# JMdict (English glosses, CC BY-SA 4.0): the extension's fallback layer only (extension/build-fallback.js), never our entries
curl -sSL -o JMdict_e.gz http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz
curl -sSL -o opensubtitles-ja.txt.gz https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2018/mono/ja.txt.gz
gunzip -f kanjidic2.xml.gz kradfile.gz JMdict_e.gz opensubtitles-ja.txt.gz
ls -la
