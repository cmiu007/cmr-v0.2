## ___mem_dlp___

___dlp_inchis___ se transforma in ___dlp_tip___
  Tip DLP:
  - 1 pt dlp tip A
  - 2 pt dlp tip B - Medic cu competente limitate
  - 3 pt dlp tip B - Medic Rezident
  - 4 pt dlp tip C
  - 11 pt dlp tip vechi, versiune 1

toate dlp vechi au campul inchis V1 - vechi, versiunea 1

de adaugat continut ca la certificat.

,aeo,``
## ___mem___

api nu ia inconsiderare tip fac_doc

de completat cu 1 pt toate inregistrarile din baza de date

### status = toti au status 11

retrasi = status 0
de facut lista valori pt status, apoi update front end


## ___fac_doc_tip din reg_fac_doc_tip___

1 - diploma de licenta
2 - adeverinta
3 - diploma UE
4 - diploma non UE

la 4 are si confirmare M.S. in tabela separata - important pt completarea certificatului nou

## ___mem_fac_recunoastere:___
tabel nou

id
id_mem
serie
nr
data

api - end point adauga, get, modifica

## ___mem_obs___

api - adauga, get, modifica


# Avizari & Asigurari

## Reguli generale

 - fiecare tip de certificat are cate un tip de avizare
 - tipul de avizare se face in functie de tipul certificatului activ
 - fiecare avizare are cel putin o asigurare

### Avizare tip A
 - in tabela mem_dlp: tip = 1
 - fiecare specialitate are cate o asigurare
 - daca nu are asigurare se genereaza o asigurare 'nula'

    - in cazul in care o specialitate nu are asigurare: se introduce o asigurare 'nula'
*de completat* - in tabela mem_asig un nou camp status care face legatura cu reg_tip_avizare

      - id_mem
      - ___id_asigurator___ = null
      - id_dlp
      - ___id_cpp___ = null
      - status
      - ___polita_serie___ = null
      - ___polita_numar___ = null
      - data_start
      - data_end

### Avizare tip B
  - caz I pentru medici rezidenti sau care au terminat rezidentiatul, la fel ca pt avizarea de tip A
    - in tabela mem_dlp: tip = 3
  - caz II pentru medici cu competente limitate (au terminat fac dupa 2005, nu sunt rezidenti, nu au specialitate)
    - in tabela mem_dlp: tip = 2
    - in tabela mem_asig
      -  ___id_cpp___ = null

### Avizare tip C
- in tabela mem_dlp: tip 4
- se genereaza o asigurare
  - in tabela mem_asig ___id_cpp___ = null

* tabela mem_dlp - avizarile 'vechi' vor primi tip 11


## Stabilire tip Avizare
- in functie de tipul certificatului activ




