import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-comptable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-comptable.component.html',
  styleUrl: './dashboard-comptable.component.css'
})
export class DashboardComptableComponent implements OnInit {

  user: any;
  fiches: any[] = [];
  ongletActif: string = 'toutes';

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadFiches();
  }

  loadFiches(): void {
    this.api.getFiches().subscribe({
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

  getFichesFiltrees(): any[] {
    if (this.ongletActif === 'toutes') return this.fiches;
    return this.fiches.filter(f => f.statut === this.ongletActif);
  }

  getCount(statut: string): number {
    if (statut === 'toutes') return this.fiches.length;
    return this.fiches.filter(f => f.statut === statut).length;
  }

  changerStatut(ficheId: number, statut: string): void {
    const fiche = this.fiches.find(f => f.id === ficheId);
    if (!fiche) return;

    const ficheMAJ = {
      ...fiche,
      statut: statut,
      dateModif: new Date().toISOString().split('T')[0],
      user: { id: fiche.user?.id }
    };

    this.api.updateFiche(ficheId, ficheMAJ).subscribe({
      next: () => {
        fiche.statut = statut;
        fiche.dateModif = new Date().toISOString().split('T')[0];
      },
      error: (err) => console.error(err)
    });
  }

  getStatutStyle(statut: string): string {
    switch(statut) {
      case 'EN_COURS': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'CLOTUREE': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'VALIDEE': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'MISE_EN_PAIEMENT': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'REMBOURSEE': return 'bg-green-50 text-green-600 border-green-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  }

  getStatutLabel(statut: string): string {
    switch(statut) {
      case 'EN_COURS': return 'En cours';
      case 'CLOTUREE': return 'Clôturée';
      case 'VALIDEE': return 'Validée';
      case 'MISE_EN_PAIEMENT': return 'Mise en paiement';
      case 'REMBOURSEE': return 'Remboursée';
      default: return statut;
    }
  }

  getProchainStatut(statut: string): string | null {
    switch(statut) {
      case 'CLOTUREE': return 'VALIDEE';
      case 'VALIDEE': return 'MISE_EN_PAIEMENT';
      case 'MISE_EN_PAIEMENT': return 'REMBOURSEE';
      default: return null;
    }
  }

  getProchainStatutLabel(statut: string): string | null {
    switch(statut) {
      case 'CLOTUREE': return 'Valider';
      case 'VALIDEE': return 'Mettre en paiement';
      case 'MISE_EN_PAIEMENT': return 'Marquer remboursée';
      default: return null;
    }
  }

  getMoisFormate(mois: number): string {
    if (!mois) return '-';
    const str = mois.toString();
    const annee = str.substring(0, 4);
    const moisNum = str.substring(4, 6);
    const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${moisNoms[parseInt(moisNum) - 1]} ${annee}`;
  }
  voirDetail(ficheId: number): void {
    this.router.navigate(['/detail-fiche', ficheId]);
}
}