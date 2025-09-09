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
  title = input<string>('');
  type = input<ButtonType>('add');
  disabled = input<boolean>(false);

  click = output<void>();

  classes = computed(() => {   
    return `button--${this.type()}`
  });
}