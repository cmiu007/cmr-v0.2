export interface ListaCertificate {
  Certificat: Certificat[];
}

export interface Certificat {
  'id_certificat': number;
  'id_mem': number;
  'data_start': string;
  'data_invalidare': string;
  'reg_cert_id': number;
  'continut': CertificatContinut;
  'cod_qr': string;
}

export interface CertificatContinut {
  'tip_cert': string;
  'judet': string;
  'nume': string;
  'cnp': string;
  'cuim': string;
  'facultate': string;
  'promotie': number;
  'dipl_serie': string;
  'data_cert': string;
  'data_juramant': string;
  'specialitati': CertSpecialitate[];
  'superspecialitate': CertSuperSpec[];
  'asigurare': CertAsig[];
  'cpp': CertCpp[];
}

export interface CertSpecialitate {
  'specialitate': string;
  'gr_prof': string;
}

export interface CertSuperSpec {
  'specialitate': string;
  'gr_prof': string;
}

export interface CertAsig {
  'asigurator': string;
  'polita_serie': string;
  'polita_nr': string;
  'data_start': string;
  'data_end': string;
}

export interface CertCpp {
  'tip': number;
  '0': number;
  'date_start': string;
  '1': string;
  'date_end': string;
  '2': string;
  'specialitate': string;
  '3': string;
  'grad': string;
  '4': string;
}
