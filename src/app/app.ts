import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './components/nav-bar/nav-bar/nav-bar';
import { AuthService } from './services/auth-service/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('proyecto-front');

  private auth = inject(AuthService);

  ngOnInit() {
    this.auth.loadProfile();
  }
}
