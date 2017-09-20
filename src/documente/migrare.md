# API

## Securizare
### 1. JWT
### 2. Throttle 
- 10 pe secunda?
### 3. log pt fail2 ban


## Date personale
 `fac_dipl_adev` varchar(120) NOT NULL,                                                      |   `fac_doc_tip` int(5) NOT NULL,

## Avizari (dlp)

- in db se creeaza avizarile pe baza asigurarilor anterioare
  - 1 singura asigurare -> start / stop
  - mai multe asigurari -> 1 singura avizare
  - verifica avizarile care sunt mai mari decat un an si modificare manuala  

## Asigurare

## Certificate
- exista membri cu mai multe certificate (29 membri)
  - pana acum am facut manual inactivarea in felul urmator:
    - delete reg_cert_id (ca sa nu fie printat)
    - add data_invalidare

- adauga camp pentru stare ex: activ/inactiv


