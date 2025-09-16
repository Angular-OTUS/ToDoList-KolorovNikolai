import { Directive, ElementRef, HostListener, inject, input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  
  public appTooltip = input<string>('') ;
  private tooltipEl!: HTMLElement;

  @HostListener('mouseenter') onMouseEnter() {
    this.showTooltip();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hideTooltip();
  }

  // Нужно, потому как после удаления строки, тултип остаётся
  ngOnDestroy() {
    this.hideTooltip();
  }  

  private showTooltip(): void {
    if (!this.appTooltip) return;

    this.tooltipEl = this.renderer.createElement('div');
    this.tooltipEl.innerText = this.appTooltip();

    this.renderer.addClass(this.tooltipEl, 'tooltip');
    this.renderer.setStyle(this.tooltipEl, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipEl, 'background', 'black');
    this.renderer.setStyle(this.tooltipEl, 'color', 'white');
    this.renderer.setStyle(this.tooltipEl, 'padding', '4px 8px');
    this.renderer.setStyle(this.tooltipEl, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltipEl, 'font-size', '12px');
    this.renderer.setStyle(this.tooltipEl, 'pointer-events', 'none');
    this.renderer.setStyle(this.tooltipEl, 'z-index', '1000');

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.tooltipEl, 'top', `${hostPos.top - 30}px`);
    this.renderer.setStyle(this.tooltipEl, 'left', `${hostPos.left}px`);

    this.renderer.appendChild(document.body, this.tooltipEl);
  }  

  private hideTooltip(): void {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);      
    }
  }
}
