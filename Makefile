install: install-deps

run:
	npx babel-node -- 'src/bin/index.js' --output /tmp/1 https://asciinema.org/

start-debug:
	DEBUG=page-loader:* page-loader --output /tmp/1 https://asciinema.org/

install-deps:
	npm install

build:
	rm -rf dist
	npm run build

test:
	npm test

test-debug:
	DEBUG=page-loader:* npm test

lint:
	npx eslint .

publish:
	npm publish

.PHONY: test