# Author: Nong Hoang Vu || JavaTech
# Facebook:https://facebook.com/NongHoangVu04
# Github: https://github.com/JavaTech04
# Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
FROM maven:3.9.8-amazoncorretto-21 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN mvn package -P prd -DskipTests

FROM amazoncorretto:21.0.4

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 2004

ENTRYPOINT ["java", "-jar", "app.jar"]

