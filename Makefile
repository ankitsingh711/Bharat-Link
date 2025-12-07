.PHONY: setup dev test build deploy

setup:
	@echo "Setting up environment..."
	npm install --prefix frontend
	npm install --prefix backend

dev:
	@echo "Starting local development stack..."
	docker-compose up -d

test:
	@echo "Running tests..."
	npm test --prefix backend
	npm test --prefix frontend

build:
	@echo "Building artifacts..."
	npm run build --prefix backend
	npm run build --prefix frontend

deploy:
	@echo "Deploying infrastructure..."
	cd infrastructure/terraform && terraform apply
