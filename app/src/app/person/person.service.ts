import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_COMMAND_URL, API_QUERY_URL } from '../core/api.config';
import { CreatePerson, Person, UpdatePerson } from './person.model';
import { Observable, Subject, delay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private readonly http = inject(HttpClient);
  private readonly commandUrl = inject(API_COMMAND_URL); // Gateway -> Load Balanced
  private readonly queryUrl = inject(API_QUERY_URL);     // Gateway -> MongoDB
  // Command URL já inclui /api/persons, Query URL inclui /api/query
  private readonly commandResource = this.commandUrl;
  private readonly queryResource = `${this.queryUrl}/persons`;
  
  // Subject para triggerar refresh na lista
  private readonly refreshTrigger$ = new Subject<void>();

  // Exposição do refresh trigger para consumo externo
  // delay garante que a lista terá tempo de se subscrever após navegação
  refresh$ = this.refreshTrigger$.pipe(
    delay(100)
  );

  // QUERIES (leitura) → MongoDB
  list(): Observable<Person[]> {
    return this.http.get<Person[]>(this.queryResource);
  }

  get(id: string): Observable<Person> {
    return this.http.get<Person>(`${this.queryResource}/${id}`);
  }

  // COMMANDS (escrita) → MySQL
  create(data: CreatePerson): Observable<Person> {
    return this.http.post<Person>(this.commandResource, data);
  }

  update(id: string, data: UpdatePerson): Observable<Person> {
    return this.http.patch<Person>(`${this.commandResource}/${id}` , data);
  }

  remove(id: string): Observable<Person> {
    return this.http.delete<Person>(`${this.commandResource}/${id}`);
  }

  // Método para triggerar refresh manualmente
  triggerRefresh() {
    // Delay pequeno para garantir que a navegação aconteça primeiro
    setTimeout(() => {
      this.refreshTrigger$.next();
    }, 200);
  }
}
