import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface RegistroPayload {
  nome: string;
  departamento: string;
  data_referencia: string; // yyyy-mm-dd
  quantidade_entregas: number;
  observacao?: string;
}

// Em desenvolvimento local (fora do Docker) troque para http://localhost:8000
const API_URL = 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class RecordService {
  constructor(private http: HttpClient) {}

  createRecord(payload: RegistroPayload): Observable<any> {
    return this.http.post(`${API_URL}/records`, payload);
  }
}
