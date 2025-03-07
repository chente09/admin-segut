import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { RegistersService, Register } from '../../services/registers/registers.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { NzOptionComponent } from 'ng-zorro-antd/select';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzTableModule, 
    NzFormModule, 
    CommonModule, 
    NzSelectComponent, 
    NzOptionComponent, 
    FormsModule, 
    NzModalModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  registers: Register[] = [];
  isEditModalVisible: boolean = false; // Controla la visibilidad del modal
  selectedUser: Register | null = null; // Usuario actualmente seleccionado para editar

  constructor(
    private registersService: RegistersService, 
    private route: ActivatedRoute, 
    private router: Router) {}

  ngOnInit(): void {
    this.getRegisters();
  }

  getRegisters(): void {
    this.registersService.getRegisters().subscribe((rs) => (this.registers = rs));
  }

  // Método para abrir el modal
  openEditModal(data: Register): void {
    this.selectedUser = { ...data }; // Clonar el objeto para evitar modificar el original directamente
    this.isEditModalVisible = true;
  }

  // Método para cerrar el modal
  closeEditModal(): void {
    this.isEditModalVisible = false;
    this.selectedUser = null;
  }

  // Guardar cambios de rol
  saveEditRole(): void {
    if (this.selectedUser) {
      this.registersService
        .updateRegister(this.selectedUser)
        .then(() => {
          console.log(`Rol actualizado para ${this.selectedUser?.nickname}`);
          this.closeEditModal();
        })
        .catch((error) => {
          console.error('Error al actualizar el rol:', error);
        });
    }
  }

  // Método para eliminar usuario
  onDeleteUser(data: Register): void {
    if (confirm(`¿Estás seguro de eliminar a ${data.nickname}?`)) {
      this.registersService
        .deleteRegister(data)
        .then(() => {
          console.log(`Usuario eliminado: ${data.nickname}`);
          this.registers = this.registers.filter((user) => user.uid !== data.uid);
        })
        .catch((error) => {
          console.error('Error al eliminar el usuario:', error);
        });
    }
  }

  updateRole(user: Register): void {
    this.registersService
      .updateRegister(user)
      .then(() => {
        console.log(`Rol actualizado para ${user.nickname} a ${user.role}`);
      })
      .catch((error) => {
        console.error('Error al actualizar el rol:', error);
      });
  }

  onAddUser(): void {
    this.router.navigate(['/register']);
  }
}
