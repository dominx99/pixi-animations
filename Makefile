up:
	@docker-compose up -d

down:
	@docker-compose down

restart: down up

build:
	@docker-compose build

run:
	@docker-compose exec nodejs npm run start

lint:
	@docker-compose exec recipes_nodejs eslint --fix-dry-run src/

bash:
	@docker-compose exec recipes_nodejs bash

git-pull:
	git pull

deploy: git-pull down up

logs:
	@docker-compose logs -f

init:
	docker network create \
		--driver=bridge \
		--subnet=10.200.0.0/16 \
		--ip-range=10.200.0.0/24 \
		--gateway=10.200.0.1 \
		"proxy"
