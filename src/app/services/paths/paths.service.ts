import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// Definir la interfaz Path
export interface Path {
  id?: string; // ID opcional porque se generará automáticamente en Firestore
  path: string;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class PathsService {
  // Variable opcional para almacenar un registro actual, similar a `currentProduct` en `ProductService`
  currentPath?: Path;

  constructor(private firestore: Firestore) {}

  // Método para obtener la lista de rutas (paths) desde Firestore
  getPaths(): Observable<Path[]> {
    const pathsRef = collection(this.firestore, 'paths');
    return collectionData(pathsRef, { idField: 'id' }) as Observable<Path[]>;
  }

  // Método para crear un nuevo Path en Firestore
  createPath(path: Path): Promise<any> {
    const pathsRef = collection(this.firestore, 'paths');
    return addDoc(pathsRef, path);
  }

  // Método para actualizar un Path existente en Firestore
  updatePath(path: Path): Promise<any> {
    // La actualización requiere un ID, que debe estar definido en el objeto Path
    if (!path.id) throw new Error('El Path debe tener un ID para ser actualizado.');
    const docRef = doc(this.firestore, `paths/${path.id}`);
    return updateDoc(docRef, { ...path });
  }

  // Método para eliminar un Path existente en Firestore
  deletePath(path: Path): Promise<any> {
    // La eliminación requiere un ID, que debe estar definido en el objeto Path
    if (!path.id) throw new Error('El Path debe tener un ID para ser eliminado.');
    const docRef = doc(this.firestore, `paths/${path.id}`);
    return deleteDoc(docRef);
  }
}
