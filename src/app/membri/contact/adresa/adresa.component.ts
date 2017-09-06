import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-adresa',
  templateUrl: './adresa.component.html',
  styleUrls: ['./adresa.component.css']
})
export class AdresaComponent implements OnInit {
  @Input ('formAdresaData')
  formAdresaData;

  constructor() { }

  ngOnInit() {
  }

}
