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
	npx jest test

publish:
	npm publish --dry-run

push:
	git push origin --all
