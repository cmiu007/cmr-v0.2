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
  hideMemNume = true;
  constructor(private router: Router,
  private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.userJudet = sessionStorage.getItem('userJudet');
    this.getMemNume();
    this.currentPage = sessionStorage.getItem('currentPage');
    sessionStorage.setItem( 'currentUrl', this.router.url);
  }

  getMemNume(): void {
    this.currentMemNume = sessionStorage.getItem('currentMemNume');
    if (this.currentMemNume !== null ) {
      this.hideMemNume = false;
      // de verificat daca suntem in sectiune mem si daca id din routa corespunde cu id-ul membrului
      // poate un serviciu?
    }
  }

  onClickMem(actiune: string) {
    this.router.navigate(['../' + actiune], { relativeTo: this.activeRoute});
  }

  onClickHelp(): void {
    const nativeWindow = window;
    const url = 'mailto:it@cmr.ro?Subject=Problema%20Registrul%20Medicilor';
    nativeWindow.open(url);
  }
}
