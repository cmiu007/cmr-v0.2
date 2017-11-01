# genavizare.php
## daca asigurare ---tip = 9--- unul din tip = null => eroare in gen avizare
## daca id_cpp da eroare -> nu poate rezolva cazurile pt tip asigurare 2 si 4 (competente limitate si medic generalist)
## nu face if daca are tip = 9, cauta id_asigurator si da eroare. Datele referitoare la asigurator nu trebuie sa apara pe un aviz care are status 9
## titlul este certificat
## de verificat daca pe avizare apare corect gradul ( la medic cu competente limitate apare grad primar )
## asigurare tip 4 (medic care a terminat rezidentiatul) eroare de tip

# gen certificat
## numerotare specialitati
## daca nu are titluri, nu afiseaza randul cu titluri...
## cert tip B - medic care a fost rezident fara examen de specialitate (are stop date la rezident) - nu marcheaza corect, il marcheaza ca si rezident
## de pus datele certificatului in setkeywords


# api gen certificat
## eroare la generarea certificatului de tip C 
```
<br />
<b>Notice</b>:  Undefined variable: spec in <b>/home/cip/www/cmr/inc/class.MyApi.inc</b> on line <b>2127</b><br />
<br />
<b>Notice</b>:  Undefined variable: sup in <b>/home/cip/www/cmr/inc/class.MyApi.inc</b> on line <b>2128</b><br />
{"result":"00","mesaj":"Adaugare certificat cu succes","nr":"9480"}"
```


## certificatele invalide nu mai trebuie sa aiba buton de print

## medic cu specialitate si rezidentiat - de verificat generarea avizarii

## Titlu pdf pt certificat este Avizare

## cpp poate submite formularul doar cu tipul documentului

## Titluri - se termina in virgula

## invalideaza certificat -> dubleaza certificatul ....


# Done
## dashboard daca nu are judet, nu afiseaza restul paginii
