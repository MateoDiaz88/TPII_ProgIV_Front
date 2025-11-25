import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

export interface UploadResponse{
  message: string,
  url: string,
  publicId: string
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  async uploadProfileImage(file:File): Promise<UploadResponse>{
    const formData = new FormData();
    formData.append("image", file);

    try{
      const response = await firstValueFrom(this.http.post<UploadResponse>(`${this.apiUrl}/upload/profile-image`, formData));
      return response;
    }catch(error){
      console.error("Error al subir la imagen", error);
      throw new Error("Error al subir la imagen");
    }
  }

}
