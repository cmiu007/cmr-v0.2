import { Component, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../angular-material/angular-material.module';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName: string;
  userJudet: string;
  currentMemNume: string;
  currentPage: string;
  constructor(private router: Router,
  private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.userName = localStorage.getItem('userName');
    this.userJudet = localStorage.getItem('userJudet');
    this.getMemNume();
    this.currentPage = localStorage.getItem('currentPage');
  }

  getMemNume(): void {
    this.currentMemNume = localStorage.getItem('currentMemNume');
  }

  onClickMem(actiune: string) {
    this.router.navigate(['../' + actiune], { relativeTo: this.activeRoute});
  }
}
