FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .
ENV NEXTAUTH_SECRET=your_super_secret_key_here_change_in_production
RUN npx prisma generate
RUN npx prisma db push
RUN pnpm run build
EXPOSE 3000
CMD ["pnpm", "start"]
