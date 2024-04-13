FROM mysql:5.7

ENV MYSQL_DATABASE=challenge \
    MYSQL_ROOT_PASSWORD=root

COPY ./migrations.sql /docker-entrypoint-initdb.d/
