.PHONY:	all lint deps

SRC_FILES="app.js"

all:	lint

deps:
	@npm install express sax restler

lint:
	@jshint $(SRC_FILES)
