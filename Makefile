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
