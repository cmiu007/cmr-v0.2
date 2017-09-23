export interface ListaCertificate {
  Certificat: Certificat[];
}

export interface Certificat {
  'id_certificat': number;
  'id_mem': number;
  'nr': number;
  'data_start': string;
  'data_invalidare': string;
  'reg_cert_id': number;
  'cod_qr': string;
}
