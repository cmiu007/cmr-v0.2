# genavizare.php
- // am modificat tipurile de avizari - vezi reg_tip_avizare // daca asigurare ---tip = 9--- unul din tip = null => eroare in gen avizare
- // am modificat tipurile de avizari - vezi reg_tip_avizare // daca id_cpp da eroare -> nu poate rezolva cazurile pt tip asigurare 2 si 4 (competente limitate si medic generalist)
- nu face if daca are tip = 9, cauta id_asigurator si da eroare. Datele referitoare la asigurator nu trebuie sa apara pe un aviz care are status 9
- de verificat daca pe avizare apare corect gradul ( la medic cu competente limitate apare grad primar )
- asigurare tip 4 (medic care a terminat rezidentiatul) eroare de tip
- medic tip C cu rezidentiat - nu am facut nimic in frontend

- la generarea avizarii sa introduca continut - la fel ca la 

- de revazut spatierea


# gen certificat
- numerotare specialitati
- nu i-a in considerare specialist + rezident cu rezidentiat terminat ... cppTip 7 (nou creat)
- daca nu are titluri, nu afiseaza randul cu titluri...
- de pus datele certificatului in setkeywords
- de revazut spatierea

# de revazut de ce nu merge generarea de asigurari pt cpp tip 7 rezident fara examen

# ambele gen pdf
- mecanism pentru printare duplicat - if duplicat watermark vezi pdf gen

# api gen certificat

- certificatele invalide  / vechi nu mai trebuie sa aiba buton de print

- cpp poate submite formularul doar cu tipul documentului

- Titluri - se termina in virgula
- De vazut daca sunt in preview-ul certificatului ...
- de vazut daca sunt salvate in DB

- api gen certificat nu salveaza in DB seturile de date noi:
  - titluri
  - certificat de recunoastere a diplomei de facultate

# Date personale
- mecanism de detectie ue - non ue pt enable disable certificat de recunoastere al calificarii

# Done
- dashboard daca nu are judet, nu afiseaza restul paginii
- Titlu pdf pt certificat este Avizare

- cert tip B - medic care a fost rezident fara examen de specialitate (are stop date la rezident) - nu marcheaza corect, il marcheaza ca si rezident.
  - problema cu rezidentii - cum diferentiem rezidentii care au promovat ex de specialist? au 2 cpp cu acelasi cpp_id se ia in considerare cea cu gradul 2
  - de adaugat un nou tip de cpp - ___rezident fara examen specialist___


## Teste

jud 140 Bucuresti
nume membru Certificat ....

- ___Form Avizare___ tip B rezident - nu se poate adauga avizare
- ___Certificat___ tip C - genereaza B, nu C, daca anul promotiei este 2005, pana tip C era pt egal sau mai mic de 2005

- spatiu gol mare intre tabel si nota pt cert tip C

# Rezolvat



~~## pt Miu asigurare pt cert tip B - competente limitate nu merge ok asigurarea - la fel ca la cert tip C~~

~~## pt Miu - de terminat in asigurare component generarea numelui~~

# key app - cum ?


## Recunoastere facultate

```sql
ALTER TABLE `mem` ADD `fac_rec_serie` TEXT NULL DEFAULT NULL AFTER `fac_doc_tip`, ADD `fac_rec_numar` TEXT NULL DEFAULT NULL AFTER `fac_rec_serie`, ADD `fac_rec_data` DATE NULL DEFAULT NULL AFTER `fac_rec_numar`;
ALTER TABLE `mem` ADD `fac_rec_emitent` INT(5) NULL DEFAULT NULL AFTER `fac_doc_tip`;
```


## Update tip asigurare
- Done ~~id db productie:~~ 
```sql
 UPDATE `mem_asig` set tip = '20' where tip='9'
```

- de modificat toate asigurarile cu tip 6 - 10 inregistrari in DB productie 
```sql
SELECT * FROM `mem_asig` WHERE `tip` = 6 ORDER BY `id_asig` DESC
```
