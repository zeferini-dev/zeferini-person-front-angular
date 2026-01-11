import { InjectionToken } from '@angular/core';

// Função para obter a URL base dinamicamente
function getBaseUrl(port: number): string {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
  return `${protocol}//${hostname}:${port}`;
}

// API de escrita (comandos): MySQL
export const API_COMMAND_URL = new InjectionToken<string>('API_COMMAND_URL', {
  providedIn: 'root',
  factory: () => getBaseUrl(3000),
});

// API de leitura (queries): MongoDB
export const API_QUERY_URL = new InjectionToken<string>('API_QUERY_URL', {
  providedIn: 'root',
  factory: () => getBaseUrl(3001),
});

// Mantém compatibilidade com código existente (aponta para comandos)
export const API_BASE_URL = API_COMMAND_URL;
