# Raccourcis DevOps — Blog Java

.PHONY: test ci backend frontend-build

test:
	./mvnw test

ci:
	./mvnw -B test
	cd admin && npm ci && npm run build

backend:
	./mvnw spring-boot:run

frontend-build:
	cd admin && npm ci && npm run build
