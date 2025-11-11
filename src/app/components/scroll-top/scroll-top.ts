import { AfterViewInit, Component, effect, Host, HostListener, signal } from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-scroll-top',
  imports: [],
  templateUrl: './scroll-top.html',
  styleUrl: './scroll-top.css',
})
export class ScrollTop {
  showButton = signal(false);

  constructor() {
    // efecto que reacciona al cambio del signal
    effect(() => {
      if (this.showButton()) {
        // Esperamos un tick para que el elemento exista en el DOM
        setTimeout(() => {
          animate(".scroll-fade",
            { opacity: [0, 1], transform: ["translateY(40px)", "translateY(0)"] },
            { duration: 0.5, ease: "easeOut" }
          );
        });
      }
    });
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const offSet = window.pageYOffset;
    this.showButton.set(offSet > 300);
  }


  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
