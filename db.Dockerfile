FROM mariadb:10.4.12

RUN echo 'CREATE DATABASE IF NOT EXISTS kmotion;' > /docker-entrypoint-initdb.d/schema.sql

ENV MYSQL_ROOT_PASSWORD azerty

EXPOSE 3306

ENTRYPOINT ["mysqld"]
