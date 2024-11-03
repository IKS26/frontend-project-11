.PHONY: develop lint

develop:
	npx webpack serve

lint:
	npx eslint .
