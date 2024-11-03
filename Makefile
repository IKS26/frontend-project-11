.PHONY: develop build lint

develop:
	npx webpack serve

build:
	NODE_ENV=production npx webpack

lint:
	npx eslint .

