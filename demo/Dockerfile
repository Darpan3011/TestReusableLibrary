# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Install local custom JARs into the Maven local repo before resolving dependencies.
# These are private starters not published to Maven Central.
COPY libs/darpan-security-starter-2.0.0.jar         /tmp/libs/
COPY libs/darpan-communication-starter-2.0.0.jar    /tmp/libs/
COPY libs/darpan-ai-database-agent-2.0.0.jar        /tmp/libs/
COPY libs/rate-limiter-core-1.0.0.jar               /tmp/libs/

RUN mvn install:install-file -Dfile=/tmp/libs/darpan-security-starter-2.0.0.jar \
        -DgroupId=com.darpan -DartifactId=darpan-security-starter -Dversion=2.0.0 -Dpackaging=jar -q && \
    mvn install:install-file -Dfile=/tmp/libs/darpan-communication-starter-2.0.0.jar \
        -DgroupId=com.darpan -DartifactId=darpan-communication-starter -Dversion=2.0.0 -Dpackaging=jar -q && \
    mvn install:install-file -Dfile=/tmp/libs/darpan-ai-database-agent-2.0.0.jar \
        -DgroupId=com.darpan -DartifactId=darpan-ai-database-agent -Dversion=2.0.0 -Dpackaging=jar -q && \
    mvn install:install-file -Dfile=/tmp/libs/rate-limiter-core-1.0.0.jar \
        -DgroupId=com.ratelimiter -DartifactId=rate-limiter-core -Dversion=1.0.0 -Dpackaging=jar -q

# Cache dependency downloads separately from source so rebuilds are fast
COPY pom.xml .
RUN mvn dependency:go-offline -B -q

# Copy source and build the fat JAR
COPY src ./src
RUN mvn clean package -DskipTests -q

# ─── Stage 2: Run ────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
