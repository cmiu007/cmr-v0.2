export interface Titluri {
  asigurare: Titlu[];
}

export interface Titlu {
  'id_cdu': number;
  'id_mem': number;
  'reg_titlu_id': number;
  'reg_facultate_id': number;
  'status': number;
  'data_start': string;
  'data_end': string;
}

export interface RegTitluri {
  'id': number;
  'tip': string;
  'nume': string;
}
