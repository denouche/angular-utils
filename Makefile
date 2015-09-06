SHELL := /bin/bash

DIST_FOLDER = dist

help:
	@echo "Existing goals are: "
	@echo "clean      -> clean dependencies and generated files"
	@echo "install    -> install dependencies"
	@echo "release    -> release the project"

clean:
	grunt clean || true
	rm -rf $(DIST_FOLDER)/

npmInstall:
	npm install

install: npmInstall

bumpAndBuildProd:
	if [ "$(type)" = "" ]; then grunt bump-only:patch; else grunt -v bump-only:$(type); fi
	grunt -v build
	grunt changelog
	git add .
	grunt -v bump-commit

release: clean install bumpAndBuildProd
	rm -rf $(DIST_FOLDER)/
	git commit -am'chore: clean $(DIST_FOLDER) folder after release'
	git push origin master



