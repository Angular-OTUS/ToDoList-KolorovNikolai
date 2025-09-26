import { Component, computed, input, output } from '@angular/core';
import { ButtonType } from '../../models/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  public title = input<string>('');
  public type = input<ButtonType>('add');
  public disabled = input<boolean>(false);

  public click = output<MouseEvent>();

  public classes = computed(() => {   
    return `button__${this.type()}`
  });

  public onClick(event: MouseEvent) {
    this.click.emit(event);
  }  
}