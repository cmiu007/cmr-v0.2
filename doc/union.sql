SELECT * FROM `mem_certificat` WHERE `id_mem` = 2543 ORDER BY `id_mem` DESC ;


SELECT * FROM `mem` WHERE `cuim` LIKE '2791466125' ORDER BY `id_mem` DESC;

SELECT * FROM  `mem_certificat` where `id_mem`;

SELECT (
  SELECT * from `mem_certificat` where `cuim` like 'XXX'
)
