import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'localeTime'
})
export class LocaleTimePipe implements PipeTransform {
    transform(value: string): string {
        if(!value) return '';
        const date = new Date(value);
        return date.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Buenos_Aires',
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
}