up:
	@docker compose up -d

down:
	@docker compose down

deploy:
	@git pull
	@docker compose up -f docker-compose-prod.yml -d --build

init:
	cp .env.dist .env
	docker network create \
		--driver=bridge \
		--subnet=10.200.0.0/16 \
		--ip-range=10.200.0.0/24 \
		--gateway=10.200.0.1 \
		"proxy"
