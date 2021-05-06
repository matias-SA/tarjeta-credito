import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/tarjeta-credito';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-listar-tarjeta',
  templateUrl: './listar-tarjeta.component.html',
  styleUrls: ['./listar-tarjeta.component.css'],
})
export class ListarTarjetaComponent implements OnInit {
  listTarjetas: TarjetaCredito[] = [];
  constructor(
    private tarjetaSvc: TarjetaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerTarjeta();
  }
  obtenerTarjeta() {
    this.tarjetaSvc.obtenerTarjetas().subscribe((dat) => {
      this.listTarjetas = [];
      dat.forEach((element) => {
        this.listTarjetas.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
    });
    console.log(this.listTarjetas);
  }
  eliminarTarjeta(id) {
    this.tarjetaSvc.eliminarTarjeta(id).then(
      () => {
        this.toastr.error('Tarjeta eliminada con exito!', 'Registro eliminado');
      },
      (error) => {
        this.toastr.error(
          'La tarjeta no pudo ser eliminada',
          'Registro eliminado'
        );
      }
    );
  }
  editarTarjeta(tarjeta: TarjetaCredito) {
    this.tarjetaSvc.addTarjetaEdit(tarjeta);
  }
}
