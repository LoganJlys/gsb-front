import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getFiches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/fiches`);
  }

  getFichesByVisiteur(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/fiches/visiteur/${userId}`);
  }

  getFicheByMois(userId: number, mois: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fiches/visiteur/${userId}/mois/${mois}`);
  }

  createFiche(fiche: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/fiches`, fiche);
  }

  updateFiche(id: number, fiche: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/fiches/${id}`, fiche);
  }

  getLignesForfaitByFiche(ficheId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/lignes-forfait/fiche/${ficheId}`);
  }

  updateLigneForfait(id: number, ligne: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/lignes-forfait/${id}`, ligne);
  }

  getLignesHorsForfaitByFiche(ficheId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/lignes-hors-forfait/fiche/${ficheId}`);
  }

  createLigneHorsForfait(ligne: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/lignes-hors-forfait`, ligne);
  }

  deleteLigneHorsForfait(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/lignes-hors-forfait/${id}`);
  }
  getFicheById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fiches/${id}`);
}

refuserLigneHorsForfait(id: number, ligne: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/lignes-hors-forfait/${id}`, ligne);
}

}