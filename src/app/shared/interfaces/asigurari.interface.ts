export interface Asigurari {
  asigurare: Asigurare[];
}

export interface Asigurare {
  'id_asig': number;
  'id_mem': number;
  'id_asigurator': number;
  'id_dlp': number;
  'polita_serie': string;
  'polita_nr': string;
  'data_start': string;
  'data_eng': string;
}
