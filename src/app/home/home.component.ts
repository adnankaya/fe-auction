import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  loggedIn: boolean;
  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.loggedIn = this.authService.loggedIn();    
    this.currentUser = this.authService.decodedToken as User;

  }

  logout() {
    this.authService.logout();
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }

}
