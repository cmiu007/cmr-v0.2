# modifica certificat

nu face update la campul status
nu adauga certificat id corespunzator

```php
$query = "update mem_certificat set id_mem=?, data_start=?, data_invalidare=?, reg_cert_id=?, cod_qr=? where id_certificat=?";
```
