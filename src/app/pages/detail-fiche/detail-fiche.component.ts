import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-detail-fiche',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-fiche.component.html',
  styleUrl: './detail-fiche.component.css'
})
export class DetailFicheComponent implements OnInit {

  fiche: any = null;
  lignesForfait: any[] = [];
  lignesHorsForfait: any[] = [];
  succes = '';
  erreur = '';
  saving = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/dashboard-comptable']);
      return;
    }
    this.loadFiche(Number(id));
  }

  loadFiche(id: number): void {
    this.api.getFicheById(id).subscribe({
      next: (data) => {
        this.fiche = data;
        this.loadLignesForfait(id);
        this.loadLignesHorsForfait(id);
      },
      error: () => this.router.navigate(['/dashboard-comptable'])
    });
  }

  loadLignesForfait(ficheId: number): void {
    this.api.getLignesForfaitByFiche(ficheId).subscribe({
      next: (data) => this.lignesForfait = data,
      error: (err) => console.error(err)
    });
  }

  loadLignesHorsForfait(ficheId: number): void {
    this.api.getLignesHorsForfaitByFiche(ficheId).subscribe({
      next: (data) => this.lignesHorsForfait = data,
      error: (err) => console.error(err)
    });
  }

  sauvegarderForfait(): void {
    this.saving = true;
    const updates = this.lignesForfait.map(ligne =>
      this.api.updateLigneForfait(ligne.id, ligne).toPromise()
    );
    Promise.all(updates).then(() => {
      this.succes = 'Frais forfait sauvegardés';
      this.saving = false;
      setTimeout(() => this.succes = '', 2000);
    }).catch(() => {
      this.erreur = 'Erreur lors de la sauvegarde';
      this.saving = false;
    });
  }

  refuserLigne(ligne: any): void {
    if (ligne.libelle.startsWith('REFUSE : ')) return;
    const ligneMAJ = {
      ...ligne,
      libelle: `REFUSE : ${ligne.libelle}`,
      ficheFrais: { id: this.fiche.id }
    };
    this.api.refuserLigneHorsForfait(ligne.id, ligneMAJ).subscribe({
      next: (data) => {
        ligne.libelle = data.libelle;
        this.succes = 'Frais refusé';
        setTimeout(() => this.succes = '', 2000);
      },
      error: () => this.erreur = 'Erreur lors du refus'
    });
  }

  validerFiche(): void {
    const ficheMAJ = {
      ...this.fiche,
      statut: 'VALIDEE',
      dateModif: new Date().toISOString().split('T')[0],
      user: { id: this.fiche.user?.id }
    };
    this.api.updateFiche(this.fiche.id, ficheMAJ).subscribe({
      next: () => {
        this.succes = 'Fiche validée';
        setTimeout(() => this.router.navigate(['/dashboard-comptable']), 1500);
      },
      error: () => this.erreur = 'Erreur lors de la validation'
    });
  }

  getTotalForfait(): number {
    return this.lignesForfait.reduce((total, l) =>
      total + (l.quantite * (l.fraisForfait?.montant || 0)), 0);
  }

  getTotalHorsForfait(): number {
    return this.lignesHorsForfait
      .filter(l => !l.libelle.startsWith('REFUSE : '))
      .reduce((total, l) => total + (l.montant || 0), 0);
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
}