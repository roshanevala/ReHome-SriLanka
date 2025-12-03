import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTask
} from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = inject(Storage);

  // Upload a file and get download URL
  async uploadFile(path: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }

  // Upload with progress tracking
  uploadFileWithProgress(path: string, file: File): {
    task: UploadTask;
    progress$: Observable<number>;
    downloadUrl$: Observable<string>;
  } {
    const storageRef = ref(this.storage, path);
    const task = uploadBytesResumable(storageRef, file);

    const progress$ = new Observable<number>((observer) => {
      task.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next(progress);
        },
        (error) => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
    });

    const downloadUrl$ = new Observable<string>((observer) => {
      task.then(async (snapshot) => {
        const url = await getDownloadURL(snapshot.ref);
        observer.next(url);
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });

    return { task, progress$, downloadUrl$ };
  }

  // Delete a file
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    return deleteObject(storageRef);
  }

  // Get download URL for a file
  async getDownloadUrl(path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    return getDownloadURL(storageRef);
  }

  // List all files in a directory
  async listFiles(path: string): Promise<string[]> {
    const storageRef = ref(this.storage, path);
    const result = await listAll(storageRef);
    
    const urls = await Promise.all(
      result.items.map(item => getDownloadURL(item))
    );
    
    return urls;
  }

  // Upload multiple files for beneficiary application
  async uploadBeneficiaryDocuments(
    beneficiaryId: string,
    files: { type: string; file: File }[]
  ): Promise<{ type: string; url: string }[]> {
    const uploadPromises = files.map(async ({ type, file }) => {
      const path = `beneficiaries/${beneficiaryId}/${type}/${file.name}`;
      const url = await this.uploadFile(path, file);
      return { type, url };
    });

    return Promise.all(uploadPromises);
  }

  // Upload project progress photos
  async uploadProjectPhotos(
    projectId: string,
    photos: File[]
  ): Promise<string[]> {
    const uploadPromises = photos.map(async (photo, index) => {
      const path = `projects/${projectId}/progress/${Date.now()}_${index}_${photo.name}`;
      return this.uploadFile(path, photo);
    });

    return Promise.all(uploadPromises);
  }

  // Delete all files in a directory
  async deleteDirectory(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    const result = await listAll(storageRef);
    
    const deletePromises = result.items.map(item => deleteObject(item));
    await Promise.all(deletePromises);
  }
}
