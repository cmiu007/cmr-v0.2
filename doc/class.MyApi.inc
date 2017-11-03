<?php
class MyApi extends Api
{
    protected $User;
    protected $cmj;
    protected $log;
    protected $db;
    protected $payload;
    protected $raspuns;
    
    public function __construct($request, $origin, $log, $db) {
        parent::__construct($request);
        $this->log=$log;
        $this->db=$db;
        $this->raspuns = "";
        /* log request-ul */
        //$ll=print_r($request,true);
        //$this->log->logDebug("Request: ".$ll);
        $this->payload = json_decode($this->file,true);
        //$this->log->logDebug("endpoint: ".$this->endpoint);
        //$ll=print_r($this->payload,true);
        //$this->log->logDebug("Payload: ".$ll);
        if ($this->endpoint != "auth") {
            if (isset($this->payload['token']))
            {
                $token = $this->payload['token'];
                //$this->log->logDebug('Tokenul este:' . $token);
                $stmt=$this->db->prepare("select user.id as user, user.cmj as cmj, token.id as id, token.data_start as data_start from user inner join token on token.user=user.email where token.token=?");
                try{
                    $stmt->execute(array($token));
                }
                catch (PDOException $e)
                {
                    $this->log->LogFatal("DB ERROR: ".$e->getMessage());
                    $result=array('result' => '01' , 'mesaj' => $e->getMessage());
                    return($result);
                }
                if ($stmt->rowCount()>0){
                    $row=$stmt->fetch();
                    $this->User = $row['user'];
                    $this->cmj = $row['cmj'];
                    $now=time();
                    $timestamp=strtotime($row['data_start']);
                    if ($row['data_start'] != "0000-00-00 00:00:00")
                    {
                        if (( $now - $timestamp < 0 ) || ( $now - $timestamp > 3600 )){ $this->raspuns=array('result'=>'12', 'mesaj'=>'Token invalid'); }
                        else {
                            try{ $stmt=$this->db->query("update token set data_start =now() where id='".$row['id']."'"); }
                            catch (PDOException $e){
                                $this->log->LogFatal("DB ERROR: ".$e->getMessage());
                                $result=array('result' => '01' , 'mesaj' => $e->getMessage());
                                return($result);
                            }
                        }
                    }
                }
                else{
                        //$this->log->logDebug('Tokenul nu este in baza de date'); 
                        $this->raspuns=array('result'=>'12', 'mesaj'=>'Token invalid');
                    }
            }
            else{
                    $this->raspuns=array('result'=>'12', 'mesaj'=>'Token invalid');
            }
        }
    }
    
    protected function logout(){
        $this->log->logDebug("Logout");
        $query = 'delete from token where token = "'.$this->payload['token'].'"';
        try{ $stmt=$this->db->query($query); }
        catch (Exception $e){
            $this->log->LogFatal("DB ERROR: ".$e->getMessage());
            return(array('result' => '01' , 'mesaj' => $e->getMessage()));
        }
        return(array('result'=>'00', 'mesaj'=>'Logout succes'));
    }

    protected function genCUIM($id){
        return $id+2791463582;
    }
    
    protected function fin_dlp(){
        $this->log->logDebug("Finalizare DLP");
        $this->log->logDebug("DLP: ".$payload['id']);
        $query = 'update mem_dlp set inchis="1" where id_dlp = "'.$this->payload['id'].'"';
        try{ $stmt=$this->db->query($query); }
        catch (Exception $e){
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            return(array('result' => '01' , 'mesaj' => $e->getMessage()));
        }
        return(array('result'=>'00', 'mesaj'=>'Inchis cu succes'));
    }
    
