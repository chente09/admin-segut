import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Path } from '../../utils/path';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  paths: Path[] = [
    { path: '/home', nombre: 'Home' },
    { path: '/productos', nombre: 'Productos' },
    { path: '/nosotros', nombre: 'Nosotros' }
  ]
}
