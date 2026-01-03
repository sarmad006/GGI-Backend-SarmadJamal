.PHONY: dev build docker-up docker-down logs

dev:
	npm run dev

build:
	npm run build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

logs:
	docker-compose logs -f
