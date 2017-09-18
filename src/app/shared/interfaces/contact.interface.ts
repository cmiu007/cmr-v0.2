export interface DateContact {
  contact: Contact;
  adrese: Adresa[];
}

export interface Contact {
  'id_cont': number;
  'id_mem': number;
  'email': string;
  'telefon': string;
}
export interface Adresa {
  'id_adresa': number;
  'id_mem': number;
  'tip': number;
  'tara_id': number;
  'jud_id': number;
  'localit': string;
  'cod_post': number;
  'strada': string;
  'nr': string;
  'bl': string;
  'scara': string;
  'ap': string;
  'tel': string;
  'detinator_adresa': string;
  'fax': string;
  'email': string;
  'web': string;
  'obs': string;
}
