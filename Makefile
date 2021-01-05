.PHONY: install lint pretty test publish

install:
	npm install

lint:
	npx eslint . --ignore-path .gitignore

pretty:
	npx prettier . -w

test:
	cat test/f1.json && cat test/f2.json && ./gendiff.js test/f1.json test/f2.json

publish:
	npm publish --dry-run
