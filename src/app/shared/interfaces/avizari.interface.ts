export interface Avizari {
  avizari: Avizare[];
}

export interface Avizare {
  'id_dlp': number;
  'id_mem': number; // de schimbat in id_certificat
  'inchis': number; // de schimbat denumirea in activ
  'dlp_data_start': string;
  'dlp_data_end': string;
  'status': number;
  'id_certificat': number;
}
