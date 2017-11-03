// TODO: de facut verificare: avizarea nu poate fi mai mare decat un an si mai mica decat o luna
// TODO: de marcat strike avizarea inactiva

import { Component, OnInit, Input, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { Subject } from 'rxjs/Subject';

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
import { ActIdentTip } from '../../../shared/models/registre.model';
import { CertSpecialitate } from '../../../shared/interfaces/certificate.interface';



@Component({
  selector: 'app-avizare',
  templateUrl: './avizare.component.html',
  styleUrls: ['./avizare.component.css']
})
export class AvizareComponent implements OnInit, OnDestroy {

  @Input('formAvizari')
  public formAvizari: FormGroup;

  @Input('arrayIndex')
  public arrayIndex;

  @Input('certificatCurentContinut')
  public certificatCurentContinut;

  avizareForm: FormGroup;
  avizareFormData: Avizare;

  asigurariList: Asigurare[];

  genPDFAddress: string;

  loading = true;
  loadingAsig = false;
  isHidden = false;
  itemName: string;
  itemStatus: string;
  avizareOld = false;
  avizareTip: number;
  isAvizFinal = false;
  // - 1 pt dlp tip A
  // - 2 pt dlp tip B - Medic cu competente limitate
  // - 3 pt dlp tip B - Medic Rezident
  // - 4 pt dlp tip C
  // - 11 pt dlp tip vechi, versiune 1
  asigurariIncomplete = false;

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
    this.getAsigurariData();
    this.setItemName();
  }

  ngOnDestroy() {

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
    // this.avizareForm.get('status').setValue(this.avizareFormData.status);
    // console.log( this.avizareForm.get('status').value);
    if (this.avizareForm.get('status').value) {
      this.isAvizFinal = true;
    }

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

  private getAsigurariData(): void {
    this._apiData.apiLista('asigurare', this.avizareForm.get('id_mem').value)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        this.asigurariList = response.data;
        this.setAsigurariData();
        this.loading = false;
      });
  }

  private setAsigurariData(): void {
    // avizare veche?
    const listaAsigurariDLP = this.asigurariList.filter(asigurare => asigurare.id_dlp === this.avizareFormData.id_dlp);
    if (this.avizareFormData.tip === 11) {
      this.avizareOld = true;
      // afiseaza asigurarea direct
      // nu se ia in considerare lista de cpp
      Object(listaAsigurariDLP).forEach((element: Asigurare) => {
        element.status = 1;
        const newAsigurareForm = this._formSet.asigurare(element);
        const arrayControl = this.avizareForm.get('asigurare') as FormArray;
        arrayControl.insert(0, newAsigurareForm);
      });
      this.loading = false;
      return;
    }

    // este asigurare completa?
    if (this.isAvizFinal === true) {
      // afiseaza asigurarea direct
      // nu se ia in considerare lista de cpp
      Object(listaAsigurariDLP).forEach((element: Asigurare) => {
        element.status = 1;
        const newAsigurareForm = this._formSet.asigurare(element);
        const arrayControl = this.avizareForm.get('asigurare') as FormArray;
        arrayControl.insert(0, newAsigurareForm);
      });
      this.loading = false;
      return;
    }

    // filtram si ordonam specialitati si rez1 / rez2

    const listaMemCppR: ApiData = this._aRoute.snapshot.data['listaCpp'];
    let listaMemCpp = listaMemCppR.data as Cpp[];
    Object(listaMemCpp).sort((a, b) => {
      return a.date_start > b.date_start ? -1 : 1;
    });
    Object(listaMemCpp).sort((a, b) => {
      return a.reg_cpp_tip_id < b.reg_cpp_tip_id ? -1 : 1;
    });
    listaMemCpp = listaMemCpp.filter((cpp: Cpp) => cpp.date_end === '0000-00-00');

    listaMemCpp = listaMemCpp.filter(item =>
      item.reg_cpp_tip_id === 1
      || item.reg_cpp_tip_id === 2
      || item.reg_cpp_tip_id === 7);

    switch (this.certificatCurentContinut.tip_cert) {
      case 'A':
        let asigurareTip = 0;
        listaMemCpp.forEach((cpp: Cpp) => {
          const asigurare = listaAsigurariDLP.filter((asigurareItem: Asigurare) => asigurareItem.id_cpp === cpp.id_cpp) as Asigurare[];
          if (asigurare.length > 1) {
            // this._snackBar.showSnackBar('Eroare la generarea listei de asigurari');
            // TODO: are eroare ... pt moment bagam in consola
            console.log('Eroare: Are mai mult de o avizare pt o specialitate');
            return;
          }
          if (asigurare.length === 0) {
            // console.log('creez asig noua');
            // setam tip asigurare
            if (cpp.reg_cpp_tip_id === 2) {
              asigurareTip = 1;
            } else if (cpp.reg_cpp_tip_id === 7) {
              asigurareTip = 3;
            } else if (cpp.reg_cpp_tip_id === 1 && cpp.date_end === '0000-00-00') {
              asigurareTip = 2;
            } else {
              this.asigurariIncomplete = false;
              return;
            }
            asigurare[0] = {
              id_mem: +this.avizareForm.get('id_mem').value,
              id_dlp: +this.avizareForm.get('id_dlp').value,
              id_cpp: +cpp.id_cpp,
              // status: +this.avizareForm.get('status').value
              status: 0,
              tip: asigurareTip
            };
            this.asigurariIncomplete = true;
          }
          const newAsigurareForm = this._formSet.asigurare(asigurare[0]);
          const arrayControlNew = this.avizareForm.get('asigurare') as FormArray;
          arrayControlNew.insert(0, newAsigurareForm);
        });
        this.loading = false;
        return;

      case 'B':
        this.avizareTip = 2;
        let tipB = '';
        let asigurariB: Asigurare[] = [];
        asigurariB = this.asigurariList;
        if (listaMemCpp.length === 0) {
          tipB = '4'; // competente limitate
        } else {
          tipB = 'rezident';
        }

        switch (tipB) {
          case '4':
            this.avizareTip = 2;
            if (asigurariB.length === 0) {
              asigurariB[0] = {
                id_mem: +this.avizareForm.get('id_mem').value,
                id_dlp: +this.avizareForm.get('id_dlp').value,
                id_cpp: null,
                // status: +this.avizareForm.get('status').value
                status: 0,
                tip: 4
              };
              this.asigurariIncomplete = true;
            }
            const newAsigurareFormCL = this._formSet.asigurare(asigurariB[0]);
            const arrayControlNewCL = this.avizareForm.get('asigurare') as FormArray;
            arrayControlNewCL.insert(0, newAsigurareFormCL);
            this.loading = false;
            return;


          case 'rezident':
            listaMemCpp.forEach((cpp: Cpp) => {
              const asigurariR = listaAsigurariDLP.filter((asigurareItem: Asigurare) => asigurareItem.id_cpp === cpp.id_cpp) as Asigurare[];
              if (asigurariR.length > 1) {
                // this._snackBar.showSnackBar('Eroare la generarea listei de asigurari');
                // TODO: are eroare ... pt moment bagam in consola
                console.log('Eroare: Are mai mult de o avizare pt o specialitate');
                return;
              }
              // 2 tipuri de rezidenti
              let asigTipR = 0;
              if (asigurariR.length === 0) {
                if (cpp.reg_cpp_tip_id === 1) {
                  asigTipR = 2;
                } else {
                  if (cpp.reg_cpp_tip_id === 2) {
                    asigTipR = 3;
                  }
                }
                asigurariR[0] = {
                  id_mem: +this.avizareForm.get('id_mem').value,
                  id_dlp: +this.avizareForm.get('id_dlp').value,
                  id_cpp: +cpp.id_cpp,
                  // status: +this.avizareForm.get('status').value
                  status: 0,
                  tip: asigTipR
                };
                this.asigurariIncomplete = true;
              }
              const newAsigurareFormB = this._formSet.asigurare(asigurariR[0]);
              const arrayControlNewB = this.avizareForm.get('asigurare') as FormArray;
              arrayControlNewB.insert(0, newAsigurareFormB);
            });
            this.loading = false;
            return;
        }
        return;

      case 'C':
        const asigurariC = this.asigurariList as Asigurare[];
        let areAsigTipC = false;
        // are cel putin o asigurare de tip 5
        // daca nu are adaugam asig pt dlp MG

        asigurariC.forEach((asigurare: Asigurare) => {
          if (asigurare.tip === 5) {
            areAsigTipC = true;
            const newAsigurareForm = this._formSet.asigurare(asigurare);
            const arrayControlNew = this.avizareForm.get('asigurare') as FormArray;
            arrayControlNew.insert(0, newAsigurareForm);
          }
        });

        if (areAsigTipC === false) {
          asigurariC[0] = {
            id_mem: +this.avizareForm.get('id_mem').value,
            id_dlp: +this.avizareForm.get('id_dlp').value,
            id_cpp: null,
            // status: +this.avizareForm.get('status').value
            status: 0,
            tip: 5
          };
          this.asigurariIncomplete = true;
          const newAsigurareForm = this._formSet.asigurare(asigurariC[0]);
          const arrayControlNew = this.avizareForm.get('asigurare') as FormArray;
          arrayControlNew.insert(0, newAsigurareForm);
        }

        listaMemCpp.forEach((cpp: Cpp) => {
          const asigurare = listaAsigurariDLP.filter((asigurareItem: Asigurare) => asigurareItem.id_cpp === cpp.id_cpp) as Asigurare[];
          if (asigurare.length > 1) {
            // this._snackBar.showSnackBar('Eroare la generarea listei de asigurari');
            // TODO: are eroare ... pt moment bagam in consola
            console.log('Eroare: Are mai mult de o avizare pt o specialitate');
            return;
          }
          if (asigurare.length === 0) {
            // console.log('creez asig noua');
            // setam tip asigurare
            if (cpp.reg_cpp_tip_id === 7) {
              asigurareTip = 3;
            } else if (cpp.reg_cpp_tip_id === 1 && cpp.date_end === '0000-00-00') {
              asigurareTip = 2;
            } else {
              this.asigurariIncomplete = false;
              return;
            }
            asigurare[0] = {
              id_mem: +this.avizareForm.get('id_mem').value,
              id_dlp: +this.avizareForm.get('id_dlp').value,
              id_cpp: +cpp.id_cpp,
              // status: +this.avizareForm.get('status').value
              status: 0,
              tip: asigurareTip
            };
            this.asigurariIncomplete = true;
          }
          const newAsigurareForm = this._formSet.asigurare(asigurare[0]);
          const arrayControlNew = this.avizareForm.get('asigurare') as FormArray;
          arrayControlNew.insert(0, newAsigurareForm);
        });
        return;

      default:
        return;
    }
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

    // de pus inchis cf:
    // - 1 pt dlp tip A
    // - 2 pt dlp tip B - Medic cu competente limitate
    // - 3 pt dlp tip B - Medic Rezident
    // - 4 pt dlp tip C
    // - 11 pt dlp tip vechi, versiune 1
    // delete data.inchis;
    switch (this.certificatCurentContinut.tip_cert) {
      case 'A':
        data.tip = 1;
        break;

      case 'B':
        data.tip = 2;
        break;

      case 'C':
        data.tip = 3;
        break;

      default:
        return;
    }

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
        // verifica daca toate asigurarile au status 1
        // daca una din ele are status 0 return cu mesaj de eroare
        data.status = 1;
        data.tip = this.avizareTip;
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
    let url = this.genPDFAddress + 'genavizare.php?token=' + sessionStorage.getItem('userToken');
    url = url + '&aviz=' + this.avizareForm.get('id_dlp').value;
    nativeWindow.open(url);
  }

  addDateEnd(): void {
    if (this.avizareForm.get('dlp_data_start').value !== '') {
      this.avizareForm.get('dlp_data_end').setValue(this._dataCal.addOneYear(this.avizareForm.get('dlp_data_start').value));
    }
  }
}
