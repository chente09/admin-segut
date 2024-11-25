import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button'; // Si se quiere usar botones personalizados de NG Zorro
import { PathsService, Path } from '../../services/paths/paths.service';

@Component({
  selector: 'app-admin-paths',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NzTableModule, RouterLink, NzButtonModule],
  templateUrl: './admin-paths.component.html',
  styleUrls: ['./admin-paths.component.css'],
})
export class AdminPathsComponent implements OnInit {
  paths: Path[] = []; // Lista de rutas que se obtiene de la base de datos
  form: FormGroup;
  showForm: boolean = false; // Para controlar si mostrar o no el formulario
  isEditing: boolean = false; // Controla si estamos en modo edición
  selectedPath: Path | null = null; // Ruta seleccionada para editar

  constructor(
    private pathsService: PathsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    // Definir el formulario con validadores para los campos de path y nombre
    this.form = this.formBuilder.group({
      path: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Obtener las rutas al inicializar el componente
    this.getPaths();
  }

  // Mostrar el formulario para agregar una nueva ruta
  showAddForm(): void {
    this.showForm = true;
    this.isEditing = false; // Estamos en modo agregar, no edición
    this.form.reset(); // Limpiar el formulario
  }

  // Método para agregar una nueva ruta
  addPath(): void {
    if (this.form.invalid) {
      console.log('El formulario es inválido:', this.form.value);
      return;
    }
  
    console.log('Formulario válido, enviando datos:', this.form.value);
    this.pathsService
      .createPath(this.form.value)
      .then((docRef) => {
        console.log('Nuevo Path creado con ID:', docRef.id);
        this.getPaths(); // Recargar la lista de paths
        this.form.reset();
        this.showForm = false; // Ocultar el formulario después de agregar la ruta
      })
      .catch((error) => {
        console.log('Error al crear el Path:', error);
      });
  }

  // Obtener la lista de rutas
  getPaths(): void {
    this.pathsService.getPaths().subscribe((ps) => (this.paths = ps));
  }

  // Método para eliminar una ruta
  deletePath(path: Path): void {
    this.pathsService
      .deletePath(path)
      .then(() => {
        this.paths = this.paths.filter((p) => p.id !== path.id);
      })
      .catch((error) => console.log(error));
    this.form.reset();
  }

  // Método para editar una ruta
  editPath(path: Path): void {
    this.showForm = true; // Mostrar el formulario
    this.isEditing = true; // Activar modo edición
    this.selectedPath = path; // Almacenar la ruta que estamos editando

    // Rellenar el formulario con los datos de la ruta seleccionada
    this.form.patchValue({
      path: path.path,
      nombre: path.nombre,
      descripcion: path.descripcion,
    });
  }

  // Método para actualizar una ruta existente
  updatePath(): void {
    if (!this.form.valid || !this.selectedPath) return;
    const updatedPath = { ...this.selectedPath, ...this.form.value }; // Combinar la ruta editada con los nuevos valores

    this.pathsService
      .updatePath(updatedPath)
      .then(() => {
        const index = this.paths.findIndex((p) => p.id === this.selectedPath!.id);
        this.paths[index] = updatedPath;
        this.isEditing = false; // Salir del modo edición
        this.form.reset();
        this.showForm = false; // Ocultar el formulario después de actualizar
      })
      .catch((error) => console.log(error));
  }

  // Método para cancelar la edición
  cancelEdit(): void {
    this.isEditing = false; // Salir del modo edición
    this.showForm = false; // Ocultar el formulario
    this.form.reset(); // Limpiar el formulario
  }
}
