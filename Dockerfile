FROM mysql
ENV MYSQL_ROOT_PASSWORD adm123
ENV MYSQL_DATABASE adote_aqui_sql
ENV MYSQL_USER water
ENV MYSQL_PASSWORD adm123
VOLUME var/lib/mysql
EXPOSE 3000