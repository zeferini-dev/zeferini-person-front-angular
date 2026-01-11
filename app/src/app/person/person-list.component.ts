import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Person } from './person.model';
import { PersonService } from './person.service';
import { ConfirmDialogComponent } from './confirm-dialog.component.js';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.css'
})
export class PersonListComponent implements OnInit, OnDestroy {
  private readonly svc = inject(PersonService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroy$ = new Subject<void>();

  protected readonly persons = signal<Person[]>([]);
  protected readonly loading = signal<boolean>(true);
  protected readonly displayedColumns = ['id', 'name', 'email', 'actions'];

  ngOnInit() {
    // Carrega dados inicialmente
    this.load();
    
    // Observa trigger de refresh do serviço
    this.svc.refresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.load();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load() {
    this.loading.set(true);
    this.svc.list().subscribe({
      next: (data) => {
        this.persons.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Erro ao carregar pessoas', 'Fechar', { duration: 4000 });
      }
    });
  }

  onRefreshNow() {
    this.load();
    this.snackBar.open('Dados atualizados', 'Fechar', { duration: 2000 });
  }

  onDelete(person: Person) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar exclusão',
        message: `Deseja realmente excluir ${person.name}?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.svc.remove(person.id).subscribe({
          next: () => {
            this.snackBar.open('Pessoa excluída com sucesso', 'Fechar', { duration: 3000 });
            this.load();
          },
          error: () => {
            this.snackBar.open('Erro ao excluir pessoa', 'Fechar', { duration: 4000 });
          }
        });
      }
    });
  }
}
