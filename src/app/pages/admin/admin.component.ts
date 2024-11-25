import { Component } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(
    public usersService: UsersService,
    private route: ActivatedRoute, 
    private router: Router
  ) { }

  ngOnInit() {
    // Captura los parámetros de la URL, por ejemplo para identificar pagos u otras variables
    this.route.queryParams.subscribe(params => {
      console.log('Payment ID:', params['paymentId']);
    });
  }

  // Verifica si el usuario está logueado
  isLogged(): boolean { 
    return this.usersService.getCurrentUser() !== null;
  }

  // Cierra la sesión y redirige a la página principal
  logout(): void {
    this.usersService.logout();
    this.router.navigate(['/home']);
  }

  // Métodos para navegar a las rutas de administración
  goToUsers(): void {
    this.router.navigate(['/users']);
  }

  goToPaths(): void {
    this.router.navigate(['/admin-paths']);
  }

  goToImages(): void {
    this.router.navigate(['/admin-images']);
  }

  goToInit(): void {
    this.router.navigate(['/login']);
  }

  goToCards(): void {
    this.router.navigate(['/admin-cards-home']);
  }
}
