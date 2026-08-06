import { Routes } from '@angular/router';
import { Main } from './pages/main/main';
import { Lignes } from './pages/lignes/lignes';

export const routes: Routes = [
  { path: 'main', component: Main },
  { path: 'lignes', component: Lignes },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
];
