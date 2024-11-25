import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { CardsHomeService, CardData } from '../../services/cards-home/cards-home.service';

@Component({
  selector: 'app-admin-cards-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule
  ],
  templateUrl: './admin-cards-home.component.html',
  styleUrls: ['./admin-cards-home.component.css']
})
export class AdminCardsHomeComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef; // Referencia al input de archivo
  cardForm: FormGroup;
  isSubmitting = false;
  cards: CardData[] = [];
  selectedFile: File | null = null;
  editingCardId: string | null = null; // ID de la tarjeta que se está editando


  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    public cardsHomeService: CardsHomeService
  ) {
    this.cardForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      image: [null, [Validators.required]] // Este campo se completará cuando la imagen se suba
    });
  }

  ngOnInit(): void {
    this.loadCards(); // Cargar las tarjetas al inicializar
  }

  // Cargar las tarjetas existentes desde Firestore
  loadCards(): void {
    this.cardsHomeService.getCards().subscribe({
      next: (data) => {
        this.cards = data;
      },
      error: () => {
        this.message.error('Error al cargar las tarjetas');
      }
    });
  }

  // Manejar selección de archivos
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; // Guardar el archivo seleccionado para subirlo luego
      this.cardForm.patchValue({ image: file.name }); // Marcar el campo `image` como completado
    }
  }

  // Limpiar la selección del archivo
  resetFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Resetear el valor del input de archivo
    }
    this.selectedFile = null; // Limpiar la referencia del archivo seleccionado
  }

  startEdit(card: CardData): void {
    this.editingCardId = card.id!;
    this.cardForm.patchValue({
      title: card.title,
      description: card.description,
      image: card.imageUrl, // Muestra el nombre o la URL
    });
  }

  // Guardar los datos del formulario
  async submitForm(): Promise<void> {
    if (this.cardForm.valid) {
      try {
        this.isSubmitting = true;
  
        // Subir la imagen si se seleccionó
        let uploadedImageUrl: string | null = null;
        if (this.selectedFile) {
          uploadedImageUrl = await this.cardsHomeService.uploadImage(this.selectedFile);
        }
  
        // Crear o actualizar los datos de la tarjeta
        const cardData: Partial<CardData> = {
          title: this.cardForm.value.title,
          description: this.cardForm.value.description,
          imageUrl: uploadedImageUrl || this.cardForm.value.image, // Usa la URL existente si no se subió una nueva imagen
        };
  
        if (this.editingCardId) {
          // Editar tarjeta existente
          await this.cardsHomeService.updateCard(this.editingCardId, cardData);
          this.message.success('Tarjeta actualizada correctamente');
        } else {
          // Crear nueva tarjeta
          await this.cardsHomeService.saveCardData(cardData as CardData);
          this.message.success('Tarjeta creada correctamente');
        }
  
        // Resetear formulario y estado
        this.cardForm.reset();
        this.resetFileInput();
        this.editingCardId = null; // Salir del modo de edición
        this.loadCards();
      } catch (error) {
        console.error('Error al guardar los datos en Firestore:', error);
        this.message.error('Error al guardar la tarjeta');
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.message.warning('Por favor, completa todos los campos antes de guardar.');
    }
  }
  
  cancelEdit(): void {
    this.editingCardId = null;
    this.cardForm.reset();
    this.resetFileInput();
  }

  // Eliminar una tarjeta
  async deleteCard(cardId: string): Promise<void> {
    try {
      this.isSubmitting = true; // Opcional: para mostrar un estado de carga
      await this.cardsHomeService.deleteCard(cardId);
      this.message.success('Tarjeta eliminada correctamente');
      this.loadCards(); // Recargar las tarjetas después de eliminar
    } catch (error) {
      console.error('Error al eliminar la tarjeta:', error);
      this.message.error('Error al eliminar la tarjeta');
    } finally {
      this.isSubmitting = false; // Finalizar el estado de carga
    }
  }

}
