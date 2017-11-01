# genavizare.php
- // am modificat tipurile de avizari - vezi reg_tip_avizare // daca asigurare ---tip = 9--- unul din tip = null => eroare in gen avizare
- // am modificat tipurile de avizari - vezi reg_tip_avizare // daca id_cpp da eroare -> nu poate rezolva cazurile pt tip asigurare 2 si 4 (competente limitate si medic generalist)
- nu face if daca are tip = 9, cauta id_asigurator si da eroare. Datele referitoare la asigurator nu trebuie sa apara pe un aviz care are status 9
- de verificat daca pe avizare apare corect gradul ( la medic cu competente limitate apare grad primar )
- asigurare tip 4 (medic care a terminat rezidentiatul) eroare de tip
- medic tip C cu rezidentiat - nu am facut nimic in frontend

- la generarea avizarii sa introduca continut - la fel ca la 


# gen certificat
- numerotare specialitati
- nu i-a in considerare specialist + rezident cu rezidentiat terminat ... cppTip 7 (nou creat)
- daca nu are titluri, nu afiseaza randul cu titluri...
- de pus datele certificatului in setkeywords

# ambele gen pdf
- mecanism pentru printare duplicat - if duplicat watermark vezi pdf gen

# api gen certificat
- eroare la generarea certificatului de tip C 
```html
<br />
<b>Notice</b>:  Undefined variable: spec in <b>/home/cip/www/cmr/inc/class.MyApi.inc</b> on line <b>2127</b><br />
<br />
<b>Notice</b>:  Undefined variable: sup in <b>/home/cip/www/cmr/inc/class.MyApi.inc</b> on line <b>2128</b><br />
{"result":"00","mesaj":"Adaugare certificat cu succes","nr":"9480"}"
```

- certificatele invalide nu mai trebuie sa aiba buton de print

- medic cu specialitate si rezidentiat - de verificat generarea avizarii

- cpp poate submite formularul doar cu tipul documentului

- Titluri - se termina in virgula

- invalideaza certificat -> dubleaza certificatul ....


# Done
- dashboard daca nu are judet, nu afiseaza restul paginii
- Titlu pdf pt certificat este Avizare

- cert tip B - medic care a fost rezident fara examen de specialitate (are stop date la rezident) - nu marcheaza corect, il marcheaza ca si rezident.
  - problema cu rezidentii - cum diferentiem rezidentii care au promovat ex de specialist? au 2 cpp cu acelasi cpp_id se ia in considerare cea cu gradul 2
  - de adaugat un nou tip de cpp - ___rezident fara examen specialist___
