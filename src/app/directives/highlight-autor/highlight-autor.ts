  import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

  @Directive({
    selector: '[appHighlightAutor]'
  })
  export class HighlightAutor implements OnChanges {

    @Input("appHighlightAutor") esAutor: boolean = false;

    constructor(private el:ElementRef, private renderer: Renderer2) { }

    ngOnChanges(){
      if(this.esAutor){
          this.renderer.setStyle(this.el.nativeElement, 'color', "var(--violeta-principal)");
        this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
      } else {
        this.renderer.removeStyle(this.el.nativeElement, 'color');
        this.renderer.removeStyle(this.el.nativeElement, 'font-weight');
      }
    } 

  }
