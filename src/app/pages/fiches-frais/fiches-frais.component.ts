import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-fiches-frais',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './fiches-frais.component.html',
  styleUrl: './fiches-frais.component.css'
})
export class FichesFraisComponent implements OnInit {

  user: any;
  fiches: any[] = [];

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.api.getFichesByVisiteur(this.user.id).subscribe({
      next: (data) => this.fiches = data.map((f: any) => ({
        ...f,
        dateModif: this.parseDate(f.dateModif ?? f.date_modif)
      })),
      error: (err) => console.error(err)
    });
  }

  parseDate(val: any): string | null {
    if (!val) return null;
    if (Array.isArray(val)) {
      const [y, m, d] = val;
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
    return val;
  }

  getMoisFormate(mois: number): string {
    const str = mois.toString();
    const annee = str.substring(0, 4);
    const moisNum = str.substring(4, 6);
    const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${moisNoms[parseInt(moisNum) - 1]} ${annee}`;
  }

  allerSaisie(fiche: any): void {
    this.router.navigate(['/saisie', fiche.id], { queryParams: { mois: fiche.mois } });
  }
}
