import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reflector',
  templateUrl: './reflector.component.html',
  styleUrls: ['./reflector.component.css']
})
export class ReflectorComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit() {
    this._router.navigate([sessionStorage.getItem('currentUrl')]);
  }

}
