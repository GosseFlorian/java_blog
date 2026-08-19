# Raccourcis DevOps — Blog Java

.PHONY: test ci backend

test:
	./mvnw test

ci:
	./mvnw -B test

backend:
	./mvnw spring-boot:run
