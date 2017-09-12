import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { User } from '../shared/models/user.model';
import { UserService } from '../services/user.service';
import { MembriService } from '../services/membri.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  searchForm: FormGroup;
  currentUser: User;
  users: User[] = [];
  membri: any[];
  emptySearchResult = false;
  loading = false;

  constructor(private userService: UserService,
    private membriService: MembriService,
    private router: Router,
    private snackBar: MdSnackBar) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      'searchMem': new FormControl(null, [Validators.required])
    });
    this.setLocalStorage();
  }

  setLocalStorage(): void {
    localStorage.removeItem('currentMemNume');
    localStorage.removeItem('currentMemId');
    localStorage.removeItem('currentMemCuim');
    localStorage.setItem('currentPage', 'Pagina de start');
  }

  onSearch(searchVal: string) {
    this.loading = true;
    this.emptySearchResult = false;
    // TODO: de revizuit actiune
    const actiune = 'list';
    this.membriService.getAll(actiune, searchVal).subscribe((response) => {
      console.log(response);
      if (response.mesaj) {
        this.membri = null;
      } else {
        if (response.length === 0) {
          this.emptySearchResult = true;
        }
        this.membri = response;
      }
      this.loading = false;
    });
  }

  onClickMem(id: string, actiune: string) {
    localStorage.setItem('currentMemNume',
      this.membri.find(item => item.id === id).nume
      + ' '
      + this.membri.find(item => item.id === id).prenume);
    localStorage.setItem('currentMemId', id);
    localStorage.setItem('currentMemCuim', this.membri.find(item => item.id === id).cuim);
    this.router.navigate(['/membri', id, actiune]);
  }

  onNewMember(): void {
    localStorage.setItem('currentMemNume', 'Membru Nou');
    this.router.navigate(['/membri/nou']);
  }
}
