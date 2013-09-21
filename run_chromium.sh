#! /bin/sh

export LANG=de_AT
exec chromium --allow-file-access-from-files --disable-web-security index.html
