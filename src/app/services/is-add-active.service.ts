import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class IsAddActiveService {
  private isAddBtnActiveSource = new Subject<boolean>();

  isAddBtnActive = this.isAddBtnActiveSource.asObservable();

  setStatus(status: boolean) {
    this.isAddBtnActiveSource.next(status);
  }
}
