import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Cpp } from '../../../shared/interfaces/cpps.interface';


@Component({
  selector: 'app-cpp-list',
  templateUrl: './cpp-list.component.html',
  styleUrls: ['./cpp-list.component.css']
})
export class CppListComponent implements OnInit {
  @Input('formCpps')
  public formCpps: FormGroup;

  @Input('cppFormData')
  public cppFormData: Cpp[];

  constructor(private _cd: ChangeDetectorRef) { }

  ngOnInit() {
    // console.log(this.formCpps);
    console.log(this.cppFormData);
    this.formCpps.addControl('cpps', new FormArray([]));
  }
}
