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
	npm test

test-coverage:
	npm test -- --coverage

publish:
	npm publish --dry-run

push:
	git push origin --all
