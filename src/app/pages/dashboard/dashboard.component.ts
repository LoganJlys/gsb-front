import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  fiches: any[] = [];
  ficheMoisCourant: any = null;
  user: any;
  moisCourant: number = 0;
  loading = false;

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.moisCourant = this.getMoisCourant();
    this.loadFiches();
    this.loadFicheMoisCourant();
  }

  getMoisCourant(): number {
    const now = new Date();
    const annee = now.getFullYear();
    const mois = String(now.getMonth() + 1).padStart(2, '0');
    return parseInt(`${annee}${mois}`);
  }

  parseDate(val: any): string | null {
    if (!val) return null;
    if (Array.isArray(val)) {
      const [y, m, d] = val;
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
    return val;
  }

  loadFiches(): void {
    this.api.getFichesByVisiteur(this.user.id).subscribe({
      next: (data) => this.fiches = data.map((f: any) => ({
        ...f,
        dateModif: this.parseDate(f.dateModif ?? f.date_modif)
      })),
      error: (err) => console.error(err)
    });
  }

  loadFicheMoisCourant(): void {
    this.api.getFicheByMois(this.user.id, this.moisCourant).subscribe({
      next: (data) => this.ficheMoisCourant = {
        ...data,
        dateModif: this.parseDate(data.dateModif ?? data.date_modif)
      },
      error: () => this.ficheMoisCourant = null
    });
  }

  creerFicheMoisCourant(): void {
    this.loading = true;
    const fiche = {
      mois: this.moisCourant,
      dateModif: new Date().toISOString().split('T')[0],
      user: { id: this.user.id }
    };
    this.api.createFiche(fiche).subscribe({
      next: (data) => {
        this.ficheMoisCourant = data;
        this.fiches.unshift(data);
        this.loading = false;
        this.router.navigate(['/saisie', data.id], { queryParams: { mois: data.mois } });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  allerSaisie(ficheId: number, mois: number): void {
    this.router.navigate(['/saisie', ficheId], { queryParams: { mois } });
  }

  getMoisFormate(mois: number): string {
    const str = mois.toString();
    const annee = str.substring(0, 4);
    const moisNum = str.substring(4, 6);
    const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${moisNoms[parseInt(moisNum) - 1]} ${annee}`;
  }
}