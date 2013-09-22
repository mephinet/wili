ID=$(shell grep id appinfo.json | cut -d \" -f 4)
VERSION=$(shell grep version appinfo.json  | cut -d \" -f 4)
IPK:=${ID}_${VERSION}_all.ipk
DEB:=$(addsuffix .deb,$(basename ${IPK}))
TARGZ=$(addsuffix .tar.gz,$(basename ${DEB}))

all: package

package: ${IPK}

emulator: ${IPK}
	palm-install -d tcp $<
	palm-launch -d tcp ${ID}

device: ${IPK}
	palm-install -d usb $<
	palm-launch -d usb ${ID}

coords:
	ssh -p 5522 root@localhost 'luna-send -n 1 luna://com.palm.pmradiosimulator/set_position {\"lat\":\"48.209380\",\"long\":\"16.351499\"}'

tail:
	palm-log ${ID} -f

build: appinfo.json framework_config.json index.html depends.js $(wildcard css/*.css) $(wildcard source/*.js)
	mkdir -p build build/css build/source
	for f in $<; do \
	  cp -vp $$f $@/$$f; \
	done

${IPK}: build
	palm-package $<

%.deb:%.ipk
	ln $< $@

%.tar.gz:%.deb
	deb2targz $<

tar: ${TARGZ}

chromium:
	export LANG=de_AT
	chromium --disable-web-security --allow-file-access-from-files index.html

chrome: chromium

clean:
	rm -rf build
	rm -f ${IPK} ${TARGZ}

.PHONY: chrome chromium minified package tar clean emulator coords device tail
