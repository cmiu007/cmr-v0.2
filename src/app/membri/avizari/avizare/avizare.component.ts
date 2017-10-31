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

    const apiData: ApiData = this._aRoute.snapshot.data['listaCpp'];

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


    // let listaAsigurariDLP = this.asigurariList;
    const listaAsigurariDLP = this.asigurariList.filter(asigurare => asigurare.id_dlp === this.avizareFormData.id_dlp);

    // are avizare de tip vechi?
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

    // console.log('avem certificat de tipul: ' + this.certificatCurentContinut.tip_cert);

    switch (this.certificatCurentContinut.tip_cert) {
      case 'A':
        this.avizareTip = 1;
        listaCpp2 = listaCpp2.filter(item => item.date_end === '0000-00-00');
        listaCpp2.forEach((cpp: Cpp) => {
          asigurari = listaAsigurariDLP.filter((asigurareItem: Asigurare) => asigurareItem.id_cpp === cpp.id_cpp) as Asigurare[];
          // console.log('asigurari:');
          // console.log(asigurari);
          if (asigurari.length > 1) {
            // this._snackBar.showSnackBar('Eroare la generarea listei de asigurari');
            // TODO: are eroare ... pt moment bagam in consola
            console.log('Eroare: Are mai mult de o avizare pt o specialitate');
            return;
          }

          if (asigurari.length === 0) {
            // console.log('creez asig noua');
            asigurari[0] = {
              id_mem: +this.avizareForm.get('id_mem').value,
              id_dlp: +this.avizareForm.get('id_dlp').value,
              id_cpp: +cpp.id_cpp,
              // status: +this.avizareForm.get('status').value
              status: 0
            };
            this.asigurariIncomplete = true;
          }
          // console.log(asigurari);
          const newAsigurareForm = this._formSet.asigurare(asigurari[0]);
          // console.log(this._formSet.asigurare(asigurari[0]));
          const arrayControlNew = this.avizareForm.get('asigurare') as FormArray;
          arrayControlNew.insert(0, newAsigurareForm);
        });
        this.loading = false;
        return;

      case 'B':
        let tipB = '';
        let asigurari: Asigurare[] = [];
        asigurari = this.asigurariList;
        // console.log(asigurari);
        if (listaCpp2.length === 0) {
          tipB = 'competenteLimitate';
        } else {
          tipB = 'rezident';
        }

        switch (tipB) {
          case 'competenteLimitate':
            // console.log(asigurari);
            this.avizareTip = 2;
            // console.log('hit competente limitate');
            if (asigurari.length === 0) {
              // console.log('creez asig noua');
              asigurari[0] = {
                id_mem: +this.avizareForm.get('id_mem').value,
                id_dlp: +this.avizareForm.get('id_dlp').value,
                id_cpp: null,
                // status: +this.avizareForm.get('status').value
                status: 0
              };
              this.asigurariIncomplete = true;
            }
            // console.log(asigurari);
            const newAsigurareFormCL = this._formSet.asigurare(asigurari[0]);
            // console.log(this._formSet.asigurare(asigurari[0]));
            const arrayControlNewCL = this.avizareForm.get('asigurare') as FormArray;
            arrayControlNewCL.insert(0, newAsigurareFormCL);
            this.loading = false;
            return;

          case 'rezident':
            this.avizareTip = 3;
            // console.log('hit rezident');
            listaCpp2.forEach((cpp: Cpp) => {
              asigurari = listaAsigurariDLP.filter((asigurareItem: Asigurare) => asigurareItem.id_cpp === cpp.id_cpp) as Asigurare[];
              // console.log('asigurari:');
              // console.log(asigurari);
              if (asigurari.length > 1) {
                // this._snackBar.showSnackBar('Eroare la generarea listei de asigurari');
                // TODO: are eroare ... pt moment bagam in consola
                console.log('Eroare: Are mai mult de o avizare pt o specialitate');
                return;
              }
              if (asigurari.length === 0) {
                // console.log('creez asig noua');
                asigurari[0] = {
                  id_mem: +this.avizareForm.get('id_mem').value,
                  id_dlp: +this.avizareForm.get('id_dlp').value,
                  id_cpp: +cpp.id_cpp,
                  // status: +this.avizareForm.get('status').value
                  status: 0
                };
                this.asigurariIncomplete = true;
              }
              // console.log(asigurari);
              const newAsigurareForm = this._formSet.asigurare(asigurari[0]);
              // console.log(this._formSet.asigurare(asigurari[0]));
              const arrayControlNew = this.avizareForm.get('asigurare') as FormArray;
              arrayControlNew.insert(0, newAsigurareForm);
            });
            this.loading = false;
            return;

          default:
            break;
        }


        break;

      case 'C':
        let asigurariC: Asigurare[] = [];
        asigurariC = this.asigurariList;
        // console.log('hit case C');
        // console.log(asigurari);
          if (asigurariC.length > 1) {
            console.log('Eroare: Are mai mult de o avizare pt o specialitate');
            return;
          }
        this.avizareTip = 4;
        if (asigurariC.length === 0) {
          // console.log('creez asig noua');
          asigurariC[0] = {
            id_mem: +this.avizareForm.get('id_mem').value,
            id_dlp: +this.avizareForm.get('id_dlp').value,
            id_cpp: null,
            // status: +this.avizareForm.get('status').value
            status: 0
          };
          this.asigurariIncomplete = true;
        }
        // console.log(asigurari);
        const newAsigurareFormC = this._formSet.asigurare(asigurariC[0]);
        // console.log(this._formSet.asigurare(asigurari[0]));
        const arrayControlNewC = this.avizareForm.get('asigurare') as FormArray;
        arrayControlNewC.insert(0, newAsigurareFormC);
        this.loading = false;
        return;

      default:
        break;
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
    console.log(data);
    data.tip = this.avizareTip;
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
        // console.log(asigurari);
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
