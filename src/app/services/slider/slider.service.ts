import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';

// Interfaz para los datos de la imagen
export interface ImageData {
  id: string;
  url: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  constructor(private firestore: Firestore, private storage: Storage) {}

  // Método para cargar una imagen a Firebase Storage
  async uploadImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const filePath = `${file.name.startsWith('slider') ? 'slider' : 'images'}/${file.name}`;
      const fileRef = ref(this.storage, filePath);
      await uploadBytes(fileRef, file);
      return getDownloadURL(fileRef);
    });
    return Promise.all(uploadPromises);
  }
  
  // Guardar múltiples imágenes en Firestore
  async saveMultipleImageData(imagesData: ImageData[]): Promise<any[]> {
    const collectionName = imagesData[0]?.id.startsWith('slider') ? 'slider' : 'images';
    const imagesRef = collection(this.firestore, collectionName);
    const savePromises = imagesData.map((imageData) => addDoc(imagesRef, imageData));
    return Promise.all(savePromises);
  }

  // Método para guardar la información de la imagen en Firestore
  async saveImageData(imageData: ImageData): Promise<any> {
    const imagesRef = collection(this.firestore, 'slider');
    return addDoc(imagesRef, imageData);
  }

  // Obtener todas las imágenes almacenadas en Firestore
  getImages(): Observable<ImageData[]> {
    const imagesRef = collection(this.firestore, 'slider');
    return collectionData(imagesRef, { idField: 'id' }) as Observable<ImageData[]>;
  }

  // Método para eliminar la información de la imagen de Firestore
  async deleteImageData(imageId: string): Promise<void> {
    const docRef = doc(this.firestore, `slider/${imageId}`);
    await deleteDoc(docRef);
  }
}
