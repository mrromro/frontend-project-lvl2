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

test-watch:
	npm test -- --watch

test-coverage:
	npm test -- --coverage

publish:
	npm publish --dry-run

push:
	git push origin --all

test-step-3:
	gendiff __tests__/__fixtures__/h_plain_1.json __tests__/__fixtures__/h_plain_2.json

test-step-5:
	gendiff __tests__/__fixtures__/h_plain_1.yaml __tests__/__fixtures__/h_plain_2.yaml

test-step-6:
	gendiff __tests__/__fixtures__/h_nested_1.json __tests__/__fixtures__/h_nested_2.json

test-step-7:
	gendiff --format plain __tests__/__fixtures__/h_nested_1.json __tests__/__fixtures__/h_nested_2.json

test-step-8:
	gendiff --format json __tests__/__fixtures__/h_nested_1.json __tests__/__fixtures__/h_nested_2.json
