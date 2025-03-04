# Используем базовый образ Node.js
FROM node:22

RUN apt-get update && apt-get install -y git

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .
COPY /etc/letsencrypt/live/pxmx-home.ddns.net/privkey.pem /app/key.pem
COPY /etc/letsencrypt/live/pxmx-home.ddns.net/cert.pem /app/cert.pem

# Указываем порт
EXPOSE 3001

# Запускаем приложение
CMD ["node", "index_https_manag.js"]