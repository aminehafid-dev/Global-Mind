FROM php:8.2-apache

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install PDO MySQL and SQLite extensions
RUN docker-php-ext-install pdo pdo_mysql

# Configure Apache DocumentRoot to /var/www/html/public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

WORKDIR /var/www/html

# Copy application files and database
COPY php-server/ /var/www/html/
COPY database/ /var/www/database/
COPY data/ /var/www/data/

# Set permissions for SQLite database directory
RUN chown -R www-data:www-data /var/www/database /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]
