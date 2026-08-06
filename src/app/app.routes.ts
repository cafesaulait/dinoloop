import { Routes } from '@angular/router';
import { Main } from './pages/main/main';
import { Lignes } from './pages/lignes/lignes';
import { Horaires } from './pages/horaires/horaires';
import { Apropos } from './pages/apropos/apropos';
import { Moncompte } from './pages/moncompte/moncompte';
import { Tarfis } from './pages/tarfis/tarfis';
import { Page404 } from './pages/page404/page404';

export const routes: Routes = [
  { path: 'main', component: Main },
  { path: 'lignes', component: Lignes },
  { path: 'horaires', component: Horaires },
  { path: 'apropos', component: Apropos },
  { path: 'moncompte', component: Moncompte },
  { path: 'tarifs', component: Tarfis },
  { path: '**', component: Page404 },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
];
