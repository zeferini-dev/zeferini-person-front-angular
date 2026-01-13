import { InjectionToken } from '@angular/core';

// Função para obter a URL do API Gateway dinamicamente
function getGatewayUrl(): string {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
  return `${protocol}//${hostname}:8084`;
}

// API Gateway URL
export const API_GATEWAY_URL = new InjectionToken<string>('API_GATEWAY_URL', {
  providedIn: 'root',
  factory: () => getGatewayUrl(),
});

// API de escrita (comandos): via Gateway -> Load Balanced
export const API_COMMAND_URL = new InjectionToken<string>('API_COMMAND_URL', {
  providedIn: 'root',
  factory: () => `${getGatewayUrl()}/api/persons`,
});

// API de leitura (queries): via Gateway -> MongoDB
export const API_QUERY_URL = new InjectionToken<string>('API_QUERY_URL', {
  providedIn: 'root',
  factory: () => `${getGatewayUrl()}/api/query`,
});

// Mantém compatibilidade com código existente (aponta para gateway)
export const API_BASE_URL = API_GATEWAY_URL;
