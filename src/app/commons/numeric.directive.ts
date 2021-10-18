import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[inputNumericDirective]'
})
export class NumericDirective {

  // tslint:disable-next-line: no-input-rename
  @Input('decimals') decimals = 0;

  private specialKeys = [
    'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete', '.',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
  ];

  private check(value: string, decimals: number): RegExpMatchArray {
    if (decimals <= 0) {
      return String(value).match(new RegExp(/^\d+$/));
    } else {
      const regExpString = '^\\s*((\\d+(\\.\\d{0,' + decimals + '})?)|((\\d*(\\.\\d{1,' + decimals + '}))))\\s*$';
      return String(value).match(new RegExp(regExpString));
    }
  }

  constructor(private el: ElementRef) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !this.check(next, this.decimals)) {
      event.preventDefault();
    }
  }

}
