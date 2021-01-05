.PHONY: install lint fix pretty test publish push

install:
	npm install

lint:
	npx eslint . --ignore-path .gitignore

fix:
	npx eslint . --ignore-path .gitignore --fix

pretty:
	npx prettier . -w

test:
	cat test/f1.json && cat test/f2.json && ./gendiff.js test/f1.json test/f2.json

publish:
	npm publish --dry-run

push:
	git push origin --all
