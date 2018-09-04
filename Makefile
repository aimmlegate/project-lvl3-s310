install: install-deps

run:
	npx babel-node -- 'src/bin/index.js' --output /var/tmp/1 http://htmlbook.ru/

install-deps:
	npm install

build:
	rm -rf dist
	npm run build

test:
	npm test

lint:
	npx eslint .

publish:
	npm publish

.PHONY: test