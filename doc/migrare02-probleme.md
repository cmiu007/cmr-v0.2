## gen certificat

- la generare nu adauga data !!!! in continut ..... "data_cert": null, ......
- api gen certificat nu salveaza in DB seturile de date noi:
  - titluri
  - certificat de recunoastere a diplomei de facultate
- nu printeaza certificat de recunoastere a diplomei
- Titluri - se termina in virgula
- todo: daca nu are titluri, nu afiseaza randul cu titluri...

### prioritate f mica
- de pus datele certificatului in setkeywords
- spatiu dinamic intre sectiuni specialitati si supraspecializari


## gen avizare
- de adaugat in db camp continut

### prioritate f mica
- in frontend de adaugat preview

## ambele gen pdf
- mecanism pentru printare duplicat - if $duplicat se adauga o linie cu duplicat emis la data printarii
- in db flag optional duplicat
  - in front end casuta cu bifa
  - in template - " DUPLICAT eliberat la data de ......" deasupra titularului



### pt miu
- medicii absolvent 2005, primesc certificat tip B sau certificat tip C? - Laura
  - de clarificat si de facut workflow
  - trebuie ca pana in 2005 sa aiba adeverinta de terminare a stagiului
- numerotare specialitati, trebuie clarificat

## Date personale
- mecanism de detectie ue - non ue pt enable disable certificat de recunoastere al calificarii
