# 使用官方 Maven 镜像构建应用
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /build

# 复制 pom.xml 和源代码
COPY pom.xml .
COPY src ./src

# 构建应用（打包成 JAR）
RUN mvn clean package -DskipTests

# 使用官方 Java 运行时作为基础镜像
FROM eclipse-temurin:17-jre

WORKDIR /app

# 从构建阶段复制 JAR 文件
COPY --from=builder /build/target/*.jar app.jar

# 暴露端口（Render 默认使用 PORT 环境变量）
EXPOSE 8080

# 启动应用
CMD ["java", "-jar", "app.jar"]

