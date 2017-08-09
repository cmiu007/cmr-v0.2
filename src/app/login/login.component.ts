import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import { AlertService } from '../services/alert.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private alertService: AlertService,
      private snackBar: MdSnackBar
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup ({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required])
    });
    // reset login status
    this.authenticationService.logout();
    // get returnUrl or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(
        data => {
          if ( data.result === '10') {
            this.snackBar.open( data.mesaj, 'inchide', { duration: 2000});
          } else {
            this.router.navigate([this.returnUrl]);
            this.snackBar.open( data.mesaj, 'inchide', { duration: 2000});
          }
          this.loading = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
