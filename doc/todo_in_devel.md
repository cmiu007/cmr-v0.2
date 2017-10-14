de mutat in global data service


index.html - <title>Registrul Medicilor C.M.R.</title>
styles.css - background: url("https://rm.cmr.ro/assets/img/hexellence.png") repeat;
adresa.component - <md-form-field class="column"><input type="text" placeholder="Cod Postal" mdInput formControlName="cod_post"></md-form-field>
authentication.service - 16 - return this.http.put('https://api.cmr.ro/api/auth', JSON.stringify({ email: username, password: password }))
authentication.service - 27 - .put('https://api.cmr.ro/api/auth', data)
form-set.service - 146 - 'cod_post': [data.cod_post, [this._validator.checkIfNumber]],
nomeclator.service - 12 -  return this.http.get('https://api.cmr.ro/api/' + nomenclator)
users.service - 13 - return this.http.get('https://api.cmr.ro/api/cpp', this.jwt()).map((response: Response) => response.json());
