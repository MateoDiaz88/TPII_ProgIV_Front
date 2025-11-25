import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appShowIf]'
})
export class ShowIfDirective {

  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  @Input() set appShowIf(condition: boolean) {

    if (condition && !this.hasView) {
      // Mostrar contenido
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    }
    else if (!condition && this.hasView) {
      // Ocultar contenido
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

