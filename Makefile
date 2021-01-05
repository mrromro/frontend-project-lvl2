.PHONY: install lint pretty test publish

install:
	npm install

lint:
	npx eslint . --ignore-path .gitignore

pretty:
	npx prettier . -w

test:
	./gendiff.js test/f1.json test/f2.json

publish:
	npm publish --dry-run
