import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-saisie',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './saisie.component.html',
  styleUrl: './saisie.component.css'
})
export class SaisieComponent implements OnInit {

  user: any;
  fiche: any = null;
  ficheMois: number = 0;
  dateMin: string = '';
  dateMax: string = '';
  lignesForfait: any[] = [];
  lignesHorsForfait: any[] = [];

  nouvelleLigne = {
    date: '',
    libelle: '',
    montant: null as number | null
  };

  erreur = '';
  succes = '';
  saving = false;

  constructor(
    private api: ApiService,
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    const ficheId = this.route.snapshot.paramMap.get('id');
    if (!ficheId) {
      this.router.navigate(['/dashboard']);
      return;
    }
    const moisParam = this.route.snapshot.queryParamMap.get('mois');
    this.ficheMois = moisParam ? Number(moisParam) : 0;
    if (this.ficheMois > 0) {
      const str = this.ficheMois.toString();
      const annee = str.substring(0, 4);
      const mois = str.substring(4, 6);
      const lastDay = new Date(Number(annee), Number(mois), 0).getDate();
      this.dateMin = `${annee}-${mois}-01`;
      this.dateMax = `${annee}-${mois}-${String(lastDay).padStart(2, '0')}`;
    }
    this.loadFiche(Number(ficheId));
  }

  loadFiche(ficheId: number): void {
    console.log('Chargement fiche ID:', ficheId);
    this.api.getLignesForfaitByFiche(ficheId).subscribe({
      next: (data) => {
        console.log('Lignes reçues:', data.length, data);
        this.lignesForfait = data;
        this.fiche = { id: ficheId };
        this.loadLignesHorsForfait(ficheId);
      },
      error: () => this.router.navigate(['/dashboard'])
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

  ajouterHorsForfait(): void {
    this.erreur = '';
    if (!this.nouvelleLigne.date || !this.nouvelleLigne.libelle || !this.nouvelleLigne.montant) {
      this.erreur = 'Tous les champs sont obligatoires';
      return;
    }

    const ligne = {
      date: this.nouvelleLigne.date,
      libelle: this.nouvelleLigne.libelle,
      montant: this.nouvelleLigne.montant,
      ficheFrais: { id: this.fiche.id }
    };

    this.api.createLigneHorsForfait(ligne).subscribe({
      next: (data) => {
        this.lignesHorsForfait.push(data);
        this.nouvelleLigne = { date: '', libelle: '', montant: null };
        this.succes = 'Frais ajouté';
        setTimeout(() => this.succes = '', 2000);
      },
      error: () => this.erreur = 'Erreur lors de l\'ajout'
    });
  }

  supprimerHorsForfait(id: number): void {
    this.api.deleteLigneHorsForfait(id).subscribe({
      next: () => {
        this.lignesHorsForfait = this.lignesHorsForfait.filter(l => l.id !== id);
        this.succes = 'Frais supprimé';
        setTimeout(() => this.succes = '', 2000);
      },
      error: () => this.erreur = 'Erreur lors de la suppression'
    });
  }

  envoyerFiche(): void {
    const ficheMAJ = {
        ...this.fiche,
        statut: 'CLOTUREE',
        dateModif: new Date().toISOString().split('T')[0],
        user: { id: this.user.id }
    };

    this.api.updateFiche(this.fiche.id, ficheMAJ).subscribe({
        next: () => {
            this.succes = 'Fiche envoyée au comptable';
            setTimeout(() => this.router.navigate(['/dashboard']), 1500);
        },
        error: () => this.erreur = 'Erreur lors de l\'envoi'
    });
}

  getTotalForfait(): number {
    return this.lignesForfait.reduce((total, l) =>
      total + (l.quantite * (l.fraisForfait?.montant || 0)), 0);
  }

  getTotalHorsForfait(): number {
    return this.lignesHorsForfait.reduce((total, l) => total + (l.montant || 0), 0);
  }
  
}