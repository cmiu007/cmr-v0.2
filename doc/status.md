
Status	Comment	Interfata	Actiune pt status	Rez Actiune Front End	In front end poate sa:
0	Draft	edit	Incheie editarea	db_status = 1	adauge asigurari
1	Complet	read only	Printeaza	db_status = 2	printeaza
2	Activ	read only	Inactiveaza	db_status = 3	inactiveaza ( pt cazul in care schimba certificat)
3	Inactiv	read only
