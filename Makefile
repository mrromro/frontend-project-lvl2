.PHONY: install lint pretty publish

install:
	npm install

lint:
	npx eslint . --ignore-path .gitignore

pretty:
	npx prettier . -w

publish:
	npm publish --dry-run
