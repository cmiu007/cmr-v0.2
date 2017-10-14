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
  'status': number;
  'comentarii': string;
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
  'dipl_nr': string;
  'data_cert': string;
  'data_juramant': string;
  'specialitati': CertSpecialitate[];
  'superspecialitate': CertSuperSpec[];
}

export interface CertSpecialitate {
  'specialitate': string;
  'gr_prof': string;
}

export interface CertSuperSpec {
  'specialitate': string;
  'gr_prof': string;
}

// TODO: de adaugta lista DLP?
