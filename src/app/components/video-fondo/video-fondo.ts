import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-fondo',
  imports: [],
  templateUrl: './video-fondo.html',
  styleUrl: './video-fondo.css',
})
export class VideoFondo {
  @ViewChild('videoFondo') videoRef!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    const video = this.videoRef.nativeElement;
    video.muted = true; // clave para autoplay
    video.loop = true;
    video.playsInline = true; // para móviles

    // Intentamos reproducir cuando el video esté listo
    video.addEventListener('canplay', () => {
      video.play().catch(err => {
        console.warn('No se pudo reproducir el video automáticamente', err);
      });
    });
  }
}
