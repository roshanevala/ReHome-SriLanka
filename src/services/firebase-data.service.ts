import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  CollectionReference,
  DocumentReference,
  QueryConstraint,
  onSnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore = inject(Firestore);

  // Generic CRUD Operations

  // Create a document
  async create<T>(collectionName: string, data: T): Promise<string> {
    const collectionRef = collection(this.firestore, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  }

  // Read a single document
  async getById<T>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(this.firestore, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  // Read all documents in a collection
  async getAll<T>(collectionName: string): Promise<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  // Query documents with filters
  async queryDocuments<T>(
    collectionName: string,
    ...queryConstraints: QueryConstraint[]
  ): Promise<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  // Update a document
  async update(collectionName: string, id: string, data: Partial<any>): Promise<void> {
    const docRef = doc(this.firestore, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  // Delete a document
  async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(this.firestore, collectionName, id);
    await deleteDoc(docRef);
  }

  // Real-time listener for a single document
  onDocumentChange<T>(collectionName: string, id: string): Observable<T | null> {
    return new Observable((observer) => {
      const docRef = doc(this.firestore, collectionName, id);
      
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          observer.next({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          observer.next(null);
        }
      }, (error) => {
        observer.error(error);
      });

      return () => unsubscribe();
    });
  }

  // Real-time listener for a collection
  onCollectionChange<T>(
    collectionName: string,
    ...queryConstraints: QueryConstraint[]
  ): Observable<T[]> {
    return new Observable((observer) => {
      const collectionRef = collection(this.firestore, collectionName);
      const q = queryConstraints.length > 0 
        ? query(collectionRef, ...queryConstraints)
        : collectionRef;
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const documents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        observer.next(documents);
      }, (error) => {
        observer.error(error);
      });

      return () => unsubscribe();
    });
  }

  // Beneficiary-specific methods
  async createBeneficiaryApplication(data: any): Promise<string> {
    return this.create('beneficiaries', {
      ...data,
      status: 'pending',
      priorityScore: 0
    });
  }

  async updateApplicationStatus(id: string, status: string, notes?: string): Promise<void> {
    const updateData: any = { status };
    if (notes) {
      updateData.adminNotes = notes;
    }
    return this.update('beneficiaries', id, updateData);
  }

  // Donor-specific methods
  async createDonor(data: any): Promise<string> {
    return this.create('donors', {
      ...data,
      totalPledges: 0,
      activePledges: 0
    });
  }

  async createPledge(donorId: string, beneficiaryId: string, amount: number): Promise<string> {
    return this.create('pledges', {
      donorId,
      beneficiaryId,
      amount,
      status: 'pending',
      createdAt: Timestamp.now()
    });
  }

  // Admin statistics
  async getStatistics(): Promise<any> {
    const [beneficiaries, donors, pledges] = await Promise.all([
      this.getAll('beneficiaries'),
      this.getAll('donors'),
      this.getAll('pledges')
    ]);

    return {
      totalBeneficiaries: beneficiaries.length,
      totalDonors: donors.length,
      totalPledges: pledges.length,
      pendingApplications: beneficiaries.filter((b: any) => b.status === 'pending').length,
      approvedApplications: beneficiaries.filter((b: any) => b.status === 'approved').length
    };
  }
}
