import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Path } from '../../utils/path';
import { CommonModule } from '@angular/common';
import { ImagesService, ImageData } from '../../services/imagenes/images.service';
import { UsersService } from '../../services/users/users.service';
import {Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  menuItems = [
    {
      label: 'Usuarios',
      route: '/users',
      icon: 'bi-people-fill' // Ícono de Bootstrap Icons
    },
    {
      label: 'Rutas',
      route: '/admin-paths',
      icon: 'bi-map-fill'
    },
    {
      label: 'Imágenes',
      route: '/admin-images',
      icon: 'bi-image-fill'
    }
  ];

  paths: Path[] = [];
  logoUrl: string = 'assets/img/logo.png'; // URL predeterminada para el logo

  constructor(
    private router: Router,
    private usersService: UsersService,
    private imagesService: ImagesService,
  ) {}

  ngOnInit(): void {
    this.loadLogo();
  }

  loadLogo(): void {
    this.imagesService.getImages().subscribe((images: ImageData[]) => {
      // Buscar la imagen específica del logo en la colección
      const logoImage = images.find(image => image.name === 'logo.jpg'); // Suponiendo que identificas el logo por el nombre
      if (logoImage && logoImage.url) {
        this.logoUrl = logoImage.url; // Actualizar la URL del logo
      }
    });
  }

  isLogged(): boolean { 
    return this.usersService.getCurrentUser() !== null;
  }

  logout(): void {
    this.usersService.logout();
    this.router.navigate(['/admin']);
  }
}
