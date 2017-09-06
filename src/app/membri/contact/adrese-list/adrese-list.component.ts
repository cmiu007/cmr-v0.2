import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-adrese-list',
  templateUrl: './adrese-list.component.html',
  styleUrls: ['./adrese-list.component.css']
})
export class AdreseListComponent implements OnInit {
  @Input('formAdreseData')
  public formAdreseData; // de pus tip-ul

  @Input('formAdrese')
  public formAdrese: FormGroup;

  addActive = true;

  constructor() { }

  ngOnInit() {
  }

  addAdresa(): void {
    this.addActive = !this.addActive;
  }

}
