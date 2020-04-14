.PHONY: build
build:
	go build -o bin/knowledgebox

.PHONY: clean
clean:
	rm -f bin/knowledgebox
