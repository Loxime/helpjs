.PHONY: test

test:
	npm test
	docker compose run --rm app npm test