## gen certificat
- in cazul in care are cpp de tip rez (cu stop date) si specialist: apar ambele pe certificat.
- la generare nu adauga data !!!! in continut ..... "data_cert": null, ......
- api gen certificat nu salveaza in DB seturile de date noi:
  - titluri
  - certificat de recunoastere a diplomei de facultate
- nu printeaza certificat de recunoastere a diplomei
- Titluri - se termina in virgula
- daca nu are titluri, nu afiseaza randul cu titluri...
- numerotare specialitati
- de pus datele certificatului in setkeywords
- spatiu dinamic intre sectiuni specialitati si supraspecializari
- medicii absolvent 2005, primesc certificat tip B sau certificat tip C? - Laura
  - de clarificat si de facut workflow
  - trebuie ca pana in 2005 sa aiba adeverinta de terminare a stagiului


## gen avizare
- de adaugat in db camp continut
- in frontend de adaugat preview

## ambele gen pdf
- mecanism pentru printare duplicat - if duplicat watermark vezi pdf gen
- flag optional duplicat
  - in front end casuta cu bifa
  - in template - " DUPLICAT eliberat la data de ......" deasupra titularului

## Date personale
- mecanism de detectie ue - non ue pt enable disable certificat de recunoastere al calificarii
