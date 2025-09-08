import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialComponents } from './Material/material';
import { NavigationComponent } from "./navigation/navigation.component";
import { Voiceapp } from "./voiceapp/voiceapp";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MaterialComponents, NavigationComponent, Voiceapp],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
protected readonly title = signal('VoicePro');
}
