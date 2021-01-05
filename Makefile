.PHONY: install publish

install:
	npm install

publish:
	npm publish --dry-run
