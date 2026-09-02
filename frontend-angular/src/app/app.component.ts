import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { RecordService } from './core/record.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  form: FormGroup;
  status: 'idle' | 'sending' | 'success' | 'error' = 'idle';
  errorMessage = '';

  constructor(private fb: FormBuilder, private recordService: RecordService) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      departamento: ['', Validators.required],
      data_referencia: ['', Validators.required],
      quantidade_entregas: [null, [Validators.required, Validators.min(0)]],
      observacao: [''],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status = 'sending';
    this.recordService.createRecord(this.form.value).subscribe({
      next: () => {
        this.status = 'success';
        this.form.reset();
      },
      error: (err) => {
        this.status = 'error';
        this.errorMessage =
          err?.error?.detail ?? 'Não foi possível salvar o registro. Tente novamente.';
      },
    });
  }
}
