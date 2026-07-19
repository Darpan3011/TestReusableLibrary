# Use a lightweight Java 17 runtime environment
FROM eclipse-temurin:17-jre-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the pre-built executable JAR into the container.
# NOTE: Because you have custom local dependencies (like darpan-security-starter), 
# you MUST build the JAR locally on your machine first before building the Docker image.
COPY target/*.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
