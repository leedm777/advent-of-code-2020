typesync:
	npx --no-install typesync
	npm install
.PHONY: typesync

lint: eslint tsc
.PHONY: lint

eslint:
	npx --no-install eslint --ext ts,js .
.PHONY: eslint

tsc:
	npx --no-install tsc --noEmit
.PHONY: tsc
