import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Whisper {
  transcription = signal(''); // signal para mantener el texto transcrito

  constructor() { }

  async transcribeWithWhisperX(file: Blob, selectedModel: string) {
    try {

      const formData = new FormData();
      // ⚠️ Pasamos nombre y extensión correcta para que FFmpeg lo lea
      formData.append('audio', file, file instanceof File ? file.name : `audio-${Date.now()}.${file.type.split('/')[1]}`);
      formData.append('model', selectedModel); // 👈 enviamos el modelo al backend

      const response = await fetch('http://localhost:3000/transcribe-whisperx', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al transcribir el audio');
      }

      const data = await response.json();

     // Guardamos ambos: transcripción y URL del archivo

      this.transcription.set(data.transcription);
      return {
        transcription: data.transcription,
        fileUrl: data.fileUrl      } // actualizar el signal
    } catch (error) {
      console.error(error);
      this.transcription.set('Error al transcribir el audio');
      return null;
    }
  }
}
