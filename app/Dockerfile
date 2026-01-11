FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Servir com Nginx
FROM nginx:alpine

# Remover configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Criar arquivo de configuração nginx
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /app/dist/first/browser;
    index index.html;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
    
    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Reescrever para index.html para SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Copiar arquivos buildados
COPY --from=builder /app/dist/first/browser /app/dist/first/browser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
