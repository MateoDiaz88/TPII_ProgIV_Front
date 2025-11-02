  import { Pipe, PipeTransform } from '@angular/core';

  @Pipe({
    name: 'timeAgo',
     pure: false
  })
  export class TimeAgoPipe implements PipeTransform {

    transform(value: Date | string): string {
      if (!value) return '';
      const date = new Date(value); 
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      // Si paso menos de un minuto
      if (seconds < 60) return 'Hace un momento';
      // Si paso menos de una hora
      if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
      // Si paso menos de un dia
      if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`;
      // Si paso menos de dos dias
      if (seconds < 172800) return 'Ayer';

      // Si paso mas de un dia, se muestra la fecha exacta
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

  }
