## Certificat
- are asociat unul sau mai multe DLP

1. Stare Certificat - se poate calcula pe baza data_start si data_end:
    - Draft nu are data_start si data_end - nu este un document legal
    - Activ are data_start - este un document oficial eliberat de CMR
    - Inactiv are data_start si data_end - nu mai este valid/valabil

    daca este mai ok poate avea un camp draft/activ/inactiv (vezi inactivare)

2. Workflow
  - certificat nou cu datele care sunt introduse deja, 
    - daca nu are date nu se genereaza,
    - datele sunt datele care apar pe prima pagina si nu se iau in considerare datele pt dlp, adica exista posibilitatea generarii unui certificat fara dlp
    - daca exista un certificat activ nu se genereaza alt certificat
    - adica genereaza pagina 1
  - pt pagina 2
    - dlp-urile se asociaza unui singur certificat, informatia se tine la nivelul dlpului ( intr-un cert_id?)
    -  odata asociat dlp-ul nu se mai poate modifica
  -  inactivare certificat - stop date, si eventual un comment.
    -  un certificat inactivat devine read-only


## DLP
- este asociat unui Certificat
- contine cel putin o Asigurare

1. Stare DLP - se calculeaza pe baza data_start si data_end:
    - Draft are data_start mai mare ca azi
    - Activ are data_end mai mare ca azi
    - Inactiv este inchis si are data_end mai mica ca azi

daca este mai ok poate avea un camp activ/inactiv

2. Workflow: 

## Asigurare
- are asociat un singur grup de specialitati medicale

## Grup de specialitati medicale

- are asociat unul sau mai multe specialitati medicale
