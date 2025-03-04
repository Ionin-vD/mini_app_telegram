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

# Указываем порт
EXPOSE 3001

# CMD ["node", "index_https_manag.js"]
CMD ["sh", "-c", "node ./src/db/config/config.js && sleep 5 && node index_https_manag.js"]