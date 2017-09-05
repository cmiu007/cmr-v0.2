import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-adrese-list',
  templateUrl: './adrese-list.component.html',
  styleUrls: ['./adrese-list.component.css']
})
export class AdreseListComponent implements OnInit {
  @Input('formAdreseData')
  public formAdreseData; // de pus tip-ul

  constructor() { }

  ngOnInit() {
  }

}
