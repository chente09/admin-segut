import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';

// Interfaz para los datos de la tarjeta
export interface CardData {
  id?: string;
  imageUrl: string;
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CardsHomeService {

  private collectionName = 'cards';

  constructor(private firestore: Firestore, private storage: Storage) { }

  // Método para subir una imagen a Firebase Storage
  async uploadImage(file: File): Promise<string> {
    const filePath = `${this.collectionName}/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  }

  // Método para guardar información de la tarjeta en Firestore
  async saveCardData(cardData: CardData): Promise<void> {
    const cardsRef = collection(this.firestore, this.collectionName);
    try {
      await addDoc(cardsRef, cardData);
      console.log('Datos guardados correctamente en Firestore:', cardData);
    } catch (error) {
      console.error('Error al guardar datos en Firestore:', error);
      throw error; // Volver a lanzar el error para manejarlo en el componente
    }
  }

  // Método para obtener todas las tarjetas almacenadas en Firestore
  getCards(): Observable<CardData[]> {
    const cardsRef = collection(this.firestore, this.collectionName);
    return collectionData(cardsRef, { idField: 'id' }) as Observable<CardData[]>;
  }

  // Método para eliminar una tarjeta de Firestore
  async deleteCard(cardId: string): Promise<void> {
    const cardDocRef = doc(this.firestore, `${this.collectionName}/${cardId}`);
    await deleteDoc(cardDocRef);
  }

  // Método para actualizar información de una tarjeta en Firestore
  async updateCard(cardId: string, updatedData: Partial<CardData>): Promise<void> {
    const cardDocRef = doc(this.firestore, `${this.collectionName}/${cardId}`);
    await updateDoc(cardDocRef, updatedData);
  }

}
