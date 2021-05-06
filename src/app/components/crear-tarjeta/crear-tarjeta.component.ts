import { ElementSchemaRegistry } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/tarjeta-credito';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css'],
})
export class CrearTarjetaComponent implements OnInit {
  loading: boolean = false;
  titulo: string = 'Crear tarjeta';
  id: string | undefined;
  form: FormGroup = this.fb.group({
    titular: ['', Validators.required],
    numeroTarjeta: [
      '',
      [Validators.required, Validators.maxLength(16), Validators.minLength(16)],
    ],
    fechaExpiracion: [
      '',
      [Validators.required, Validators.maxLength(5), Validators.minLength(5)],
    ],
    cvv: [
      '',
      [Validators.required, Validators.maxLength(3), Validators.minLength(3)],
    ],
  });
  constructor(
    private fb: FormBuilder,
    private tarjetaSvc: TarjetaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.tarjetaSvc.getTarjeta().subscribe((data) => {
      this.id = data.id;
      this.titulo = 'Editar tarjeta';
      this.form.patchValue({
        titular: data.titular,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion,
        cvv: data.cvv,
      });
    });
  }

  guardarTarjeta() {
    if (this.id === undefined) {
      // creamos nueva tarjeta
      this.agregarTarjeta();
    } else {
      // editamos nueva tarjeta
      this.editarTarjeta(this.id);
    }
  }

  editarTarjeta(id) {
    const TARJETA: any = {
      titular: this.form.value.titular,
      cvv: this.form.value.cvv,
      fechaExpiracion: this.form.value.fechaExpiracion,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaActualizacion: new Date(),
    };
    this.loading = true;
    this.tarjetaSvc.editarTarjeta(this.id, TARJETA).then(
      () => {
        this.loading = false;
        this.titulo = 'Agregar tarjeta';
        this.form.reset();
        this.id = undefined;
        this.toastr.info(
          'La tarjeta fue actualizada con exito!',
          'Registro actualizado'
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  agregarTarjeta() {
    const TARJETA: TarjetaCredito = {
      titular: this.form.value.titular,
      cvv: this.form.value.cvv,
      fechaExpiracion: this.form.value.fechaExpiracion,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
    this.loading = true;
    this.tarjetaSvc.guardarTarjeta(TARJETA).then(
      () => {
        this.toastr.success(
          'La tarjeta fue registrada con exito!',
          'Tarjeta registrada'
        );
        this.loading = false;
        this.form.reset();
      },
      (error) => {
        console.log(error);
        this.toastr.error('Opps... Ocurrio un error', 'Error');
      }
    );
  }
}
