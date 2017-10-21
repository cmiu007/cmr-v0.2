// TODO: de facut verificare: avizarea nu poate fi mai mare decat un an si mai mica decat o luna
// TODO: de marcat strike avizarea inactiva

import { Component, OnInit, Input, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { environment } from '../../../../environments/environment';

import { Avizare } from '../../../shared/interfaces/avizari.interface';
import { IsAddActiveService } from '../../../services/is-add-active.service';
import { FormSetService } from '../../../services/form-set.service';
import { ApiDataService } from '../../../services/api-data.service';
import { ApiData } from '../../../shared/interfaces/message.interface';
import { Asigurare } from '../../../shared/interfaces/asigurari.interface';
import { Cpp } from '../../../shared/interfaces/cpps.interface';
import { AlertSnackbarService } from '../../../services/alert-snackbar.service';
import { AvizariComponent } from '../avizari.component';
import { DataCalService } from '../../../services/data-cal.service';
import { ListaAsigurari } from '../../../shared/resolvers/listaasigurari.resolver';



@Component({
  selector: 'app-avizare',
  templateUrl: './avizare.component.html',
  styleUrls: ['./avizare.component.css']
})
export class AvizareComponent implements OnInit, OnDestroy {
  _subscription: Subscription;

  @Input('formAvizari')
  public formAvizari: FormGroup;

  @Input('arrayIndex')
  public arrayIndex;

  avizareForm: FormGroup;
  avizareFormData: Avizare;

  genPDFAddress: string;

  loading = true;
  loadingAsig = false;
  isHidden = false;
  itemName: string;
  itemStatus: string;

  // formStatus
  // 0 - new - in curs de completare
  // 1 - draft - completare finazilata
  // 2 - activ
  // 3 - inactiv

  constructor(
    private _detectChanges: IsAddActiveService,
    private _setAddBtn: IsAddActiveService,
    private _formSet: FormSetService,
    private _apiData: ApiDataService,
    private _snackBar: AlertSnackbarService,
    private _dataCal: DataCalService,
    private _aRoute: ActivatedRoute
  ) {
    this.genPDFAddress = environment.resUrl;
  }

  ngOnInit() {
    this.setForm();
    this.setFormStatus();
    // this.getAsigurariData();
    this.getAsigurariData2();
    this.setItemName();
    this._subscription = this._detectChanges.isAddBtnActive
      .subscribe(isChanged => {
        // reload date asigurari
      });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  private setForm(): void {
    const a = this.formAvizari.get('avizare') as FormArray;
    this.avizareForm = this._formSet.avizare(a.at(this.arrayIndex).value);
    this.avizareFormData = this.avizareForm.value;
  }

  private setFormStatus(): void {
    let avizareStart = '';
    let avizareEnd = '';
    if (this.avizareFormData.status === 1) {
      avizareStart = this.avizareFormData.dlp_data_start;
      avizareEnd = this.avizareFormData.dlp_data_end;

      if (this._dataCal.isInThePast(this._dataCal.strToDate(avizareEnd))) {
        this.avizareFormData.status = 3;
      }

      if (this._dataCal.isInThePast(this._dataCal.strToDate(avizareStart))
        && this._dataCal.isInTheFuture(this._dataCal.strToDate(avizareEnd))) {
        this.avizareFormData.status = 2;
      }
    }


    // set form status pentru asigurare
    this.avizareForm.get('status').setValue(this.avizareFormData.status);

    switch (this.avizareFormData.status) {
      case null:
        this.itemName = 'Avizare Nouă';
        this.avizareForm.get('id_mem').setValue(+sessionStorage.getItem('currentMemId'));
        break;

      case 0:
        this.itemStatus = 'Avizare in curs de completare';
        this._setAddBtn.setStatus(false);
        break;

      case 1:
        this.itemStatus = 'Avizare Completă';
        this.setFormRO();
        break;

      case 2:
        this.itemStatus = 'Avizare Activă';
        this.setFormRO();
        break;

      case 3:
        this.itemStatus = 'Inactivă';
        this.isHidden = true;
        break;

      default:
        break;
    }
  }

  private setFormRO(): void {
    Object.keys(this.avizareForm.controls).forEach(
      key => {
        this.avizareForm.get(key).disable();
      });
  }

  getAsigurariData2() {
    let apiData: ApiData = this._aRoute.snapshot.data['listaCpp'];
    let listaCpp2: Cpp[] = apiData.data;

    // 1. Ordonare dupa data
    Object(listaCpp2).sort((a, b) => {
      return a.date_start > b.date_start ? -1 : 1;
    });
    // 2. ordonare dupa tip_cpp
    Object(listaCpp2).sort((a, b) => {
      return a.reg_cpp_tip_id < b.reg_cpp_tip_id ? -1 : 1;
    });

    listaCpp2 = listaCpp2.filter(item => item.reg_cpp_tip_id === 2 || item.reg_cpp_tip_id === 1);
    listaCpp2 = listaCpp2.filter(item => item.date_end === '0000-00-00');

    apiData = this._aRoute.snapshot.data['listaAsigurari'];
    let listaAsigurari2 = apiData.data;
    listaAsigurari2 = listaAsigurari2.filter(asigurare => asigurare.id_dlp === this.avizareFormData.id_dlp);

    // are avizare de tip vechi?
    if (this.avizareFormData.inchis === 2) {
      console.log('hit avizare de tip vechi');
      console.log(listaAsigurari2);
      // afiseaza asigurarea direct
      // nu se ia in considerare lista de cpp
      Object(listaAsigurari2).forEach((element: Asigurare) => {
        element.status = 1;
        const newAsigurareForm = this._formSet.asigurare(element);
        const arrayControl = this.avizareForm.get('asigurare') as FormArray;
        arrayControl.insert(0, newAsigurareForm);
      });
      this.loading = false;
      return;
    }

    listaCpp2.forEach((cpp: Cpp) => {
      const asigurari = listaAsigurari2.filter((asigurareItem: Asigurare) => asigurareItem.id_cpp === cpp.id_cpp) as Asigurare[];

      if (asigurari.length > 1) {
        // this._snackBar.showSnackBar('Eroare la generarea listei de asigurari');
        // TODO: are eroare ... pt moment bagam in consola
        console.log('Are mai mult de o avizare pt cpp');
        return;
      }

      if (asigurari.length === 0) {
        asigurari[0] = {
          id_mem: +this.avizareForm.get('id_mem').value,
          id_dlp: +this.avizareForm.get('id_dlp').value,
          id_cpp: +cpp.id_cpp,
          // status: +this.avizareForm.get('status').value
          status: 0
        };
      }

      const newAsigurareForm = this._formSet.asigurare(asigurari[0]);
      const arrayControlNew = this.avizareForm.get('asigurare') as FormArray;
      arrayControlNew.insert(0, newAsigurareForm);
      this.loading = false;
    });
  }

  setItemName(): void {
    this.itemName =
      this.avizareForm.get('dlp_data_start').value + ' pana la ' +
      this.avizareForm.get('dlp_data_end').value;
    if (this.avizareForm.get('dlp_data_start').value === '') {
      this.itemName = 'Avizare nouă';
    }
  }

  onClickAvizare(actiune: string): void {
    if (this.avizareForm.valid === false) {
      this._snackBar.showSnackBar('Formular Invalid');
      return;
    }
    if (this.loading === true) {
      return;
    }

    this.loading = true;
    const data = this.avizareForm.value;
    const idItem = data.id_dlp;

    delete data.id_dlp;
    delete data.inchis;
    delete data.asigurare;

    switch (actiune) {
      case 'adauga':
        data.status = 0;
        this._apiData.apiAdauga('dlp', data)
          .subscribe((response: ApiData) => {
            if (response.status === 0) {
              return;
            }
            this.loading = false;
            AvizariComponent._formDataChanged.next();
          });
        return;

      case 'modifica':
        break;

      case 'finalizeaza':
        data.status = 1;
        break;

      case 'printeaza':
        this.printAvizare();
        this.loading = false;
        return;

      default:
        break;
    }

    delete data.id_certificat;

    this._apiData.apiModifica('dlp', idItem, data)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        this.loading = false;
        AvizariComponent._formDataChanged.next();
      });
    return;
  }

  private printAvizare(): void {
    const nativeWindow = window;
    const certificatId = this.avizareForm.get('id_certificat').value;
    let url = this.genPDFAddress + 'genpdf.php?token=' + sessionStorage.getItem('userToken');
    url = url + '&actiune=spate&id=' + certificatId;
    nativeWindow.open(url);
  }

  addDateEnd(): void {
    if (this.avizareForm.get('dlp_data_start').value !== '') {
      this.avizareForm.get('dlp_data_end').setValue(this._dataCal.addOneYear(this.avizareForm.get('dlp_data_start').value));
    }
  }
}
