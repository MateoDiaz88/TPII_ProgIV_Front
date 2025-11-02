import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output, HostListener } from '@angular/core';

@Directive({
  selector: '[appDebounceClick]'
})
export class DebounceClick {

  @Input() debounceTime = 4000;
  @Output() appDebounceClick = new EventEmitter();
  
  private timeoutId: any;
  private isDisabled = false;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.isDisabled) {
      return;
    }
    
    this.isDisabled = true;
    this.appDebounceClick.emit(event);
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      this.isDisabled = false;
    }, this.debounceTime);
  }

}
