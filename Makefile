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

test:
	npx jest
	$(MAKE) lint
.PHONY: test

profile:
	rm -f *.log
	time npx --no-install tsc
	node --prof $(shell npx which jest) --maxWorkers 0 dist/day11.spec.js --modulePathIgnorePatterns build src
	node --prof-process isolate-*-v8.log > dist/perf.txt
	less dist/perf.txt
.PHONY: profile
