#!/bin/sh
# Downloads the EDRDG source files (CC BY-SA 4.0) into sources/. They are not committed.
set -e
cd "$(dirname "$0")/../sources"
curl -sSLO http://www.edrdg.org/kanjidic/kanjidic2.xml.gz
curl -sSL -o kradfile.gz http://ftp.edrdg.org/pub/Nihongo/kradfile.gz
gunzip -f kanjidic2.xml.gz kradfile.gz
ls -la
