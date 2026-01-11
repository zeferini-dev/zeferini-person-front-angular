import { Routes } from '@angular/router';
import { PersonListComponent } from './person/person-list.component';
import { PersonFormComponent } from './person/person-form.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'persons' },
	{ path: 'persons', component: PersonListComponent },
	{ path: 'persons/new', component: PersonFormComponent },
	{ path: 'persons/:id/edit', component: PersonFormComponent },
	{ path: '**', redirectTo: 'persons' },
];
