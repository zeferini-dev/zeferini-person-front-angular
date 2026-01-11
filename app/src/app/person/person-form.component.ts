import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Person } from './person.model';
import { PersonService } from './person.service';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './person-form.component.html',
  styleUrl: './person-form.component.css'
})
export class PersonFormComponent implements OnInit {
  private readonly svc = inject(PersonService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly id = signal<string | null>(null);
  protected readonly isEdit = computed(() => this.id() !== null);
  protected readonly loading = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(180)]]
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(idParam);
      this.loadPerson(idParam);
    }
  }

  loadPerson(id: string) {
    this.loading.set(true);
    this.svc.get(id).subscribe({
      next: (person: Person) => {
        this.form.patchValue({
          name: person.name,
          email: person.email
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Erro ao carregar pessoa', 'Fechar', { duration: 4000 });
        this.router.navigate(['/persons']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Por favor, corrija os erros no formulário', 'Fechar', { duration: 3000 });
      return;
    }

    this.saving.set(true);
    const formValue = this.form.value;
    const data = {
      name: formValue.name!,
      email: formValue.email!
    };

    const id = this.id();
    const obs = id ? this.svc.update(id, data) : this.svc.create(data);

    obs.subscribe({
      next: () => {
        this.saving.set(false);
        const message = id ? 'Pessoa atualizada com sucesso' : 'Pessoa criada com sucesso';
        this.snackBar.open(message, 'Fechar', { duration: 3000 });
        
        // Triggera refresh na lista
        this.svc.triggerRefresh();
        
        // Navega para a lista
        this.router.navigate(['/persons']);
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Erro ao salvar pessoa', 'Fechar', { duration: 4000 });
      }
    });
  }

  getErrorMessage(field: 'name' | 'email'): string {
    const control = this.form.get(field);
    if (!control?.errors) return '';

    if (control.errors['required']) {
      return 'Este campo é obrigatório';
    }
    if (control.errors['email']) {
      return 'E-mail inválido';
    }
    if (control.errors['maxlength']) {
      const max = control.errors['maxlength'].requiredLength;
      return `Máximo de ${max} caracteres`;
    }
    return '';
  }
}
