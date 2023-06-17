import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { BetError } from 'src/app/shared/classes/list-exception.class';

@Directive({
  selector: '[appError]',
  standalone: true,
})
export class ErrorDirective implements OnChanges {
  @Input() badBets!: BetError[];

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['badBets'] && !changes['badBets'].firstChange) {
      let text = this.el.nativeElement.textContent;
      let highlightedText = '';
      let currentIndex = 0;
      for (let { start, end } of this.badBets) {
        end += 1; 
        let beforeText = text.slice(currentIndex, start);
        let highlightedPart = text.slice(start, end);
        highlightedText += `${beforeText}<span style="background-color: #ff6262">${highlightedPart}</span>`;
        currentIndex = end;
      }
      highlightedText += text.slice(currentIndex);
      this.el.nativeElement.innerHTML = highlightedText;
    }
  }
}
