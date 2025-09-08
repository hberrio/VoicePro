import { Component, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MaterialComponents } from '../Material/material';
import { Whisper } from '../services/whisper';
import { FormsModule } from '@angular/forms';  // ✅ necesario para ngModel
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-voiceapp',
  imports: [CommonModule, AsyncPipe, MaterialComponents, FormsModule],
  templateUrl: './voiceapp.html',
  styleUrl: './voiceapp.css'
})
export class Voiceapp {
  value = 'Clear me';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isTablet$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Tablet)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isWeb$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Web)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  // Audio recording
  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];

  recording = signal(false);
  audioData: Blob | null = null;
  transcript = signal('');
  formattedText = signal('');
  fileName: string = '';
  convertedFileUrl = signal<string | null>(null);
  // voiceapp.ts
  models = ['tiny', 'base', 'small', 'medium', 'large', 'large-v3', 'turbo'];
  selectedModel = 'small'; // valor por defecto

  // Estilos de escritura
  writingStyles = ['Formal', 'Casual', 'Technical', 'Creative', 'Short', 'Long'];
  selectedStyle = signal('Formal');

  // Loading state
  isLoading = signal(false);
  constructor(private whisperService: Whisper) { } // ✅ inyección local

  async startRecording() {
    this.recording.set(true);
    this.audioChunks = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const dynamicName = `recording-${Date.now()}.webm`;

        this.audioData = new File([blob], dynamicName, { type: 'audio/webm' });

        // Llamamos al método que ya tienes para transcribir
        this.transcribeAudioCurrentFileX();
      };

      this.mediaRecorder.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      this.recording.set(false);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.recording.set(false);
  }

  // Cuando el usuario selecciona un archivo
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.audioData = file; // guarda el archivo
    this.fileName = file.name;
  }

  // Método único que llama al servicio Whisper

  async transcribeAudioCurrentFileX() {
    if (!this.audioData) return;

    this.isLoading.set(true);
    const result = await this.whisperService.transcribeWithWhisperX(this.audioData, this.selectedModel);

    if (result) {
      this.transcript.set(result.transcription);
      this.applyStyle();
      // ⚡ Guardar la URL del archivo convertido
      this.convertedFileUrl.set(result.fileUrl);
      // ⚡ Guardar la URL del archivo para mostrarlo o descargarlo
      console.log('Converted File Available in:', result.fileUrl);
      // Por ejemplo, puedes exponerlo en una señal:
      // this.convertedFileUrl.set(result.fileUrl);
    }

    this.isLoading.set(false);
  }
  // transcript download option
  downloadFile() {
    const url = this.convertedFileUrl();
    if (!url) return;

    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop() || 'archivo.txt';
    a.click();
    a.remove();
  }

  clearFile() {
    this.audioData = null;
    this.fileName = ''; //limpia la variable que muestra el nombre en la UI.
    // Resetea el input para permitir cargar el mismo archivo otra vez
      this.fileInput.nativeElement.value = '';
      this.convertedFileUrl.set(null);
  }

  applyStyle() {
    // Ejemplo de aplicación de estilo
    this.formattedText.set(`${this.selectedStyle()}: ${this.transcript()}`);
  }
}

