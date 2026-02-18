import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-signals-demo',
  standalone: true,
  template: `
    <h1>Signals Demo</h1>

    <p>Contador: {{ count() }}</p>
    <p>Doble: {{ doubleCount() }}</p>

    <button (click)="increment()">+1</button>
    <button (click)="decrement()">-1</button>
  `,
})
export class SignalsDemoComponent {

  // Estado reactivo
  count = signal(0);

  // Valor derivado
  doubleCount = computed(() => this.count() * 2);

  constructor() {
    // Se ejecuta automáticamente cuando cambia count
    effect(() => {
      console.log('El contador cambió a:', this.count());
    });
  }

  increment() {
    this.count.update(v => v + 1);
  }

  decrement() {
    this.count.update(v => v - 1);
  }
}
