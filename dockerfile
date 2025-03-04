# Используем базовый образ Node.js
FROM node:22

# Устанавливаем необходимые пакеты
RUN apt-get update && apt-get install -y git postgresql-client netcat

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Копируем скрипты
COPY ./wait-for-db.sh /usr/local/bin/wait-for-it
COPY ./update_and_run.sh /usr/local/bin/update-and-run
RUN chmod +x /usr/local/bin/wait-for-it /usr/local/bin/update-and-run

# Указываем порт
EXPOSE 3001

# Запуск скрипта обновления кода и старта сервера
CMD ["/usr/local/bin/update-and-run"]
