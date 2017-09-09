import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-asigurari-list',
  templateUrl: './asigurari-list.component.html',
  styleUrls: ['./asigurari-list.component.css']
})
export class AsigurariListComponent implements OnInit {
  @Input('formAsigurari')
  public formAsigurari;

  addActive = true;

  constructor() { }

  ngOnInit() {
  }

}
