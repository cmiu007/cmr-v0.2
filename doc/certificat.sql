-- Invalideaza

SELECT * FROM `mem` WHERE `cuim` LIKE '2791465254' ORDER BY `id_mem` DESC

SELECT * FROM `mem_certificat` WHERE `id_mem` = 1672 ORDER BY `id_certificat` DESC


UPDATE `mem_certificat` SET `data_invalidare` = '2017-09-20' WHERE `mem_certificat`.`id_certificat` = 1609;
UPDATE `mem_certificat` SET `reg_cert_id` = '' WHERE `mem_certificat`.`id_certificat` = 1609;

