import { Component, OnInit } from '@angular/core';
import { ImagesService, ImageData } from '../../services/imagenes/images.service';
import { SliderService } from '../../services/slider/slider.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-img',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-img.component.html',
  styleUrls: ['./admin-img.component.css']
})
export class AdminImgComponent implements OnInit {
  images: ImageData[] = []; // Lista de imágenes de ImagesService
  sliders: ImageData[] = []; // Lista de imágenes de SliderService
  isLoading: boolean = false; // Indicador de carga

  editingImageId: string | null = null; // ID de la imagen en edición
  newName: string = ''; // Nuevo nombre de la imagen en edición

  editingSliderId: string | null = null; // ID de la slider en edición
  newSliderName: string = ''; // Nuevo nombre de la slider en edición

  selectedFiles: { [key: string]: File[] } = { images: [], sliders: [] };

  constructor(private imagesService: ImagesService, private sliderService: SliderService) { }

  ngOnInit(): void {
    this.loadImages();
    this.loadSliders();
  }

  // Cargar imágenes de ImagesService
  loadImages(): void {
    this.imagesService.getImages().subscribe((images) => {
      this.images = images;
    });
  }

  // Cargar imágenes de SliderService
  loadSliders(): void {
    this.sliderService.getImages().subscribe((sliders) => {
      this.sliders = sliders;
    });
  }

  // Activar el modo de edición para ImagesService
  editImageName(imageId: string, currentName: string): void {
    this.editingImageId = imageId;
    this.newName = currentName;
  }

  // Guardar el nuevo nombre en ImagesService
  async saveImageName(imageId: string): Promise<void> {
    if (!this.newName.trim()) {
      alert('El nombre no puede estar vacío.');
      return;
    }

    this.isLoading = true;
    try {
      await this.imagesService.updateImageName(imageId, this.newName.trim());
      this.editingImageId = null;
      this.loadImages();
    } catch (error) {
      console.error('Error al actualizar el nombre de la imagen:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Cancelar edición para ImagesService
  cancelEditImage(): void {
    this.editingImageId = null;
    this.newName = '';
  }

  // Activar el modo de edición para SliderService
  editSliderName(sliderId: string, currentName: string): void {
    this.editingSliderId = sliderId;
    this.newSliderName = currentName;
  }

  // Guardar el nuevo nombre en SliderService
  async saveSliderName(sliderId: string): Promise<void> {
    if (!this.newSliderName.trim()) {
      alert('El nombre no puede estar vacío.');
      return;
    }

    this.isLoading = true;
    try {
      // Actualizar el nombre del slider
      const slider = this.sliders.find((s) => s.id === sliderId);
      if (slider) {
        slider.name = this.newSliderName.trim();
      }
      this.editingSliderId = null;
      this.loadSliders();
    } catch (error) {
      console.error('Error al actualizar el nombre del slider:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Cancelar edición para SliderService
  cancelEditSlider(): void {
    this.editingSliderId = null;
    this.newSliderName = '';
  }

  // Subida de archivos
  onFilesSelected(event: Event, type: 'images' | 'sliders'): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles[type] = Array.from(input.files);
    }
  }

  async uploadFiles(type: 'images' | 'sliders'): Promise<void> {
    if (!this.selectedFiles[type]?.length) {
      alert(`No hay archivos seleccionados para ${type}`);
      return;
    }

    this.isLoading = true;

    try {
      const service = type === 'images' ? this.imagesService : this.sliderService;
      const urls = await service.uploadImages(this.selectedFiles[type]);
      const imageData: ImageData[] = urls.map((url, index) => ({
        id: `${type}-${Date.now()}-${index}`, // Generar un ID único
        url,
        name: this.selectedFiles[type][index].name,
      }));

      await service.saveMultipleImageData(imageData);

      alert(`Se han subido ${imageData.length} archivos para ${type}`);
      this.selectedFiles[type] = []; // Limpiar la selección
      type === 'images' ? this.loadImages() : this.loadSliders();
    } catch (error) {
      console.error(`Error al subir archivos de ${type}:`, error);
    } finally {
      this.isLoading = false;
    }
  }
  // Eliminar imagen de ImagesService
  async deleteImage(imageId: string): Promise<void> {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta imagen?');
    if (!confirmDelete) return;

    this.isLoading = true;
    try {
      await this.imagesService.deleteImageData(imageId);
      this.loadImages(); // Recargar imágenes después de eliminar
      alert('Imagen eliminada exitosamente.');
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Eliminar slider de SliderService
  async deleteSlider(sliderId: string): Promise<void> {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este slider?');
    if (!confirmDelete) return;

    this.isLoading = true;
    try {
      await this.sliderService.deleteImageData(sliderId);
      this.loadSliders(); // Recargar sliders después de eliminar
      alert('Slider eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar el slider:', error);
    } finally {
      this.isLoading = false;
    }
  }

}
