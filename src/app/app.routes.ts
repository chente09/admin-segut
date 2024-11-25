import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UsersComponent } from './pages/users/users.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { HomeComponent } from './pages/home/home.component';
import { AdminPathsComponent } from './pages/admin-paths/admin-paths.component';
import { AdminImgComponent } from './pages/admin-img/admin-img.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminCardsHomeComponent } from './pages/admin-cards-home/admin-cards-home.component';
import { inject } from '@angular/core';
import { RegistersService } from './services/registers/registers.service';

// Redirigir al login si el usuario no está autenticado
export const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

function isAdmin() {
  const registersService = inject(RegistersService);

  // Verificar si el usuario está autenticado
  if (!registersService.currentRegister) {
    alert('Debes iniciar sesión para acceder a esta página.');
    return false; // Bloquea el acceso
  }

  // Verificar el rol del usuario
  const userRole = registersService.currentRegister.role;
  if (userRole === 'admin') {
    return true; // Permitir el acceso
  }

  // Mostrar mensaje si no es administrador
  alert('Debes ser un administrador para acceder a esta página.');
  return false; // Bloquear el acceso
}


// Definición de rutas
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/admin' },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  {
    path: 'admin-paths',
    component: AdminPathsComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin-images',
    component: AdminImgComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'admin-cards-home', component: AdminCardsHomeComponent, 
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'users',
    component: UsersComponent,
    canMatch: [isAdmin], // Aplicar el guard para verificar si es admin
  },
];
