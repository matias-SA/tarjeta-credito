import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { TarjetaCredito } from '../models/tarjeta-credito';

@Injectable({
  providedIn: 'root',
})
export class TarjetaService {
  private tarjeta$ = new Subject<any>();

  constructor(private firebase: AngularFirestore) {}

  guardarTarjeta(tarjeta: TarjetaCredito): Promise<any> {
    return this.firebase.collection('tarjetas').add(tarjeta);
  }
  obtenerTarjetas(): Observable<any> {
    return this.firebase
      .collection('tarjetas', (ref) => ref.orderBy('fechaCreacion', 'asc'))
      .snapshotChanges();
  }
  eliminarTarjeta(id: string): Promise<any> {
    return this.firebase.collection('tarjetas').doc(id).delete();
  }
  editarTarjeta(id: string, tarjeta: any): Promise<any> {
    return this.firebase.collection('tarjetas').doc(id).update(tarjeta);
  }
  addTarjetaEdit(tarjeta: TarjetaCredito) {
    this.tarjeta$.next(tarjeta);
  }
  getTarjeta(): Observable<TarjetaCredito> {
    return this.tarjeta$.asObservable();
  }
}
