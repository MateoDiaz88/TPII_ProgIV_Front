import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ConfirmExitGuard implements CanDeactivate<unknown> {
  async canDeactivate(): Promise<boolean>{
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Estas seguro de salir?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, salir',
      cancelButtonText: 'Cancelar',
      background: "#111827",
      color: "white",
      width: '400px',
      padding: '2em',
      grow: 'row'  
    });

    return result.isConfirmed;
  }
}
