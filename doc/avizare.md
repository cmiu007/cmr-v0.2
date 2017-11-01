1. din mem_dlp pe baza id_dlp
    1. tip - corespunde cu tip-ul avizarii - stabilesc tipul de continut al avizarii
    2. id_certificat - pt date
2. cu id_certificat iau datele din mem_certificat
3. cu id_dlp iau lista de asigurari din mem_asig
    1. fiecare asigurare poate avea unul din urmatoarele tipuri, care corespund notelor de subsol ale avirazilor
        1. Drept de liberă practică (1) - Avizare tip A
        2. Drept de practică SUPRAVEGHEATĂ (2) - Avizare tip B sau tip C - medici care au o specialitate dar sunt si rezidenti end date 0000-00-00
        3. Drept de practică SUPRAVEGHEATĂ (3) - Avizare tip B sau tip C pt medicii care au terminat rezidentiatul fara a promova examenul de specialist
        4. Competente limitate - Avizare tip B pt medici fara specialitati sau rezidentiat
        5. Drept de liberă practică(1) - Medicină Generală - certificat de tip C
        6. FĂRĂ drept de practică - oricare din item 1 - 5 de mai sus care nu indeplinesc criteriile de avizare
        9. asigurari de tip vechi 


in functie de id_dlp tip
