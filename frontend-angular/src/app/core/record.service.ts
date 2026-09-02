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

// Resolve API URL automaticamente:
// - em localhost usa http://localhost:8000
// - em Docker Compose usa http://backend:8000
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_URL = hostname === 'localhost' || hostname === '127.0.0.1' ? 'http://localhost:8000' : 'http://backend:8000';

@Injectable({ providedIn: 'root' })
export class RecordService {
  constructor(private http: HttpClient) {}

  createRecord(payload: RegistroPayload): Observable<any> {
    return this.http.post(`${API_URL}/records`, payload);
  }
}
