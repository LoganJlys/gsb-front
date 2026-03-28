import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SaisieComponent } from './pages/saisie/saisie.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VisiteursComponent } from './pages/visiteurs/visiteurs.component';
import { FichesFraisComponent } from './pages/fiches-frais/fiches-frais.component';
import { DashboardComptableComponent } from './pages/dashboard-comptable/dashboard-comptable.component';
import { StatsComponent } from './pages/stats/stats.component';
import { DetailFicheComponent } from './pages/detail-fiche/detail-fiche.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard-comptable', component: DashboardComptableComponent },
{ path: 'detail-fiche/:id', component: DetailFicheComponent },

  { path: 'dashboard', component: DashboardComponent },
  { path: 'visiteurs', component: VisiteursComponent },
  { path: 'fiches-frais', component: FichesFraisComponent },
  { path: 'saisie', component: SaisieComponent },
  { path: 'saisie/:id', component: SaisieComponent },
  { path: 'stats', component: StatsComponent },
];