    protected function adauga(){
        if ($this->raspuns != "") return $this->raspuns;
        switch($this->payload['actiune']){
            case "date_personale":
                {
                    // Preluare date personale din payload
                    $date_personale = $this->payload['data'];
                    $ll = print_r($this->payload, true);
                    $this->log->logDebug("Payload: ".$ll);
                    //$ll = print_r($date_personale, true);
                    //$this->log->logDebug("Date_personale: ".$ll);
                    //$this->log->logDebug("Jud operator: ".$this->cmj."  Judet date: ".$date_personale['jud_id']);
                    // Verificam daca judetul din datele introduse corespunde cu judetul operatorului
                    if (($date_personale['jud_id'] != $this->cmj)&&($this->cmj != '160')) { return(array('result' => '14', 'mesaj' => 'Judetul din date diferit de judetul operatorului')); }
                    // Verificam daca CNP-ul mai exista in BD
                    $query = "select id_mem from mem where cnp = ?";
                    $stmt = $this->db->prepare($query);
                    try{ $stmt->execute(array($date_personale['cnp'])); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        return(array('result' => '01' , 'mesaj' => $e->getMessage()));
                    }
                    if ($stmt->rowCount() > 0){ return(array('result' => '20', 'mesaj' => 'CNP-ul introdus mai exista in baza de date')); }
                    $date_pers=array_values($date_personale);
                    // nu mergea add new medic		    
                            /// $query = "insert into mem (cnp, jud_id, data_juramant, cod_parafa, nume, initiala, prenume, nume_ant, cetatenie, act_ident_tip_id, act_ident_serie, act_ident_nr,
                            //act_ident_exp_date,
                    // fac_absolv, fac_promotie, fac_dipl_serie, fac_dipl_nr, fac_dipl_data, fac_dipl_adev) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    $query = "insert into mem (cnp, jud_id, data_juramant, cod_parafa, nume, initiala, prenume, nume_ant, cetatenie, act_ident_tip_id, act_ident_serie, act_ident_nr,
                    act_ident_exp_date, fac_absolv, fac_promotie, fac_dipl_serie, fac_dipl_nr, fac_dipl_data, fac_doc_tip) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    //$this->log->logDebug("Query adaugare:".$query);
                    $stmt = $this->db->prepare($query);
                    try{ $stmt->execute($date_pers); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        return(array('result' => '01' , 'mesaj' => $e->getMessage()));
                    }
                    $medic = $this->db->lastInsertId();
                    $cuim = $this->genCUIM($medic);
                    $this->log->logDebug("Adaugare cuim: ".$cuim);
                    $query = "update mem set status = '11', cuim='".$cuim."' where id_mem = '".$medic."'";
                    try{ $stmt=$this->db->query($query); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        return(array('result' => '01' , 'mesaj' => $e->getMessage()));
                    }
                    $this->log->logDebug("Adaugare in log: ");
                    $actiune = implode(',',$date_personale);
                    $actiune .= ", ".$cuim;
                    $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$medic.'","'.$cand.'","adaugare date personale","'.$actiune.'","")';
                    try{ $stmt = $this->db->query($query); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        return(array('result' => '01' , 'mesaj' => $e->getMessage()));
                    }
                    $result=array('result'=>'00', 'mesaj'=>'Adaugare date personale cu succes', 'id_med' => $medic);
                    $this->log->logDebug("Adaugare cu succes");
                    return($result);
                }
            break;
            case "adresa":
                {
                    $adresa = $this->payload['data'];
                    $ll = print_r($this->payload, true);
                    $this->log->logDebug("Payload: ".$ll);
                    //$this->log->logDebug("Jud operator: ".$this->cmj."  Judet date: ".$adresa['jud_id']);
                    //if ($adresa['jud_id'] != $this->cmj){ return(array('result' => '14', 'mesaj' => 'Judetul din date diferit de judetul operatorului')); }
                    $query = "insert into mem_adrese (id_mem, tip, tara_id, jud_id, localit, cod_post, strada, nr, bl, scara, ap, tel, detinator_adresa, fax, email, web, obs)
                    values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    $stmt = $this->db->prepare($query);
                    $adr = array_values($adresa);
                    try{ $stmt->execute($adr); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        return(array('result' => '01' , 'mesaj' => $e->getMessage()));
                    }
                    $actiune = implode(',',$adresa);
                    $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$adresa['id_mem'].'","'.$cand.'","adaugare adrese ","'.$actiune.'","")';
                    try{ $stmt = $this->db->query($query); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        return( array('result' => '01' , 'mesaj' => $e->getMessage()));
                    }
                    $result=array('result'=>'00', 'mesaj'=>'Adaugare adrese cu succes');
                    $this->log->logDebug("Adaugare cu succes");
                    return($result);
                }
            break;
            case "cpp":
                {
                $cpp = $this->payload['data'];
                $ll = print_r($cpp, true);
                $this->log->logDebug("Payload: ".$ll);
                $id = $cpp['id_mem'];
                // Verificam daca judetul din datele introduse corespunde cu judetul operatorului
                try{
                    $stmt = $this->db->query("select jud_id from mem where id_mem = '".$id."'");
                }
                catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }   
                $row = $stmt->fetch();
                $this->log->logDebug("ID medic: ".$id." Judet medic: ".$row['jud_id']."  Judet utilizator: ".$this->cmj);
                if (($row['jud_id'] != $this->cmj)&&($this->cmj != '160'))
                {
                    $data = array('result' => '14', 'mesaj' => 'Judetul din date diferit de judetul operatorului');
                    return($data);
                }   
                //foreach ($cppuri as $cpp){
                    $query = "insert into mem_cpp (id_mem, reg_cpp_tip_id, reg_cpp_id, grad_prof_cpp_id, date_start, date_end, emitent, act_serie, act_numar, act_data, act_descriere, obs)
                    values (?,?,?,?,?,?,?,?,?,?,?,?)";
                    $stmt = $this->db->prepare($query);
                    $cp = array_values($cpp);
                    try{
                        $stmt->execute($cp);
                    }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $actiune = implode(',',$cpp);
                     $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$cpp['id_mem'].'","'.$cand.'","adaugare cpp ","'.$actiune.'","")';
                    try{
                        $stmt = $this->db->query($query);
                    }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }    
                //}
                $result=array('result'=>'00', 'mesaj'=>'Adaugare cpp cu succes');
                return($result);
                $this->log->logDebug("Adaugare cpp cu succes");
                }
            break;
            case "contact":
                {
                $contact = $this->payload['data'];
                $ll = print_r($contact, true);
                $this->log->logDebug("Payload: ".$ll);
                $id = $contact['id_mem'];
                // Verificam daca judetul din datele introduse corespunde cu judetul operatorului
                try{
                    $stmt = $this->db->query("select jud_id from mem where id_mem = '".$id."'");
                }
                catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }   
                $row = $stmt->fetch();
                $this->log->logDebug("ID medic: ".$id." Judet medic: ".$row['jud_id']."  Judet utilizator: ".$this->cmj);
                if (($row['jud_id'] != $this->cmj)&&($this->cmj != '160'))
                {
                    $data = array('result' => '14', 'mesaj' => 'Judetul din date diferit de judetul operatorului');
                    return($data);
                }   
                //foreach ($cppuri as $cpp){
                    $query = "insert into mem_contact (id_mem, email, telefon, dummy) values (?,?,?,?)";
                    $stmt = $this->db->prepare($query);
                    $cp = array_values($contact);
                    try{
                        $stmt->execute($cp);
                    }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $actiune = implode(',',$contact);
                     $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$contact['id_mem'].'","'.$cand.'","adaugare contact ","'.$actiune.'","")';
                    try{
                        $stmt = $this->db->query($query);
                    }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }    
                //}
                $result=array('result'=>'00', 'mesaj'=>'Adaugare contact cu succes');
                return($result);
                $this->log->logDebug("Adaugare contact cu succes");
                }
            break;
            case "reg_loc_munca":
                {
                $lm = $this->payload['data'];
                $ll = print_r($lm, true);
                $this->log->logDebug("Payload: ".$ll);
                $query = "insert into reg_loc_munca (denumire, cif, atribut_cif, reg_com, dsp_nr_reg, jud_id, adresa) values (?,?,?,?,?,?,?)";
                $stmt = $this->db->prepare($query);
                $cp = array_values($lm);
                try{
                    $stmt->execute($cp);
                }
                catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $actiune = implode(',',$lm);
                $cand = date("Y-m-d h:i");
                $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$this->payload['id_mem'].'","'.$cand.'","adaugare loc munca ","'.$actiune.'","")';
                try{
                    $stmt = $this->db->query($query);
                }
                catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }    
                $result=array('result'=>'00', 'mesaj'=>'Adaugare in registrul de locuri de munca cu succes');
                return($result);
                $this->log->logDebug("Adaugare contact cu succes");
                }
            break;
            case "loc_munca":
                {
                $lm = $this->payload['data'];
                $ll = print_r($lm, true);
                $this->log->logDebug("Payload: ".$ll);
                $id = $lm['id_mem'];
                // Verificam daca judetul din datele introduse corespunde cu judetul operatorului
                try{
                    $stmt = $this->db->query("select jud_id from mem where id_mem = '".$id."'");
                }
                catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }   
                $row = $stmt->fetch();
                $this->log->logDebug("ID medic: ".$id." Judet medic: ".$row['jud_id']."  Judet utilizator: ".$this->cmj);
                if (($row['jud_id'] != $this->cmj)&&($this->cmj != '160'))
                {
                    $data = array('result' => '14', 'mesaj' => 'Judetul din date diferit de judetul operatorului');
                    return($data);
                }   
                //foreach ($cppuri as $cpp){
                    $query = "insert into mem_loc_munca (id_mem, reg_loc_munca_id, reg_cpp_id, full_time, data_start, data_end) values (?,?,?,?,?,?)";
                    $stmt = $this->db->prepare($query);
                    $cp = array_values($lm);
                    try{
                        $stmt->execute($cp);
                    }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $actiune = implode(',',$lm);
                    $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$id.'","'.$cand.'","adaugare contact ","'.$actiune.'","")';
                    try{
                        $stmt = $this->db->query($query);
                    }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }    
                //}
                $result=array('result'=>'00', 'mesaj'=>'Adaugare loc de munca cu succes');
                return($result);
                $this->log->logDebug("Adaugare contact cu succes");
                }
            break;
            case "asigurare":
                {
                $asig = $this->payload['data'];
                $ll = print_r($asig, true);
                $this->log->logDebug("Payload: ".$ll);
                $id = $asig['id_mem'];
                // Verificam daca judetul din datele introduse corespunde cu judetul operatorului
                try{
                    $stmt = $this->db->query("select jud_id from mem where id_mem = '".$id."'");
                }
                catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }   
                $row = $stmt->fetch();
                $this->log->logDebug("ID medic: ".$id." Judet medic: ".$row['jud_id']."  Judet utilizator: ".$this->cmj);
                if (($row['jud_id'] != $this->cmj)&&($this->cmj != '160'))
                {
                    $data = array('result' => '14', 'mesaj' => 'Judetul din date diferit de judetul operatorului');
                    return($data);
		}   
		    // original $query = "insert into mem_asig (id_mem, id_asigurator, polita_serie, polita_nr, data_start, data_end, id_dlp) values (?,?,?,?,?,?,?)";
                    $query = "insert into mem_asig (id_mem, id_asigurator, id_dlp, id_cpp, status, tip, polita_serie, polita_nr, data_start, data_end) values (?,?,?,?,?,?,?,?,?,?)";
                    $stmt = $this->db->prepare($query);
                    $cp = array_values($asig);
                    try{
                        $stmt->execute($cp);
                    }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $actiune = implode(',',$asig);
                    $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$id.'","'.$cand.'","adaugare asigurare ","'.$actiune.'","")';
                    try{
                        $stmt = $this->db->query($query);
                    }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }    
                $result=array('result'=>'00', 'mesaj'=>'Adaugare asigurare cu succes');
                return($result);
                $this->log->logDebug("Adaugare asigurare cu succes");
                }
            break;
            case "dlp":
                {
                $dlp = $this->payload['data'];
                $ll = print_r($dlp, true);
                $this->log->logDebug("Payload dlp: ".$ll);
                $id = $dlp['id_mem'];
                // Verificam daca judetul din datele introduse corespunde cu judetul operatorului
                try{
                    $stmt = $this->db->query("select jud_id from mem where id_mem = '".$id."'");
                }
                catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }   
                $row = $stmt->fetch();
                $this->log->logDebug("ID medic: ".$id." Judet medic: ".$row['jud_id']."  Judet utilizator: ".$this->cmj);
                if (($row['jud_id'] != $this->cmj)&&($this->cmj != '160'))
                {
                    $data = array('result' => '14', 'mesaj' => 'Judetul din date diferit de judetul operatorului');
                    return($data);
                }
                $query = "select * from mem_certificat where id_mem='".$id."' and status='2'";
                try{
                    $stmt = $this->db->query($query);
                }
                catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                if ($stmt->rowCount() == 0)
                {
                    $data = array('result' => '21', 'mesaj' => 'Nu avem certificat activ');
                    return($data);
                }
                $row = $stmt->fetch();
                $certificat = $row['id_certificat'];
                
                $cp = array_values($dlp);
                $cp[5] = $certificat;
                $ll = print_r($cp, true);
                $this->log->logDebug("Payload dlp: ".$ll);
                
  	        // $query = "insert into mem_dlp (id_mem, dlp_data_start, dlp_data_end, status, id_certificat) values (?,?,?,?,?)";
		// de pus inchis cf:
    		// - 1 pt dlp tip A
    		// - 2 pt dlp tip B - Medic cu competente limitate
    		// - 3 pt dlp tip B - Medic Rezident
    		// - 4 pt dlp tip C
    		// - 11 pt dlp tip vechi, versiune 1
		$query = "insert into mem_dlp (id_mem, tip, dlp_data_start, dlp_data_end, status, id_certificat) values (?,?,?,?,?,?)";
		$stmt = $this->db->prepare($query);
                
                try{
                    $stmt->execute($cp);
                }
                catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $actiune = implode(',',$cp);
                $cand = date("Y-m-d h:i");
                $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$id.'","'.$cand.'","adaugare dlp ","'.$actiune.'","")';
                try{
                    $stmt = $this->db->query($query);
                }
                catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $result=array('result'=>'00', 'mesaj'=>'Adaugare dlp cu succes');
                return($result);
                $this->log->logDebug("Adaugare dlp cu succes");
                }
            break;
            case "certificat":
                {
                    $this->log->logDebug("Adaugare certificat");
                    $cert = $this->payload['data'];
                    $ll = print_r($cert, true);
                    $this->log->logDebug("Payload: ".$ll);
                    $cp = array_values($cert);
                    $ll = print_r($cp, true);
                    $this->log->logDebug("Payload: ".$ll);
                    // get date certificat
                        $cont=$this->get_cert($cert['id_mem']);
                        switch($cont['tip_cert'])
                        {
                            case "A":
                               $cp[3]=1;
                            break;
                            case "B":
                                $cp[3]=2;
                            break;
                            case "C":
                                $cp[3]=3;
                            break;
                        }
                        
                        $continut=json_encode($cont);
                        
                        $query = "insert into mem_certificat (id_mem, data_start, data_invalidare, reg_cert_id, cod_qr, status, continut) values (?,?,?,?,?,?,?)";
                        //$this->log->logDebug("Query: ".$query);
                        $cp[]=$continut;
                        $stmt = $this->db->prepare($query);
                        $ll = print_r($cp, true);
                        $this->log->logDebug("Date: ".$ll);
                        
                        try{
                            $stmt->execute($cp);
                        }
                        catch (Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                        }
                        $certificat = $this->db->lastInsertId();
                        /*$actiune = implode(',',$cp);
                        $cand = date("Y-m-d h:i");
                        $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$this->payload['id_mem'].'","'.$cand.'","adaugare certiicat ","'.$actiune.'","")';
                        try{
                            $stmt = $this->db->query($query);
                        }
                        catch (Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                        }    */
                        $this->log->logDebug("Adaugare certificat cu succes. nr". $certificat);
                        $result=array('result'=>'00', 'mesaj'=>'Adaugare certificat cu succes','nr' => $certificat);
                        return($result);
                    //}
                }
            break;
            case "titlu":
                {
                    $titlu = $this->payload['data'];
                    $ll = print_r($titlu, true);
                    $this->log->logDebug("Payload titlu: ".$ll);
                    $id = $titlu['id_mem'];
                    // Verificam daca judetul din datele introduse corespunde cu judetul operatorului
                    try{
                        $stmt = $this->db->query("select jud_id from mem where id_mem = '".$id."'");
                    }
                    catch (Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                        }   
                    $row = $stmt->fetch();
                    if (($row['jud_id'] != $this->cmj)&&($this->cmj != '160'))
                    {
                        $data = array('result' => '14', 'mesaj' => 'Judetul din date diferit de judetul operatorului');
                        return($data);
                    }
                    
                    $cp = array_values($titlu);
                    $ll = print_r($cp, true);
                    $this->log->logDebug("Payload titlu: ".$ll);
                    
                    $query = "insert into mem_titlu (id_mem, reg_titlu_id, reg_facultate_id, status, data_start) values (?,?,?,?,?)";
                    $stmt = $this->db->prepare($query);
                    
                    try{
                        $stmt->execute($cp);
                    }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $actiune = implode(',',$cp);
                    $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$id.'","'.$cand.'","adaugare titlu ","'.$actiune.'","")';
                    try{
                        $stmt = $this->db->query($query);
                    }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $result=array('result'=>'00', 'mesaj'=>'Adaugare titlu cu succes');
                    return($result);
                    $this->log->logDebug("Adaugare dlp cu succes");
                }
                
            break;
            case "cmj":
                {
                $cmj = $this->payload['data'];
                $cp = array_values($cmj);
                $ll = print_r($cp, true);
                $this->log->logDebug("Payload dlp: ".$ll);
                
                $query = "insert into reg_cmj (id_reg_jud, email, telefon, fax, adresa, presedinte) values (?,?,?,?,?,?)";
                
                $stmt = $this->db->prepare($query);
                try{
                    $stmt->execute($cp);
                }
                catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $actiune = implode(',',$cp);
                $cand = date("Y-m-d h:i");
                $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","","'.$cand.'","adaugare cmj ","'.$actiune.'","")';
                try{
                    $stmt = $this->db->query($query);
                }
                catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $result=array('result'=>'00', 'mesaj'=>'Adaugare cmj cu succes');
                return($result);
                $this->log->logDebug("Adaugare dlp cu succes");
                }
            break;
        
        }
        
     }
	
	protected function modifica(){
		if ($this->raspuns != "") return $this->raspuns;
		switch($this->payload['actiune']){
			case "date_personale":
                {  
                    //$ll = print_r($this->payload, true);
                    //$this->log->logDebug("Payload: ".$ll);
                    $date_personale = $this->payload['data'];
                    //$ll = print_r($date_personale, true);
                    //$this->log->logDebug("Date_personale: ".$ll);
                    //$this->log->logDebug("Jud operator: ".$this->cmj."  Judet date: ".$date_personale['jud_id']);
                    if (($date_personale['jud_id'] != $this->cmj)&&($this->cmj != '160')) { return(array('result' => '14', 'mesaj' => 'Judetul din date diferit de judetul operatorului')); }
                    $id = $this->payload['id'];
                    $date_pers=array_values($this->payload['data']);
                    try{ $stmt = $this->db->query('select * from mem where id_mem = "'.$id.'"'); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        return(array('result' => '01' , 'mesaj' => $e->getMessage()));
                    }
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    $ll = print_r($row, true);
                    $this->log->logDebug("Row: ".$ll);
                    $date_vechi = implode(',',$row);
                    $date_noi = implode(',',$date_pers);
                    $actiune = 'Date anterioare: ';
                    $actiune .= $date_vechi;
                    $actiune .= '\nDate modificate: ';
                    $actiune .= $date_noi;
                    $this->log->LogError("Modificare: ".$actiune);                
                    $query = "update mem set ";
                    $date = "";
                    /*
                     * cod_parafa, nume, initiala, prenume, nume_ant, act_ident_tip_id, act_ident_serie, act_ident_nr, act_ident_exp_date,
                    fac_absolv, fac_promotie, fac_dipl_serie, fac_dipl_nr, fac_dipl_data, fac_dipl_adev
                     **/
                    if ($date_personale['cod_parafa'] != ""){ $query .= " cod_parafa = ?,"; $date[] = $date_personale['cod_parafa']; }
                    if ($date_personale['nume'] != ""){ $query .= " nume = ?,"; $date[] = $date_personale['nume']; }
                    if ($date_personale['nume_ant'] != ""){ $query .= " nume_ant = ?,"; $date[] = $date_personale['nume_ant']; }
                    if ($date_personale['act_ident_tip_id'] != ""){ $query .= " act_ident_tip_id = ?,"; $date[] = $date_personale['act_ident_tip_id']; }
                    if ($date_personale['act_ident_serie'] != ""){ $query .= " act_ident_serie = ?,"; $date[] = $date_personale['act_ident_serie']; }
                    if ($date_personale['act_ident_nr'] != ""){ $query .= " act_ident_nr = ?,"; $date[] = $date_personale['act_ident_nr']; }
                    if ($date_personale['act_ident_exp_date'] != ""){ $query .= " act_ident_exp_date = ?,"; $date[] = $date_personale['act_ident_exp_date']; }
                    if ($date_personale['fac_absolv'] != ""){ $query .= " fac_absolv = ?,"; $date[] = $date_personale['fac_absolv']; }
                    if ($date_personale['fac_promotie'] != ""){ $query .= " fac_promotie = ?,"; $date[] = $date_personale['fac_promotie']; }
                    if ($date_personale['fac_dipl_serie'] != ""){ $query .= " fac_dipl_serie = ?,"; $date[] = $date_personale['fac_dipl_serie']; }
                    if ($date_personale['fac_dipl_nr'] != ""){ $query .= " fac_dipl_nr = ?,"; $date[] = $date_personale['fac_dipl_nr']; }
                    if ($date_personale['fac_dipl_data'] != ""){ $query .= " fac_dipl_data = ?,"; $date[] = $date_personale['fac_dipl_data']; }
                    if ($date_personale['fac_doc_tip'] !=""){ $query .= " fac_doc_tip = ?,"; $date[] = $date_personale['fac_doc_tip']; }
                    
                    $query .= "initiala =?, prenume=? ";
                    $query .= " where id_mem=?";
                    $stmt = $this->db->prepare($query);
                    $date[] = $date_personale['initiala'];
                    $date[] = $date_personale['prenume'];
                    $date[] = $id;
                    $this->log->logDebug("Query: ".$query);
                    $this->log->logDebug("Date: ".implode(',',$date));
                    try{ $stmt->execute($date); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        return(array('result' => '01' , 'mesaj' => $e->getMessage()));
                    }
                    $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$id.'","'.$cand.'","Modificare date personale ","'.$actiune.'","")';
                    try{  $stmt = $this->db->query($query); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        return (array('result' => '01' , 'mesaj' => $e->getMessage()));
                    }
                    $result=array('result'=>'00', 'mesaj'=>'Modificare cu succes');
                    $this->log->logDebug("Modificare cu succes");
                }
                return($result);
			break;
            case "adresa":
                {
                    $id = $this->payload['id'];
                    $adresa = array_values($this->payload['data']);
                    try{ $stmt = $this->db->query('select * from mem_adrese where id_adresa = "'.$id.'"'); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        return(array('result' => '01' , 'mesaj' => $e->getMessage()));
                    }
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    $date_vechi = implode(',',$row);
                    $date_noi = implode(',',$adresa);
                    $actiune = 'Date anterioare: ';
                    $actiune .= $date_vechi;
                    $actiune .= '\nDate modificate: ';
                    $actiune .= $date_noi;
                    $query = "update mem_adrese set tip=?, tara_id=?, jud_id=?, localit=?, cod_post=?, strada=?, nr=?, bl=?, scara=?, ap=?, tel=?, detinator_adresa=?, fax=?, email=?, web=?, obs=? where id_adresa = ?";
                    $stmt = $this->db->prepare($query);
                    $medic=array_shift($adresa);
                    $adresa[] = $id;
                    try{ $stmt->execute($adresa); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$medic.'","'.$cand.'","Modificare adresa ","'.$actiune.'","")';
                    try{ $stmt = $this->db->query($query); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        return(array('result' => '01' , 'mesaj' => $e->getMessage()));
                    }
                    $this->log->logDebug("Modificare cu succes");
                    return(array('result'=>'00', 'mesaj'=>'Modificare cu succes'));
                }
            break;
            case "cpp":
                {
                    $id = $this->payload['id'];
                    $ll = print_r($this->payload, true);
                    $this->log->logDebug("Payload: ".$ll);
                    $cpp = $this->payload['data'];
                    $ll = print_r($cpp, true);
                    $this->log->logDebug("Cpp: ".$ll);
                    try{ $stmt = $this->db->query('select * from mem_cpp where id_cpp = "'.$id.'"'); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        return(array('result' => '01' , 'mesaj' => $e->getMessage()));
                    }
                    if ($stmt->rowCount() > 0)
                    {
                        $row = $stmt->fetch(PDO::FETCH_ASSOC);
                        $date_vechi = implode(',',$row);
                    }
                    else
                    {
                        return(array('result'=>'15', 'mesaj'=>'CPP-ul cu id-ul '.$id. ' nu exista.'));
                    }
                    $date_noi = implode(',',$cpp);
                    $actiune = 'Date anterioare: ';
                    $actiune .= $date_vechi;
                    $actiune .= '\nDate modificate: ';
                    $actiune .= $date_noi;
                    $query = 'update mem_cpp set ';
                    $data = array();
                    if (isset($cpp['reg_cpp_tip_id'])) { $query .= "reg_cpp_tip_id=?, "; $data[] = $cpp['reg_cpp_tip_id']; }
                    if (isset($cpp['reg_cpp_id'])) { $query .= "reg_cpp_id=?, "; $data[] = $cpp['reg_cpp_id']; }
                    if (isset($cpp['grad_prof_cpp_id'])) { $query .= "grad_prof_cpp_id=?, "; $data[] = $cpp['grad_prof_cpp_id']; }
                    if (isset($cpp['date_start'])) { $query .= "date_start=?, "; $data[] = $cpp['date_start']; }
                    if (isset($cpp['date_end'])) { $query .= "date_end=?, "; $data[] = $cpp['date_end']; }
                    if (isset($cpp['emitent'])) { $query .= "emitent=?, "; $data[] = $cpp['emitent']; }
                    if (isset($cpp['act_serie'])) { $query .= "act_serie=?, "; $data[] = $cpp['act_serie']; }
                    if (isset($cpp['act_numar'])) { $query .= "act_numar=?, "; $data[] = $cpp['act_numar']; }
                    if (isset($cpp['act_data'])) { $query .= "act_data=?, "; $data[] = $cpp['act_data']; }
                    if (isset($cpp['act_descriere'])) { $query .= "act_descriere=?, "; $data[] = $cpp['act_descriere']; }
                    if (isset($cpp['date_start'])) { $query .= "date_start=?, "; $data[] = $cpp['date_start']; }
                    if (isset($cpp['date_end'])) { $query .= "date_end=?, "; $data[] = $cpp['date_end']; }
                    $query .= 'obs=? where id_cpp = ?';
                    $data[] = $cpp['obs'];
                    $stmt = $this->db->prepare($query);
                    $data[] = $id;
                    $this->log->logDebug("Query: ".$query);
                    $this->log->logDebug("Date: ".implode(',',$data));
                    try{ $stmt->execute($data); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        return(array('result' => '01' , 'mesaj' => $e->getMessage()));
                    }
                    $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$adresa['id_mem'].'","'.$cand.'","Modificare cpp ","'.$actiune.'","")';
                    try{ $stmt = $this->db->query($query); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        return(array('result' => '01' , 'mesaj' => $e->getMessage()));
                    }
                    
                    $this->log->logDebug("Modificare cu succes");
                    return(array('result'=>'00', 'mesaj'=>'Modificare cu succes')); 
                }
            break;
            case "contact":
                {
                    $id = $this->payload['id'];
                    $contact = array_values($this->payload['data']);
                    $ll = print_r($contact, true);
                    $this->log->logDebug("Payload: ".$ll);
                    try{ $stmt = $this->db->query('select * from mem_contact where id_cont = "'.$id.'"'); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    $date_vechi = implode(',',$row);
                    $date_noi = implode(',',$contact);
                    $actiune = 'Date anterioare: ';
                    $actiune .= $date_vechi;
                    $actiune .= '\nDate modificate: ';
                    $actiune .= $date_noi;
                    $query = "update mem_contact set id_mem=?, email=?, telefon=?, dummy=? where id_cont = ?";
                    $stmt = $this->db->prepare($query);
                    $contact[] = $id;
                    try{ $stmt->execute($contact); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$contact['id_mem'].'","'.$cand.'","Modificare contact ","'.$actiune.'","")';
                    try{ $stmt = $this->db->query($query); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $result=array('result'=>'00', 'mesaj'=>'Modificare contact cu succes');
                    $this->log->logDebug("Modificare contact cu succes");
                    return($result); 
                }
            break;
            case "asigurare":
                {
                    if (isset($this->payload['id']))
                        $id = $this->payload['id'];
                    else
                        $id = '0';
                    $this->log->logDebug("ID: ".$id);
                    $asigurare = array_values($this->payload['data']);
                    //$ll = print_r($asigurare, true);
                    //$this->log->logDebug("Payload: ".$ll);
                    try{ $stmt = $this->db->query('select * from mem_asig where id_asig = "'.$id.'"'); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    
                    if ($stmt->rowCount() > 0 )
                    {
                        $row = $stmt->fetch(PDO::FETCH_ASSOC);
                        $date_vechi = implode(',',$row);
                    }
                    else
                    {
                        $data = array('result' => '15' , 'mesaj' => 'Inregistrarea cu ID '.$id.' nu exista.');
                        return ($data);
                    }
                    $date_noi = implode(',',$asigurare);
                    $actiune = 'Date anterioare: ';
                    $actiune .= $date_vechi;
                    $actiune .= '\nDate modificate: ';
                    $actiune .= $date_noi;
		    // original:
		    // $query = "update mem_asig set id_asigurator=?, polita_serie=?, polita_nr=?, data_start=?, data_end=?, id_dlp=? where id_asig = ?";
                    $query = "update mem_asig set id_asigurator=?, id_dlp=?, id_cpp=?, status=?, tip=?, polita_serie=?, polita_nr=?, data_start=?, data_end=? where id_asig = ?";
                    $medic=array_shift($asigurare);
                    $stmt = $this->db->prepare($query);
                    $asigurare[] = $id;
                    $ll = print_r($asigurare, true);
                    $this->log->logDebug("Date asigurare: ".$ll);
                    try{ $stmt->execute($asigurare); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$medic.'","'.$cand.'","Modificare asigurare ","'.$actiune.'","")';
                    try{ $stmt = $this->db->query($query); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
		    // original:
		    // $result=array('result'=>'00', 'mesaj'=>'Modificare contact cu succes');
                    $result=array('result'=>'00', 'mesaj'=>'Modificare asigurare cu succes');
		    // original:
		    // $this->log->logDebug("Modificare contact cu succes");
                    $this->log->logDebug("Modificare asigurare cu succes");
                    return($result); 
                }
            break;
            case "dlp":
                {
                    $this->log->logDebug("Modifica DLP");
                    $id = $this->payload['id'];
                    $dlp = array_values($this->payload['data']);
                    $ll = print_r($dlp, true);
                    $this->log->logDebug("Payload: ".$ll);
                    try{ $stmt = $this->db->query('select * from mem_dlp where id_dlp = "'.$id.'"'); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    $date_vechi = implode(',',$row);
                    // warning 
                    $date_noi = implode(',',$dlp);
                    $actiune = 'Date anterioare: ';
                    $actiune .= $date_vechi;
                    $actiune .= '\nDate modificate: ';
                    $actiune .= $date_noi;
		    // verificare data_end si daca nu este
		    //  $query = "update mem_dlp set dlp_data_start=?, dlp_data_end=?, status=? where id_dlp=?"; 
                    $query = "update mem_dlp set tip=?, dlp_data_start=?, dlp_data_end=?, status=? where id_dlp=?";
                    $medic=array_shift($dlp);
                    $stmt = $this->db->prepare($query);
                    $dlp[] = $id;
                    $ll = print_r($dlp, true);
                    $this->log->logDebug("Payload: ".$ll);
                    try{ $stmt->execute($dlp); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$medic.'","'.$cand.'","Modificare dlp ","'.$actiune.'","")';
                    try{ $stmt = $this->db->query($query); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $result=array('result'=>'00', 'mesaj'=>'Modificare dlp cu succes');
                    $this->log->logDebug("Modificare dlp cu succes");
                    return($result); 
                }
            break;
            case "certificat":
                {
                    $this->log->logDebug("Adaugare certificat");
                    $cert = $this->payload['data'];
                    $ll = print_r($cert, true);
                    $this->log->logDebug("Payload: ".$ll);
                    $cp = array_values($cert);
                    //$ll = print_r($cp, true);
                    //$this->log->logDebug("Payload: ".$ll);
                    $query = "update mem_certificat set id_mem=?, data_start=?, data_invalidare=?, reg_cert_id=?, cod_qr=?, status=? where id_certificat=?";
                    //$this->log->logDebug("Query: ".$query);
                    array_shift($cp);
                    $cp[]=$cert['id_certificat'];
                    $stmt = $this->db->prepare($query);
                    $ll = print_r($cp, true);
                    $this->log->logDebug("Date: ".$ll);
                    try{
                            $stmt->execute($cp);
                        }
                    catch (Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                        }
                    $this->log->logDebug("Modificare certificat cu succes");
                    // are eroare $certificat undefined
                    // $result=array('result'=>'00', 'mesaj'=>'Modificare certificat cu succes','nr' => $certificat);
                    $result=array('result'=>'00', 'mesaj'=>'Modificare certificat cu succes');
                    return($result);
                }
            break;
            case "titlu":
                {
                    $this->log->logDebug("Modifica titlu");
                    $id = $this->payload['id'];
                    $dlp = array_values($this->payload['data']);
                    $ll = print_r($dlp, true);
                    $this->log->logDebug("Payload: ".$ll);
                    try{ $stmt = $this->db->query('select * from mem_titlu where id_titlu = "'.$id.'"'); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    $date_vechi = implode(',',$row);
                    // warning 
                    $date_noi = implode(',',$dlp);
                    $actiune = 'Date anterioare: ';
                    $actiune .= $date_vechi;
                    $actiune .= '\nDate modificate: ';
                    $actiune .= $date_noi;
                    // verificare data_end si daca nu este 
                    $query = "update mem_titlu set data_start=?, data_stop=?, status=? where id_titlu=?";
                    $medic=array_shift($dlp);
                    $stmt = $this->db->prepare($query);
                    $dlp[] = $id;
                    $ll = print_r($dlp, true);
                    $this->log->logDebug("Payload: ".$ll);
                    try{ $stmt->execute($dlp); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$medic.'","'.$cand.'","Modificare titlu ","'.$actiune.'","")';
                    try{ $stmt = $this->db->query($query); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $result=array('result'=>'00', 'mesaj'=>'Modificare titlu cu succes');
                    $this->log->logDebug("Modificare titlu cu succes");
                    return($result); 
                }
                break;
            case "cmj":
                 {
                    $this->log->logDebug("Modifica CMJ");
                    $id = $this->payload['id'];
                    $cmj = array_values($this->payload['data']);
                    //$ll = print_r($dlp, true);
                    //$this->log->logDebug("Payload: ".$ll);
                    try{ $stmt = $this->db->query('select * from reg_cmj where id_cmj = "'.$id.'"'); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    $date_vechi = implode(',',$row);
                    // warning 
                    $date_noi = implode(',',$cmj);
                    $actiune = 'Date anterioare: ';
                    $actiune .= $date_vechi;
                    $actiune .= '\nDate modificate: ';
                    $actiune .= $date_noi;
                    // verificare data_end si daca nu este 
                    $query = "update reg_cmj set email=?, telefon=?, fax=?, adresa=?, presedinte=? where id_cmj=?";
                    $medic=array_shift($cmj);
                    $stmt = $this->db->prepare($query);
                    $cmj[] = $id;
                    $ll = print_r($cmj, true);
                    $this->log->logDebug("Payload: ".$ll);
                    try{ $stmt->execute($cmj); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $cand = date("Y-m-d h:i");
                    $query = 'insert into log (cine, id_med, cand, actiune, data, ip) values ("'.$this->User.'","'.$medic.'","'.$cand.'","Modificare cmj ","'.$actiune.'","")';
                    try{ $stmt = $this->db->query($query); }
                    catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $result=array('result'=>'00', 'mesaj'=>'Modificare cmj cu succes');
                    $this->log->logDebug("Modificare CMJ cu succes");
                    return($result); 
                }
            break;
		}
	}
    

	
    protected function get(){
        if ($this->raspuns != "") return $this->raspuns;
        $actiune=$this->payload['actiune'];
        switch ($actiune)
        {
			case "date_personale":
                {
                //$this->log->logDebug("Get date personale medic:");
				$id = $this -> payload['id'];
				try{ $stmt = $this->db->query("select * from mem where id_mem = '".$id."'"); }
				 catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    return(array('result' => '01' , 'mesaj' => $e->getMessage()));
                }
				$row = $stmt->fetch(PDO::FETCH_ASSOC);
				if (($row['jud_id'] == $this->cmj)||($this->cmj == '160')){
                    $raspuns = $row;
                    $raspuns['ro'] = 'false';
                }
                else{
                    $raspuns = [
                        'ro' => 'true',
                        'cuim' => $row['cuim'],
                        'cnp'  => $row['cnp'],
                        'jud_id' => $row['jud_id'],
                        'status' => $row['status'],
                        'nume' => $row['nume'],
                        'initiala' => $row['initiala'],
                        'prenume' => $row['prenume'],
                        'nume_ant' => $row['nume_ant'],
                        'cetatenie' => $row['cetatenie'],
                        'fac_absolv' => $row['fac_absolv'],
                        'fac_promotie' => $row['fac_promotie'],
                    ];
                }
                //$ll = print_r($raspuns,true);
                //$this->log->logDebug("Raspuns: ".$ll);
				return $raspuns;
                }
			break;
            case "adresa":
                {
                $this->log->logDebug("Get adresa medic:");
				$id = $this -> payload['id'];
                try{ $stmt = $this->db->query("select * from mem where id_adresa = '".$id."'"); }
				 catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    return(array('result' => '01' , 'mesaj' => $e->getMessage()));
                }
				$row = $stmt->fetch(PDO::FETCH_ASSOC);
				if ($row['jud_id'] == $this->cmj){
                    $raspuns = $row;
                    $raspuns['ro']='false';
                    }
                else
                    {
                     if ($row['tip'] == 'LM')
                      {
                        $raspuns = $row;
                        $raspuns['ro'] = 'true';
                      }
                    else
                        $raspuns = [];
                    }
                return $raspuns;
                }
            break;
            case "cpp":
                {
                    $this->log->logDebug("Get cpp medic:");
                    $id = $this -> payload['id'];
                    try{
					$stmt = $this->db->query("select * from mem_cpp where id_cpp = '".$id."'");
                    }
                     catch (Exception $e){
                        $this->log->LogError("DB ERROR: ".$e->getMessage());
                        $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                        return ($data);
                    }
                    $raspuns = $stmt->fetch(PDO::FETCH_ASSOC);
                    
                    $raspuns["ro"] ='false';
                    return $raspuns;
                }
            break;
            case "contact":
            {
                    $this->log->logDebug("Get contact medic:");
                    $id = $this -> payload['id'];
                    try{
					$stmt = $this->db->query("select * from mem_contact where id_cont = '".$id."'");
				}
				 catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
				$raspuns = $stmt->fetch(PDO::FETCH_ASSOC);
                
                $raspuns["ro"] ='false';
                return $raspuns;
            }
            break;
            case "loc_munca":
            {
                    $this->log->logDebug("Get loc munca medic:");
                    $id = $this -> payload['id'];
                    try{
					$stmt = $this->db->query("select * from mem_loc_munca where id_cont = '".$id."'");
				}
				 catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
				$raspuns = $stmt->fetch(PDO::FETCH_ASSOC);
                
                $raspuns["ro"] ='false';
                return $raspuns;
            }
            break;
            case "asigurare":
            {
                    $this->log->logDebug("Get asigurare medic:");
                    $id = $this -> payload['id'];
                    try{
					$stmt = $this->db->query("select * from mem_asig where id_asig = '".$id."'");
				}
				 catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
				$raspuns = $stmt->fetch(PDO::FETCH_ASSOC);
                
                $raspuns["ro"] ='false';
                return $raspuns;
            }
            break;
            case "dlp":
            {
                    $this->log->logDebug("Get dlp medic:");
                    $id = $this -> payload['id'];
                    try{
					$stmt = $this->db->query("select * from mem_dlp where id_dlp = '".$id."'");
				}
				 catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
				$raspuns = $stmt->fetch(PDO::FETCH_ASSOC);
                
                $raspuns["ro"] ='false';
                return $raspuns;
            }
            break;
            case "certificat":
            {
                $this->log->logDebug("Get certificat medic:");
                $id = $this -> payload['id'];
                try{
					$stmt = $this->db->query("select * from mem_certificat where id_certificat = '".$id."'");
				}
				catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
				$raspuns = $stmt->fetch(PDO::FETCH_ASSOC);
                //$raspuns['continut'] = stripslashes($raspuns['continut']);
                $raspuns["ro"] ='false';
                return $raspuns;
            }
            break;
            case "cmj":
            {
                $this->log->logDebug("Get CMJ:");
                $id = $this -> payload['id'];
                try{
					$stmt = $this->db->query("select * from reg_cmj where id_reg_jud = '".$id."'");
				}
				catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
				$raspuns = $stmt->fetch(PDO::FETCH_ASSOC);
                //$raspuns['continut'] = stripslashes($raspuns['continut']);
                $raspuns["ro"] ='false';
                return $raspuns;
            }
            break;
        }

     }

    protected function lista(){
        if ($this->raspuns != "")
            return $this->raspuns;
        
        $actiune=$this->payload['actiune'];
        switch ($actiune)
        {
            case "date_personale":
            case "list":
                {
                $this->log->logDebug("cautare in judet:");
				$cautare = $this->payload['cautare'];
                if ($this->cmj == '160')
                    $query = "select id_mem, nume, cnp, cuim, prenume from mem
                                                 where (nume like '%".$cautare."%'
                                                 or prenume like '%".$cautare."%'
                                                 or cuim like '%".$cautare."%'
                                                 or cnp like '%".$cautare."%') order by nume";
                else
                    $query = "select id_mem, nume, cnp, cuim, prenume from mem
                                                 where jud_id = '".$this->cmj."' and (nume like '%".$cautare."%'
                                                 or prenume like '%".$cautare."%'
                                                 or cuim like '%".$cautare."%'
                                                 or cnp like '%".$cautare."%') order by nume";
                //$this->log->logDebug("Query cautare: ".$query);
                try{
                    $stmt = $this->db->query($query);
                }
                catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $raspuns=array();
                while($row = $stmt->fetch())
                {
                    $data=[
                            'id' => $row['id_mem'],
                            'nume' => $row['nume'],
                            'jud_id' => $this->cmj,
                            'prenume' => $row['prenume'],
							'cnp' => $row['cnp'],
                            'cuim' => $row['cuim'],
                           ];
                    $raspuns[]=$data;
                }
                //$ll = print_r($raspuns,true);
                //$this->log->logDebug($ll);
                return $raspuns;
                }
            break;
            case "list_national":
                {
                $this->log->logDebug("cautare national:");
				$cautare = $this->payload['cautare'];
		// $jud_id = $this->payload['jud_id'];
                // if ($jud_id == 0)
                    $query = "select id_mem, jud_id, nume, cnp, cuim, prenume from mem
											 where nume like '%".$cautare."%'
											 or prenume like '%".$cautare."%'
											 or cuim like '%".$cautare."%'
											 or cnp like '%".$cautare."%' order by jud_id, nume ";
                // else
                //    $query = "select id_mem, jud_id, nume, cnp, cuim, prenume from mem
		//									 where jud_id = '".$jud_id."' and (nume like '%".$cautare."%'
		//									 or prenume like '%".$cautare."%'
		//									 or cuim like '%".$cautare."%'
		//									 or cnp like '%".$cautare."%') order by jud_id, nume ";    
                
                try{
                    $stmt = $this->db->query($query);
                }
                catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $raspuns=array();
                while($row = $stmt->fetch())
                {
                    $data=['id' => $row['id_mem'],
                            'jud_id' => $row['jud_id'],
                            'nume' => $row['nume'],
                            'prenume' => $row['prenume'],
							'cnp' => $row['cnp'],
                            'cuim' => $row['cuim'],
                           ];
                    $raspuns[]=$data;
                }
                //$ll = print_r($raspuns,true);
                //$this->log->logDebug($ll);
                return $raspuns;
                }
            break;            
            case "adrese":
            {
                //$this->log->logDebug("Lista adrese pentru ".$id.":");
                $id = $this->payload['id'];
                $query = "select * from mem_adrese where id_mem ='".$id."'";
                try{
                    $stmt = $this->db->query($query);
                }
                catch (PDOException $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $raspuns=array();
                while($row = $stmt->fetch(PDO::FETCH_ASSOC))
                {
                    $raspuns[]=$row;
                }
                //$ll = print_r($raspuns,true);
                //$this->log->logDebug($ll);
                return $raspuns;
                
            }
            break;
            case "cpp":
            {
                //$this->log->logDebug("Lista cpp pentru ".$id.":");
                //$ll = print_r($this->payload, true);
                //$this->log->logDebug("Payload: ".$ll);

                $id = $this->payload['id'];
                $query = "select * from mem_cpp where id_mem ='".$id."'";
                try{
                    $stmt = $this->db->query($query);
                }
                catch (PDOException $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $raspuns=array();
                while($row = $stmt->fetch(PDO::FETCH_ASSOC))
                {
                    $raspuns[]=$row;
                }
                //$ll = print_r($raspuns,true);
                //$this->log->logDebug($ll);
                return $raspuns;
            }
            break;
            case "contact":
            {
                //$this->log->logDebug("Lista contact pentru ".$id.":");
                //$ll = print_r($this->payload, true);
                //$this->log->logDebug("Payload: ".$ll);

                $id = $this->payload['id'];
                $query = "select * from mem_contact where id_mem ='".$id."'";
                try{
                    $stmt = $this->db->query($query);
                }
                catch (PDOException $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $raspuns=array();
                while($row = $stmt->fetch(PDO::FETCH_ASSOC))
                {
                    $raspuns[]=$row;
                }
                //$ll = print_r($raspuns,true);
                //$this->log->logDebug($ll);
                return $raspuns;
            }
            break;
            case "loc_munca":
            {
                //$this->log->logDebug("Lista loc de munca pentru ".$id.":");
                //$ll = print_r($this->payload, true);
                //$this->log->logDebug("Payload: ".$ll);

                $id = $this->payload['id'];
                $query = "select * from mem_loc_munca where id_mem ='".$id."'";
                try{
                    $stmt = $this->db->query($query);
                }
                catch (PDOException $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $raspuns=array();
                while($row = $stmt->fetch(PDO::FETCH_ASSOC))
                {
                    $raspuns[]=$row;
                }
                //$ll = print_r($raspuns,true);
                //$this->log->logDebug($ll);
                return $raspuns;
            }
            break;
            case "asigurare":
            {
                $id = $this->payload['id'];
                $this->log->logDebug("Lista asigurari pentru ".$id.":");
                $ll = print_r($this->payload, true);
                $this->log->logDebug("Payload: ".$ll);
                if (isset($this->payload['dlp']))
                    $query = "select * from mem_asig where id_mem ='".$id."' and id_dlp='".$this->payload['dlp']."'";
                else
                    $query = "select * from mem_asig where id_mem ='".$id."'";
                try{
                    $stmt = $this->db->query($query);
                }
                catch (PDOException $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $raspuns=array();
                while($row = $stmt->fetch(PDO::FETCH_ASSOC))
                {
                    $raspuns[]=$row;
                }
                //$ll = print_r($raspuns,true);
                //$this->log->logDebug($ll);
                return $raspuns;
            }
            break;
            case "dlp":
            {
                $id = $this->payload['id'];
                $this->log->logDebug("Lista dlp pentru ".$id.":");
                $ll = print_r($this->payload, true);
                $this->log->logDebug("Payload: ".$ll);
                
                if (isset($this->payload['cert']))
                    $query = "select * from mem_dlp where id_mem ='".$id."' and id_certificat='".$this->payload['cert']."' order by dlp_data_start asc";
                else
                    $query = "select * from mem_dlp where id_mem ='".$id."' order by dlp_data_start asc";
                
                
                try{
                    $stmt = $this->db->query($query);
                }
                catch (PDOException $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $raspuns=array();
                while($row = $stmt->fetch(PDO::FETCH_ASSOC))
                {
                    $raspuns[]=$row;
                }
                $ll = print_r($raspuns,true);
                $this->log->logDebug($ll);
                return $raspuns;
            }
            break;
            case "certificat":
            {
                $id = $this->payload['id'];
                $this->log->logDebug("Lista certificate pentru ".$id.":");
                $ll = print_r($this->payload, true);
                $this->log->logDebug("Payload: ".$ll);
                $query = "select * from mem_certificat where id_mem ='".$id."' order by id_certificat desc";
                try{
                    $stmt = $this->db->query($query);
                }
                catch (PDOException $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $raspuns=array();
                while($row = $stmt->fetch(PDO::FETCH_ASSOC))
                {
                    $raspuns[]=$row;
                }
                //$ll = print_r($raspuns,true);
                //$this->log->logDebug($ll);
                return $raspuns;
            }
	    break;

            case "titlu":
            {
                $id = $this->payload['id'];
                $this->log->logDebug("Lista titluri pentru ".$id.":");
                $ll = print_r($this->payload, true);
                $this->log->logDebug("Payload: ".$ll);
                $query = "select * from mem_titlu where id_mem ='".$id."' order by id_titlu desc";
                try{
                    $stmt = $this->db->query($query);
                }
                catch (PDOException $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $raspuns=array();
                while($row = $stmt->fetch(PDO::FETCH_ASSOC))
                {
                    $raspuns[]=$row;
                }
                //$ll = print_r($raspuns,true);
                //$this->log->logDebug($ll);
                return $raspuns;
            }
	    break;

            case "cmj":
            {
                //$id = $this->payload['id'];
                //$this->log->logDebug("Lista cmj pentru ".$id.":");
                $query = "select * from reg_cmj ";
                try{
                    $stmt = $this->db->query($query);
                }
                catch (PDOException $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
                $raspuns=array();
                while($row = $stmt->fetch(PDO::FETCH_ASSOC))
                {
                    $raspuns[]=$row;
                }
                $ll = print_r($raspuns,true);
                $this->log->logDebug($ll);
                return $raspuns;
            }
            break;
        }
    }
    
    /*****************************
     * Sterge
     *
     * ***************************/
    
    protected function sterge(){
        if ($this->raspuns != "") return $this->raspuns;
        $actiune=$this->payload['actiune'];
        switch ($actiune)
        {
            case "dlp":
            {
                $id = $this -> payload['id'];
                $this->log->logDebug("Sterge dlp medic ".$id.":");
                try{
					$stmt = $this->db->query("delete from mem_asig where id_dlp = '".$id."'");
				}
				 catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }   
                try{
					$stmt = $this->db->query("delete from mem_dlp where id_dlp = '".$id."'");
				}
				 catch (Exception $e){
                    $this->log->LogError("DB ERROR: ".$e->getMessage());
                    $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                    return ($data);
                }
				$data = array('result' => '00' , 'mesaj' => 'Dlp șters');
                return $data;
            }
            break;
        }
     }
     
    
    
    /**
     *  Get_certificat
     *
     * Ia decizia ce tip de certificat va fi.
     * Returneaza toate date necesare pentru generarea unui certificat
     * pentru confirmarea lor de catre operator.
     *
     */
    
    protected function get_certificat(){
        if ($this->raspuns != "") return $this->raspuns;
        $id=$this->payload['id'];
        $tip_cert = "";
        $query = "select * from mem_cpp where id_mem = '".$id."'";
        try{
        $stmt = $this->db->query($query);
        }
        catch(Exception $e){
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
            return ($data);
        }
        while($row = $stmt->fetch())
        {
            //$ll=print_r($row, true);
            //$this->log->logDebug("Row: ".$ll);
            if ($row['reg_cpp_tip_id'] == 2)
                {
                    $tip_cert = "A";
                    break;
                }
        }
        $query = "select mem.nume, mem.prenume, mem.cuim, mem.cnp, mem.fac_promotie as promotie, mem.fac_dipl_serie, mem.fac_dipl_nr, reg_facultate.nume_facultate as facultate, mem.data_juramant, reg_jud.nume_cmj as judet
        from mem inner join reg_facultate on mem.fac_absolv = reg_facultate.id_facultate inner join reg_jud on mem.jud_id = reg_jud.id_cmj where mem.id_mem = '".$id."'";
        try{
        $stmt = $this->db->query($query);
        }
        catch(Exception $e){
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
            return ($data);
        }
        $medic = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($tip_cert == "")
        {
            if ($medic['promotie'] < 2005)
                $tip_cert = "C";
            else
                $tip_cert = "B";
        }
        $nume = $medic['nume'] . " " . $medic['prenume'];
        $cnp = $medic['cnp'];
        $cuim = $medic['cuim'];
        $facultate = $medic['facultate'];
        $promotie = $medic['promotie'];
        
        $this->log->LogError("Tip certificat: ".$tip_cert);
        $now = date("d-m-Y");
        switch ($tip_cert)
        {
            case "A":
                    $spec = array();
                    $sup = array();
                    $cpp = array();
                    $query = "select mem_cpp.reg_cpp_tip_id as tip, mem_cpp.date_start, mem_cpp.date_end, reg_cpp.nume_cpp as specialitate, reg_gr_prof.nume_gr_prof as grad
                    from mem_cpp inner join reg_cpp on mem_cpp.reg_cpp_id=reg_cpp.id_cpp
                    left outer join reg_gr_prof on mem_cpp.grad_prof_cpp_id=reg_gr_prof.id_gr_prof
                    where mem_cpp.id_mem = '".$id."'";
                    try{
                        $stmt = $this->db->query($query);
                    }
                    catch(Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                    }
                    while($rw = $stmt->fetch())
                    {
                         $cpp[] = $rw;
                        if (($rw['tip'] == '2') && ($rw['date_end'] == '0000-00-00'))
                           {
                            $sp = ['specialitate'=>$rw['specialitate'], 'gr_prof' => $rw['grad'],];
                            $spec[] = $sp;
                           }
                        if (($rw['tip'] == '1') && ($rw['date_end'] == '0000-00-00'))
                            {
                            $sp = ['specialitate'=>$rw['specialitate'], 'gr_prof' => 'rezident',];
                            $spec[] = $sp;
                           }
                            
                        if (($rw['tip'] == 3) || ($rw['tip'] == 4) || ($rw['tip'] == 5) || ($rw['tip'] == 6))
                           {
                            $su = ['specialitate' => $rw['specialitate'], 'gr_prof' => $rw['grad'],];
                            $sup[] = $su;
                           }
                        
                    }
                    $query = "select reg_asigurator.nume_asigurator as asigurator, mem_asig.polita_serie, mem_asig.polita_nr, mem_asig.data_start, mem_asig.data_end
                    from mem_asig inner join reg_asigurator on mem_asig.id_asigurator = reg_asigurator.id_asigurator where mem_asig.id_mem = '".$id."'";
                    try{
                        $stmt = $this->db->query($query);
                    }
                    catch(Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                    }
                    $asigurare = array();
                    while($rw = $stmt->fetch())
                    {
                        $as = ['asigurator' => $rw['asigurator'], 'polita_serie' => $rw['polita_serie'], 'polita_nr' => $rw['polita_nr'], 'data_start' => $rw['data_start'], 'data_end' => $rw['data_end'],];
                        $asigurare[] = $as;
                        
                    }
                    
                    $certificat = [
                       "tip_cert" => $tip_cert,
                       "judet" => $medic['judet'],
                       "nume" => $nume,
                       "cnp" => $cnp,
                       "cuim" => $cuim,
                       "facultate" => $facultate,
                       "promotie" => $promotie,
                       "dipl_serie" => $medic['fac_dipl_serie'],
                       "dipl_nr" => $medic['fac_dipl_nr'],
                       "data_cert" => $now,
                       "data_juramant" => $medic['data_juramant'],
                       "specialitati" => $spec,
                       "superspecialitate" => $sup,
                       //"asigurare" => $asigurare,
                       //"cpp" => $cpp,
                       ];    
            
            break;
            case "B":
                    $query = "select mem_cpp.reg_cpp_tip_id as tip, reg_cpp.nume_cpp as specialitate, mem_cpp.date_start, mem_cpp.date_end
                    from mem_cpp left outer join reg_cpp on mem_cpp.reg_cpp_id=reg_cpp.id_cpp where mem_cpp.id_mem = '".$id."'";
                    try{
                        $stmtz = $this->db->query($query);
                    }
                    catch(Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                    }
                    $spec = array();
                    while($rw = $stmtz->fetch(PDO::FETCH_ASSOC))
                    {
                        $ll=print_r($rw,true);
                        $this->log->logDebug("Rw: ".$ll);
                        if ($rw['tip'] == '1')
                           {
                            $sp = ['specialitate'=>$rw['specialitate'], 'data_start' => $rw['date_start'], 'data_end' => $rw['date_end'],];
                            $spec[] = $sp;
                            }
                        else
                            {
                            $sp = ['specialitate'=>$rw['specialitate'],];
                            $spec[] = $sp;
                            }
                    }
                
                    $certificat = [
                       "tip_cert" => $tip_cert,
                        "judet" => $medic['judet'],
                       "nume" => $nume,
                       "cnp" => $cnp,
                       "cuim" => $cuim,
                       "facultate" => $facultate,
                       "promotie" => $promotie,
                       "data_cert" => $now,
                       "data_juramant" => $medic['data_juramant'],
                       "dipl_serie" => $medic['fac_dipl_serie'],
                       "dipl_nr" => $medic['fac_dipl_nr'],
                       "data_cert" => $now,
                       "specialitati" => $spec,
                       
                       ];    
            break;
            case "C":
                   $query = "select mem_cpp.reg_cpp_tip_id as tip, mem_cpp.date_start, mem_cpp.date_end, reg_cpp.nume_cpp as specialitate, reg_gr_prof.nume_gr_prof as grad
                    from mem_cpp inner join reg_cpp on mem_cpp.reg_cpp_id=reg_cpp.id_cpp
                    left outer join reg_gr_prof on mem_cpp.grad_prof_cpp_id=reg_gr_prof.id_gr_prof
                    where mem_cpp.id_mem = '".$id."'";
                    try{
                        $stmt = $this->db->query($query);
                    }
                    catch(Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                    }
                    while($rw = $stmt->fetch())
                    {
                        $ll=print_r($rw,true);
                        $this->log->logDebug("Rw: ".$ll);
                         $cpp[] = $rw;
                        if (($rw['tip'] == '1') && ($rw['date_end'] == '0000-00-00'))
                            {
                            $sp = ['specialitate'=>$rw['specialitate'], 'gr_prof' => 'rezident',];
                            $spec[] = $sp;
                           }
                            
                        if (($rw['tip'] == 3) || ($rw['tip'] == 4) || ($rw['tip'] == 5) || ($rw['tip'] == 6))
                           {
                            $su = ['specialitate' => $rw['specialitate'], 'gr_prof' => "",];
                            $sup[] = $su;
                           }
                        
                    }
                
                    $certificat = [
                       "tip_cert" => $tip_cert,
                        "judet" => $medic['judet'],
                       "nume" => $nume,
                       "cnp" => $cnp,
                       "cuim" => $cuim,
                       "facultate" => $facultate,
                       "promotie" => $promotie,
                       "data_cert" => $now,
                       "data_juramant" => $medic['data_juramant'],
                       "dipl_serie" => $medic['fac_dipl_serie'],
                       "dipl_nr" => $medic['fac_dipl_nr'],
                       "data_cert" => $now,
                       "specialitati" => $spec,
                       "superspecialitate" => $sup,
                       ];    
            break;
        }
        return $certificat;
    }
    
    
    protected function get_cert($id){
        if ($this->raspuns != "")
            return $this->raspuns;
        $tip_cert = "";
        $query = "select * from mem_cpp where id_mem = '".$id."'";
        try{
        $stmt = $this->db->query($query);
        }
        catch(Exception $e){
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
            return ($data);
        }
        while($row = $stmt->fetch())
        {
            //$ll=print_r($row, true);
            //$this->log->logDebug("Row: ".$ll);
            if ($row['reg_cpp_tip_id'] == 2)
                {
                    $tip_cert = "A";
                    break;
                }
        }
        $query = "select mem.nume, mem.prenume, mem.cuim, mem.cnp, mem.fac_promotie as promotie, mem.fac_dipl_serie, mem.fac_dipl_nr, reg_facultate.nume_facultate as facultate, mem.data_juramant, reg_jud.nume_cmj as judet
        from mem inner join reg_facultate on mem.fac_absolv = reg_facultate.id_facultate inner join reg_jud on mem.jud_id = reg_jud.id_cmj where mem.id_mem = '".$id."'";
        try{
        $stmt = $this->db->query($query);
        }
        catch(Exception $e){
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
            return ($data);
        }
        $medic = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($tip_cert == "")
        {
            if ($medic['promotie'] < 2005)
                $tip_cert = "C";
            else
                $tip_cert = "B";
        }
        $nume = $medic['nume'] . " " . $medic['prenume'];
        $cnp = $medic['cnp'];
        $cuim = $medic['cuim'];
        $facultate = $medic['facultate'];
        $promotie = $medic['promotie'];
        
        $this->log->LogError("Tip certificat: ".$tip_cert);
        $now = date("d-m-Y");
        switch ($tip_cert)
        {
            case "A":
                    $spec = array();
                    $sup = array();
                    $cpp = array();
                    $query = "select mem_cpp.reg_cpp_tip_id as tip, mem_cpp.date_start, mem_cpp.date_end, reg_cpp.nume_cpp as specialitate, reg_gr_prof.nume_gr_prof as grad
                    from mem_cpp inner join reg_cpp on mem_cpp.reg_cpp_id=reg_cpp.id_cpp
                    left outer join reg_gr_prof on mem_cpp.grad_prof_cpp_id=reg_gr_prof.id_gr_prof
                    where mem_cpp.id_mem = '".$id."'";
                    try{
                        $stmt = $this->db->query($query);
                    }
                    catch(Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                    }
                    while($rw = $stmt->fetch())
                    {
                         $cpp[] = $rw;
                        if (($rw['tip'] == '2') && ($rw['date_end'] == '0000-00-00'))
                           {
                            $sp = ['specialitate'=>$rw['specialitate'], 'gr_prof' => $rw['grad'],];
                            $spec[] = $sp;
                           }
                        if (($rw['tip'] == '1') && ($rw['date_end'] == '0000-00-00'))
                            {
                            $sp = ['specialitate'=>$rw['specialitate'], 'gr_prof' => 'rezident',];
                            $spec[] = $sp;
                           }
                            
                        if (($rw['tip'] == 3) || ($rw['tip'] == 4) || ($rw['tip'] == 5) || ($rw['tip'] == 6))
                           {
                            $su = ['specialitate' => $rw['specialitate'], 'gr_prof' => $rw['grad'],];
                            $sup[] = $su;
                           }
                        
                    }
                    $query = "select reg_asigurator.nume_asigurator as asigurator, mem_asig.polita_serie, mem_asig.polita_nr, mem_asig.data_start, mem_asig.data_end
                    from mem_asig inner join reg_asigurator on mem_asig.id_asigurator = reg_asigurator.id_asigurator where mem_asig.id_mem = '".$id."'";
                    try{
                        $stmt = $this->db->query($query);
                    }
                    catch(Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                    }
                    $asigurare = array();
                    while($rw = $stmt->fetch())
                    {
                        $as = ['asigurator' => $rw['asigurator'], 'polita_serie' => $rw['polita_serie'], 'polita_nr' => $rw['polita_nr'], 'data_start' => $rw['data_start'], 'data_end' => $rw['data_end'],];
                        $asigurare[] = $as;
                        
                    }
                    
                    $certificat = [
                       "tip_cert" => $tip_cert,
                       "judet" => $medic['judet'],
                       "nume" => $nume,
                       "cnp" => $cnp,
                       "cuim" => $cuim,
                       "facultate" => $facultate,
                       "promotie" => $promotie,
                       "dipl_serie" => $medic['fac_dipl_serie'],
                       "dipl_nr" => $medic['fac_dipl_nr'],
                       "data_cert" => $now,
                       "data_juramant" => $medic['data_juramant'],
                       "specialitati" => $spec,
                       "superspecialitate" => $sup,
                       //"asigurare" => $asigurare,
                       //"cpp" => $cpp,
                       ];    
            
            break;
            case "B":
                    $query = "select mem_cpp.reg_cpp_tip_id as tip, reg_cpp.nume_cpp as specialitate, mem_cpp.date_start, mem_cpp.date_end
                    from mem_cpp left outer join reg_cpp on mem_cpp.reg_cpp_id=reg_cpp.id_cpp where mem_cpp.id_mem = '".$id."'";
                    try{
                        $stmtz = $this->db->query($query);
                    }
                    catch(Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                    }
                    $spec = array();
                    while($rw = $stmtz->fetch(PDO::FETCH_ASSOC))
                    {
                        $ll=print_r($rw,true);
                        $this->log->logDebug("Rw: ".$ll);
                        if ($rw['tip'] == '1')
                           {
                            $sp = ['specialitate'=>$rw['specialitate'], 'data_start' => $rw['date_start'], 'data_end' => $rw['date_end'],];
                            $spec[] = $sp;
                            }
                        else
                            {
                            $sp = ['specialitate'=>$rw['specialitate'],];
                            $spec[] = $sp;
                            }
                    }
                
                    $certificat = [
                       "tip_cert" => $tip_cert,
                        "judet" => $medic['judet'],
                       "nume" => $nume,
                       "cnp" => $cnp,
                       "cuim" => $cuim,
                       "facultate" => $facultate,
                       "promotie" => $promotie,
                       "data_cert" => $now,
                       "data_juramant" => $medic['data_juramant'],
                       "dipl_serie" => $medic['fac_dipl_serie'],
                       "dipl_nr" => $medic['fac_dipl_nr'],
                       "data_cert" => $now,
                       "specialitati" => $spec,
                       
                       ];    
            break;
            case "C":
                   $query = "select mem_cpp.reg_cpp_tip_id as tip, mem_cpp.date_start, mem_cpp.date_end, reg_cpp.nume_cpp as specialitate, reg_gr_prof.nume_gr_prof as grad
                    from mem_cpp inner join reg_cpp on mem_cpp.reg_cpp_id=reg_cpp.id_cpp
                    left outer join reg_gr_prof on mem_cpp.grad_prof_cpp_id=reg_gr_prof.id_gr_prof
                    where mem_cpp.id_mem = '".$id."'";
                    try{
                        $stmt = $this->db->query($query);
                    }
                    catch(Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                    }
                    while($rw = $stmt->fetch())
                    {
                        $ll=print_r($rw,true);
                        $this->log->logDebug("Rw: ".$ll);
                         $cpp[] = $rw;
                        if (($rw['tip'] == '1') && ($rw['date_end'] == '0000-00-00'))
                            {
                            $sp = ['specialitate'=>$rw['specialitate'], 'gr_prof' => 'rezident',];
                            $spec[] = $sp;
                           }
                            
                        if (($rw['tip'] == 3) || ($rw['tip'] == 4) || ($rw['tip'] == 5) || ($rw['tip'] == 6))
                           {
                            $su = ['specialitate' => $rw['specialitate'], 'gr_prof' => "",];
                            $sup[] = $su;
                           }
                        
                    }
                
                    $certificat = [
                       "tip_cert" => $tip_cert,
                        "judet" => $medic['judet'],
                       "nume" => $nume,
                       "cnp" => $cnp,
                       "cuim" => $cuim,
                       "facultate" => $facultate,
                       "promotie" => $promotie,
                       "data_cert" => $now,
                       "data_juramant" => $medic['data_juramant'],
                       "dipl_serie" => $medic['fac_dipl_serie'],
                       "dipl_nr" => $medic['fac_dipl_nr'],
                       "data_cert" => $now,
                       "specialitati" => $spec,
                       "superspecialitate" => $sup,
                       ];    
            break;
        }
        return $certificat;
    }
    
    protected function getaviz(){
        //$this->log->LogDebug("Get avizare.");
        if ($this->raspuns != "") return $this->raspuns;
        //$ll=print_r($this->payload, true);
        //$this->log->logDebug("Row: ".$ll);
        
        $id=$this->payload['id'];
        $query = "select * from mem_certificat where id_certificat = '".$id."'";
        try{
            $stmt = $this->db->query($query);
        } 
        catch(Exception $e){
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
            return ($data);
        }    
        $certificat = $stmt->fetch();
        $query = "select * from mem where id_mem = '".$certificat['id_mem']."'";
        try{
            $stmt = $this->db->query($query);
        } 
        catch(Exception $e){
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
            return ($data);
        }    
        $medic = $stmt->fetch();
        
        $query = 'select distinct reg_cpp_grup.nume_cpp_grup
            from mem_dlp inner join mem_asig on mem_asig.id_dlp=mem_dlp.id_dlp
            inner join reg_asigurator on mem_asig.id_asigurator=reg_asigurator.id_asigurator
            inner join mem_cpp on mem_cpp.id_cpp=mem_asig.id_cpp
            inner join reg_cpp on reg_cpp.id_cpp=mem_cpp.reg_cpp_id
            inner join reg_cpp_grup on reg_cpp.grp_cpp=reg_cpp_grup.id_grup_cpp 
            where mem_dlp.id_dlp = "'.$id.'"';
        try{
            $stmt = $this->db->query($query);
        } 
        catch(Exception $e){
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
            return ($data);
        }
        
        $grup=array();
        while ($rw = $stmt->fetch())
        {
            $ll=print_r($rw, true);
            $this->log->logDebug("ID: ".$id.", Row: ".$ll);
            
            $query = 'select * from mem_asig inner join mem_cpp on mem_cpp.id_cpp=mem_asig.id_cpp
                            inner join reg_cpp on reg_cpp.id_cpp=mem_cpp.reg_cpp_id
                            inner join reg_cpp_grup on reg_cpp.grp_cpp=reg_cpp_grup.id_grup_cpp 
            where mem_asig.id_dlp = "'.$id.'" and reg_cpp_grup.nume_cpp_grup = "'.$rw['nume_cpp_grup'].'"';
            try{
                $st = $this->db->query($query);
            } 
            catch(Exception $e){
                $this->log->LogError("DB ERROR: ".$e->getMessage());
                $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                return ($data);
            }
            $specialitati=array();
            while ($rezultat = $st->fetch()){
                switch ($rezultat['tip']){
                    case "1":
                        $q='select mem_asig.tip, mem_asig.data_start, mem_asig.data_end, mem_asig.polita_serie, mem_asig.polita_nr, reg_asigurator.nume_asigurator, mem_cpp.id_cpp, reg_cpp.nume_cpp,
                         reg_gr_prof.nume_gr_prof, reg_tip_avizare.nume_tip_avizare
                        from mem_asig inner join reg_asigurator on mem_asig.id_asigurator=reg_asigurator.id_asigurator
                            inner join mem_cpp on mem_cpp.id_cpp=mem_asig.id_cpp
                            inner join reg_cpp on reg_cpp.id_cpp=mem_cpp.reg_cpp_id
                            inner join reg_gr_prof on reg_gr_prof.id_gr_prof=mem_cpp.grad_prof_cpp_id
                            inner join reg_tip_avizare on reg_tip_avizare.id_tip_avizare = mem_asig.tip
                        where mem_asig.id_asig = "'.$rezultat['id_asig'].'"';
                        try{
                            $state = $this->db->query($q);
                        } 
                        catch(Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                        }
                        $row = $state->fetch();
                        $ll=print_r($row, true);
                        $this->log->logDebug("Row: ".$ll);
                        $specialitati[]=$row;
                    break;
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                        $q='select mem_asig.tip, mem_asig.data_start, mem_asig.data_end, mem_asig.polita_serie, mem_asig.polita_nr, reg_asigurator.nume_asigurator, mem_cpp.id_cpp, reg_cpp.nume_cpp,
                        reg_tip_avizare.nume_tip_avizare
                        from mem_asig inner join reg_asigurator on mem_asig.id_asigurator=reg_asigurator.id_asigurator
                            inner join mem_cpp on mem_cpp.id_cpp=mem_asig.id_cpp
                            inner join reg_cpp on reg_cpp.id_cpp=mem_cpp.reg_cpp_id
                            inner join reg_tip_avizare on reg_tip_avizare.id_tip_avizare = mem_asig.tip
                        where mem_asig.id_asig = "'.$rezultat['id_asig'].'"';
                        try{
                            $state = $this->db->query($q);
                        } 
                        catch(Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                        }
                        $row = $state->fetch();
                        $ll=print_r($row, true);
                        $this->log->logDebug("Row: ".$ll);
                        $specialitati[]=$row;
                        
                        
                        
                    break;
                    case "6":
                        $q='select mem_asig.tip, mem_cpp.id_cpp, reg_cpp.nume_cpp, reg_tip_avizare.nume_tip_avizare
                        from mem_asig inner join mem_cpp on mem_cpp.id_cpp=mem_asig.id_cpp
                            inner join reg_cpp on reg_cpp.id_cpp=mem_cpp.reg_cpp_id
                            inner join reg_tip_avizare on reg_tip_avizare.id_tip_avizare = mem_asig.tip
                        where mem_asig.id_asig = "'.$rezultat['id_asig'].'"';
                        try{
                            $state = $this->db->query($q);
                        } 
                        catch(Exception $e){
                            $this->log->LogError("DB ERROR: ".$e->getMessage());
                            $data = array('result' => '01' , 'mesaj' => $e->getMessage());
                            return ($data);
                        }
                        $row = $state->fetch();
                        $ll=print_r($row, true);
                        $this->log->logDebug("Row: ".$ll);
                        $specialitati[]=$row;
                    
                    
                    break;
                        
                }
            }
            $grup[]=array('grup' => $rw['nume_cpp_grup'], 'data' => $specialitati);

        }
        $ll=print_r($grup, true);
        $this->log->logDebug("Row: ".$ll);
        return $grup;
    
    }
    
    
     /*************
      *
      * Functia de autentificare
      * primeste: email si parola
      * returneaza: nume utilizator respectiv cmj-ul utilizatorului in caz de succes
      *             eroare in caz de eroare
      * 
      */
     
    protected function auth(){
        
        $user = $this->payload['email'];
        $pass = $this->payload['password'];
        $stmt=$this->db->prepare("select user.id, user.nume, user.cmj, reg_jud.cod_cmj as judet from user inner join reg_jud on user.cmj=reg_jud.id_cmj where user.email=? and user.parola=?");
        try{
            $stmt->execute(array($user, $pass));
        }
        catch (PDOException $e)
        {    
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $data = array ('result' => '01' , 'mesaj' => $e->getMessage());
            return $data;
        }
        if ($stmt->rowCount() == 0)
        {
            $this->log->LogDebug("Autentificare esuata.");
            $data = array ('result' => '10' , 'mesaj' => 'Autentificare esuata');
            return $data;
        }
        else
        {
            $row = $stmt->fetch();
            $this->log->LogDebug("Autentificare reusita.");
            try {
                $stmt=$this->db->query("delete from token where user='".$user."'");
            }
            catch (PDOException $e)
            {
                $this->log->LogError("DB ERROR: ".$e->getMessage());
                $data = array ('result' => '01' , 'mesaj' => $e->getMessage());
                return $data;
            }
            try{
                $dt=date("H:i:s");
                $tt=$user.$dt;
                $token=md5($tt);
                $stmt=$this->db->query("insert into token (token,user) values ('".$token."','".$user."')");
            }
            catch (PDOException $e)
            {
                $this->log->LogError("DB ERROR: ".$e->getMessage());
                $data = array ('result' => '01' , 'mesaj' => $e->getMessage());
                return $data;
            }
            $data = array ('result' => '00' , 'mesaj' => 'Autentificare reusita', 'token' => $token, 'nume' => $row['nume'], 'cmj' => $row['cmj'], 'judet' => $row['judet'] );
            return $data;
        }
     }
     /*************
      *
      * Functii GET pentru citirea datelor publice (judete, specialitati medicale, etc)
      *
      */
    protected function asig_nume(){
        $ll = print_r($this->payload, true);
        $this->log->logDebug("Payload: ".$ll);
        $id = $this->payload['id'];
        try{
        $stmt = $this->db->query("select nume_asigurator as nume from reg_asigurator where id_asigurator = '".$id."'");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $data = array ('result' => '00' , 'mesaj' => 'Query OK', 'nume' => $row['nume']);
        $ll = print_r($data, true);
        $this->log->logDebug("Payload: ".$ll);
        return ($data);
     }
     
     
    protected function act_cpp(){
        try{
        $stmt = $this->db->query("select id_act_cpp as id, nume_act_cpp as nume from reg_act_cpp");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }
    
    protected function act_id(){
        try{
        $stmt = $this->db->query("select id_actid as id, nume_act_id as nume from reg_act_id");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }

    protected function adresa(){
        try{
        $stmt = $this->db->query("select id_adresa as id, nume_adresa as nume from reg_adresa");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }
    
    protected function asigurator(){
        try{
        $stmt = $this->db->query("select id_asigurator as id, nume_asigurator as nume from reg_asigurator");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }
    
    protected function certificat(){
        try{
        $stmt = $this->db->query("select id_tip_certificat as id, nume_tip_certificat as nume from reg_certificat");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }
    
    protected function cotizatie(){
        try{
        $stmt = $this->db->query("select id_tip_cotizatie as id, nume_tip_cotizatie as nume from reg_cotizatie");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }
    
    protected function tip_cpp(){
        try{
        $stmt = $this->db->query("select id_tip_cpp as id, nume_tip_cpp as nume from reg_tip_cpp");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }
    
    protected function cpp(){
        try{
        $stmt = $this->db->query("select id_cpp as id, grp_cpp, nume_cpp as nume, id_tip_cpp as tip from reg_cpp");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC))
        {
            //$spec = ['id' => $row['id'], 'nume' => $row['nume'],'tip' => $row['tip'],];
            $lista[] =$row;
        }
        return $lista;
    }
    protected function facultate(){
        try{
        $stmt = $this->db->query("select id_facultate as id, nume_facultate as nume from reg_facultate");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }    
    
    protected function titluri(){
        try{
        $stmt = $this->db->query("select id_titlu as id, nume as nume, tip as tip from reg_titluri");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'tip' => $row['tip'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }
    
    protected function gr_prof(){
        try{
        $stmt = $this->db->query("select id_gr_prof as id, nume_gr_prof as nume from reg_gr_prof");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }    

    protected function jud(){
        //$this->log->logDebug("Listare judete");
        if (isset($this->payload['jud_id']))
            $query = "select id_cmj as id, nume_cmj as nume from reg_jud where id_cmj = '".$this->payload['jud_id']."'";
        else
            $query = "select id_cmj as id, nume_cmj as nume from reg_jud";
        
        try{
            $stmt = $this->db->query($query);
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }
    
    protected function loc_munca(){
        try{
        $stmt = $this->db->query("select id_loc_munca as id, denumire as nume from reg_loc_munca");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }
    
    protected function sanctiune(){
        try{
        $stmt = $this->db->query("select id_sanctiune as id, nume_sanctiune as nume from reg_sanctiune");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }
    
    protected function status(){
        try{
        $stmt = $this->db->query("select id_status as id, nume_status as nume from reg_status");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }
    
    protected function tara(){
        try{
        $stmt = $this->db->query("select id_tara as id, nume_tara as nume from reg_tara");
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }
    
    protected function titlu(){
        $this->log->logDebug("Listare titluri");
        if (isset($this->payload['titlu_id']))
            $query = "select id_titlu as id, tip, nume from reg_titluri where id_titlu = '".$this->payload['titlu_id']."'";
        else
            $query = "select id_titlu as id, tip, nume from reg_titluri";
        
        
        try{
        $stmt = $this->db->query($query);
        }
        catch (PDOException $e)
        {
            $this->log->LogError("DB ERROR: ".$e->getMessage());
            $result=array('result' => '01' , 'mesaj' => $e->getMessage());
            return($result);
        }
        $lista=array();
        while($row = $stmt->fetch())
        {
            $spec = ['id' => $row['id'], 'nume' => $row['nume'],];
            $lista[] =$spec;
        }
        return $lista;
    }
    
 }
?>
