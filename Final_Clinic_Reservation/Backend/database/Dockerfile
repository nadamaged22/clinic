FROM postgres:alpine

ARG PGDATA
# Set environment variables
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD nnn123nnn
ENV PGDATA /var/lib/postgresql/data/pgdata

# Copy any additional initialization scripts or configuration files
COPY . .
COPY init.sql /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432
