devel: cmr_test02

de verificat cu devel / cmr simplu de pe rm-test.cmr.ro

de verificat structura



Table mem


mai trebuie drop reg_gr_cdu 

si mai jos sunt diferentele pt cele 3 tabele

--
-- Alter table "mem"
--
ALTER TABLE mem
  CHANGE COLUMN fac_tip_doc fac_doc_tip INT(5) NOT NULL;

--
-- Alter table "mem_certificat"
--
ALTER TABLE mem_certificat
  CHANGE COLUMN cod_qr cod_qr VARCHAR(512) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  CHANGE COLUMN status status INT(3) DEFAULT 0;

--
-- Alter table "reg_titluri"
--
ALTER TABLE reg_titluri
  CHANGE COLUMN id_titlu id_titlu INT(15) NOT NULL AUTO_INCREMENT;

ALTER TABLE reg_titluri
  ADD UNIQUE INDEX id (id_titlu);
