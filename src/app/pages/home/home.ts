import { AfterViewInit, Component, HostListener } from '@angular/core';
import { VideoFondo } from '../../components/video-fondo/video-fondo';
import { animate } from 'motion';
import { RouterLink } from '@angular/router';




@Component({
  selector: 'app-home',
  imports: [VideoFondo, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  private ctx!: CanvasRenderingContext2D;
  private stars: { x: number; y: number; alpha: number }[] = [];
  private lastStarTime = 0;

  ngAfterViewInit() {
    animate(".animation", { opacity: [0, 1], transform: ["translateY(40px)", "translateY(0)"] }, { duration: 0.5, ease: "easeOut" });
    const canvas = document.getElementById('stars-trail') as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();


    const animateStars = () => {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.stars.forEach((star, index) => {
        star.alpha -= 0.02;
        if (star.alpha <= 0) this.stars.splice(index, 1);
        else {
          this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          this.ctx.beginPath();
          this.ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
      });
      requestAnimationFrame(animateStars);
    };
    animateStars();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const now = Date.now();

    // Crea una estrella solo cada 50ms (ajustá el valor a gusto)
    if (now - this.lastStarTime > 50) {
      this.stars.push({ x: event.clientX, y: event.clientY, alpha: 1 });
      this.lastStarTime = now;
    }
  }

  @HostListener('window:resize')
  resizeCanvas() {
    const canvas = document.getElementById('stars-trail') as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }


} 
