<?php

include('config.php');
include('functions.php');


$id=$_REQUEST['id'];
$token = $_REQUEST['token'];
$actiune = $_REQUEST['actiune'];

 $data=[
			'token' => $token,
            'actiune' => 'certificat',
			'id'    => $id,
		];

		//echo "<pre>";
		//print_r($data);
		//echo "</pre>";
		$url=$url_host."/get";
		$data_json = json_encode($data);
		$rez = call_api($url, $data_json);
  //echo "<pre>";
		//print_r($rez);
		//echo "</pre>";

  $rezultat=json_decode($rez['continut'],true);
  //echo "<pre>";
		//print_r($rezultat);
		//echo "</pre>";
		$numar_cert = $id;
  $data_cert = $rez['data_start'];
  $id_mem = $rez['id_mem'];
// Include the main TCPDF library (search for installation path).
require_once('tcpdf/tcpdf.php');
date_default_timezone_set('Europe/Bucharest');

// Extend the TCPDF class to create custom Header and Footer
class MYPDFA1 extends TCPDF {
    //Page header
    public function Header() {
        // get the current page break margin
        $bMargin = $this->getBreakMargin();
        // get current auto-page-break mode
        $auto_page_break = $this->AutoPageBreak;
        // disable auto-page-break
        $this->SetAutoPageBreak(false, 0);
        // set bacground image
        $img_file = 'img/tipA_pag1.png';
        $this->Image($img_file, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);
        // restore auto-page-break status
        $this->SetAutoPageBreak($auto_page_break, $bMargin);
        // set the starting point for the page content
        $this->setPageMark();
    }
}

class MYPDFA2 extends TCPDF {
    //Page header
    public function Header() {
        // get the current page break margin
        $bMargin = $this->getBreakMargin();
        // get current auto-page-break mode
        $auto_page_break = $this->AutoPageBreak;
        // disable auto-page-break
        $this->SetAutoPageBreak(false, 0);
        // set bacground image
        $img_file = 'img/tipA_pag2.png';
		$this->Image($img_file, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);
        // restore auto-page-break status
        $this->SetAutoPageBreak($auto_page_break, $bMargin);
        // set the starting point for the page content
        $this->setPageMark();
    }
}

class MYPDFB1 extends TCPDF {
    //Page header
    public function Header() {
        // get the current page break margin
        $bMargin = $this->getBreakMargin();
        // get current auto-page-break mode
        $auto_page_break = $this->AutoPageBreak;
        // disable auto-page-break
        $this->SetAutoPageBreak(false, 0);
        // set bacground image
        $img_file = 'img/tipB_pag1.png';
		$this->Image($img_file, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);
        // restore auto-page-break status
        $this->SetAutoPageBreak($auto_page_break, $bMargin);
        // set the starting point for the page content
        $this->setPageMark();
    }
}
class MYPDFB2 extends TCPDF {
    //Page header
    public function Header() {
        // get the current page break margin
        $bMargin = $this->getBreakMargin();
        // get current auto-page-break mode
        $auto_page_break = $this->AutoPageBreak;
        // disable auto-page-break
        $this->SetAutoPageBreak(false, 0);
        // set bacground image
        $img_file = 'img/tipB_pag2.png';
		$this->Image($img_file, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);
        // restore auto-page-break status
        $this->SetAutoPageBreak($auto_page_break, $bMargin);
        // set the starting point for the page content
        $this->setPageMark();
    }
}
class MYPDFC1 extends TCPDF {
    //Page header
    public function Header() {
        // get the current page break margin
        $bMargin = $this->getBreakMargin();
        // get current auto-page-break mode
        $auto_page_break = $this->AutoPageBreak;
        // disable auto-page-break
        $this->SetAutoPageBreak(false, 0);
        // set bacground image
        $img_file = 'img/tipC_pag1.png';
		$this->Image($img_file, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);
        // restore auto-page-break status
        $this->SetAutoPageBreak($auto_page_break, $bMargin);
        // set the starting point for the page content
        $this->setPageMark();
    }
}
class MYPDFC2 extends TCPDF {
    //Page header
    public function Header() {
        // get the current page break margin
        $bMargin = $this->getBreakMargin();
        // get current auto-page-break mode
        $auto_page_break = $this->AutoPageBreak;
        // disable auto-page-break
        $this->SetAutoPageBreak(false, 0);
        // set bacground image
        $img_file = 'img/tipC_pag2.png';
		$this->Image($img_file, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);
        // restore auto-page-break status
        $this->SetAutoPageBreak($auto_page_break, $bMargin);
        // set the starting point for the page content
        $this->setPageMark();
    }
}


// create new PDF document
if ($actiune == "fata")
{
	switch($rezultat['tip_cert'])
	{
		case "A":
			$pdf = new MYPDFA1(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
			$tip = '1';
		break;
		case "B":
			$pdf = new MYPDFB1(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
			$tip = '2';
		break;
		case "C":
			$pdf = new MYPDFC1(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
			$tip = '3';
		break;
	}
	$acum = date("Y-m-d");
	$data = [
		'token' => $token,
		'id_mem' => $id,
		'actiune' => 'certificat',
		'data' => [
			'id_mem' => $id,
			'nr' => '0',
			'data_start' => $acum,
			//'data_invalidare' => '0000-00-00',
			'reg_cert_id' => $tip,
			'qr_code' => '',
			],
	];
	//$url=$url_host."/adauga";
	//$data_json = json_encode($data);
	//$reznr = call_api($url, $data_json);
	//echo "<pre>";
	//print_r($reznr);
	//echo "</pre>";
	//$numar_cert = $reznr['nr'];
	//$data_cert = timex($reznr['data']);
}
else
	{
		switch($rezultat['tip_cert'])
		{
			case "A":
				$pdf = new MYPDFA2(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
			break;
			case "B":
				$pdf = new MYPDFB2(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
			break;
			case "C":
				$pdf = new MYPDFC2(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
			break;
		}
		$numar_cert = 'xx';
	}
// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('CMR');
$pdf->SetTitle('Certificat membru nr. '.$id);
//$pdf->SetKeywords('TCPDF, PDF, example, test, guide');

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(0);
$pdf->SetFooterMargin(0);

// remove default footer
$pdf->setPrintFooter(false);

// set auto page breaks
//$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

$pdf->SetAutoPageBreak(false, 0);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

//$pdf->setPageMark();

$data_juramant = timex($rezultat['data_juramant']);

// set some language-dependent strings (optional)
if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
    require_once(dirname(__FILE__).'/lang/eng.php');
    $pdf->setLanguageArray($l);
}

// ---------------------------------------------------------

if ($actiune == "fata")
{
		$pdf->SetFont('times', '', 48);
		$pdf->AddPage();
		$pdf->SetFont('freeserif', '', 16);
		$pdf->SetTextColor(0,0,0);
		$pdf->SetXY(116, 36);
		$pdf->Cell(30, 0, $rezultat['judet'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
		$pdf->SetXY(62, 68);
		$pdf->Cell(30, 0, $numar_cert , 0, 1, 'L', 0, '', 0, false, 'B', 'B');
		$now = date("d/m/Y");
		$pdf->SetXY(122, 68);
		$pdf->Cell(30, 0, $data_cert, 0, 1, 'L', 0, '', 0, false, 'B', 'B');
		$pdf->SetFont('freeserif', '', 16);
		$pdf->SetXY(12, 89);
		$pdf->Cell(30, 0, $rezultat['nume'], 0,1 ,'L' ,0 ,'' ,0 ,false ,'B' ,'B');
		$pdf->SetXY(33, 101);
		$pdf->Cell(30, 0, $rezultat['cnp'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
		$pdf->SetFont('freeserif', '', 12);
		$pdf->SetXY(161, 100);
		$pdf->Cell(30, 0, $rezultat['cuim'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
		switch($rezultat['tip_cert'])
		{
		case "A":
				$pdf->SetFont('freeserif', '', 12);
				$pdf->SetXY(11, 121);
				$pdf->Cell(0, 0, $rezultat['facultate'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
				$pdf->SetFont('freeserif', '', 16);
				$pdf->SetXY(170, 121);
				$pdf->Cell(20, 0, $rezultat['promotie'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
				$serie = $rezultat['dipl_serie']. " " .$rezultat['dipl_nr'];
				$pdf->SetFont('freeserif', '', 16);
				$pdf->SetXY(16, 138);
				$pdf->Cell(20, 0, $serie, 0, 1, 'L', 0, '', 0, false, 'B', 'B');
				$x = 158;
				foreach ($rezultat['specialitati'] as $spec){
				 $pdf->SetFont('freeserif', '', 12);
				 $pdf->SetXY(13, $x);
				 $pdf->Cell(20, 0, $spec['specialitate'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
				 $pdf->SetXY(165, $x);
				 $pdf->Cell(20, 0, $spec['gr_prof'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
				 $x+=9;
				}
				$comple = "";
				foreach($rezultat['superspecialitate'] as $spec){
						$comple .= $spec['specialitate']. "; ";
				}
				$pdf->SetFont('freeserif', '', 10);

				$lg = strlen($comple);
				if ($lg > 90)
				{
					$s = substr($comple, 0, 91);
					$result = substr($s, 0, strrpos($s, ' '));
					$c1 = strlen($result);
					$rw1 = substr($comple,0,$c1);
					$rest = substr($comple,$c1,$lg);
					$pdf->SetFillColor(255, 255, 255);
					$pdf->SetXY(12, 200);
					$pdf->Multicell(180, 0, $rw1,  0, 'L', 1, 0, '', '', true);
					$lg2 = strlen($rest);
					if ($lg2 > 80)
					{
						$s = substr($rest, 0, 81);
						$result = substr($s, 0, strrpos($s, ' '));
						$c2 = strlen($result);
						$rw2 = substr($rest,0,$c2);
						$rest2 = substr($rest,$c2,$lg2);
						$pdf->SetFillColor(255, 255, 255);
						$pdf->SetXY(12, 209);
						$pdf->Multicell(180, 0, $rw2,  0, 'L', 1, 0, '', '', true);
						$lg3 = strlen($rest2);
						if ($lg3 > 80)
						{
							$s = substr($rest2, 0, 81);
							$result = substr($s, 0, strrpos($s, ';'));
							$c3 = strlen($result);
							$rw3 = substr($rest2,0,$c3);
							$pdf->SetFillColor(255, 255, 255);
							$pdf->SetXY(12, 218);
							$pdf->Multicell(180, 0, $rw3,  0, 'L', 1, 0, '', '', true);
						}
						else
						{
							$pdf->SetFillColor(255, 255, 255);
							$pdf->SetXY(12, 218);
							$pdf->Multicell(180, 0, $rest2,  0, 'L', 1, 0, '', '', true);
						}

					}
					else
					{
						$pdf->SetFillColor(255, 255, 255);
						$pdf->SetXY(12, 209);
						$pdf->Multicell(180, 0, $rest,  0, 'L', 1, 0, '', '', true);
					}

				}
				else
				{
					$pdf->SetFillColor(255, 255, 255);
					$pdf->SetXY(12, 200);
					$pdf->Multicell(180, 0, $comple,  0, 'L', 1, 0, '', '', true);
				}
				$pdf->SetFont('freeserif', '', 10);
				$pdf->SetXY(70, 271);
				$pdf->Cell(0, 0, $data_juramant, 0, 1, 'L', 0, '', 0, false, 'B', 'B');
		break;
		case "B";
				$pdf->SetFont('freeserif', '', 12);
				$pdf->SetXY(11, 123);
				$pdf->Cell(0, 0, $rezultat['facultate'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
				$pdf->SetFont('freeserif', '', 16);
				$pdf->SetXY(170, 123);
				$pdf->Cell(20, 0, $rezultat['promotie'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
				$serie = $rezultat['dipl_serie']. " " .$rezultat['dipl_nr'];
				$pdf->SetFont('freeserif', '', 16);
				$pdf->SetXY(16, 145);
				$pdf->Cell(20, 0, $serie, 0, 1, 'L', 0, '', 0, false, 'B', 'B');
				$pdf->SetFont('freeserif', '', 14);
				$spec = $rezultat['specialitati'][0];
				if ((isset($spec['data_end'])) && ($spec['data_end'] == "0000-00-00"))
				{
					$pdf->SetXY(13, 173);
					$pdf->Cell(20, 0, 'x', 0, 1, 'L', 0, '', 0, false, 'B', 'B');
					$pdf->SetXY(14, 182);
					$pdf->Cell(20, 0, $spec['specialitate'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
				}
				elseif (isset($spec['data_end']))
				{
					$pdf->SetXY(13, 194);
					$pdf->Cell(20, 0, 'x', 0, 1, 'L', 0, '', 0, false, 'B', 'B');
					$pdf->SetXY(14, 205);
					$pdf->Cell(20, 0, $spec['specialitate'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
				}
				else
				{
					$pdf->SetXY(13, 156);
					$pdf->Cell(20, 0, 'x', 0, 1, 'L', 0, '', 0, false, 'B', 'B');
					$pdf->SetXY(14, 163);
					$pdf->Cell(20, 0, $spec['specialitate'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
				}
				$pdf->SetFont('freeserif', '', 10);
				$pdf->SetXY(90, 278);
				$pdf->Cell(20, 0, $data_juramant, 0, 1, 'L', 0, '', 0, false, 'B', 'B');
		break;
		case "C";
				$pdf->SetFont('freeserif', '', 12);
				$pdf->SetXY(11, 121);
				$pdf->Cell(0, 0, $rezultat['facultate'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
				$pdf->SetFont('freeserif', '', 16);
				$pdf->SetXY(170, 121);
				$pdf->Cell(20, 0, $rezultat['promotie'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
				$serie = $rezultat['dipl_serie']. " " .$rezultat['dipl_nr'];
				$pdf->SetFont('freeserif', '', 16);
				$pdf->SetXY(16, 138);
				$pdf->Cell(20, 0, $serie, 0, 1, 'L', 0, '', 0, false, 'B', 'B');

				$pdf->SetFont('freeserif', '', 10);
				$pdf->SetXY(70, 276);
				$pdf->Cell(20, 0, $data_juramant, 0, 1, 'L', 0, '', 0, false, 'B', 'B');
				$x = 158;
				if ($rezultat['specialitati']!="")
				{
					foreach ($rezultat['specialitati'] as $spec){
					$pdf->SetFont('freeserif', '', 12);
					$pdf->SetXY(13, $x);
					$pdf->Cell(20, 0, $spec['specialitate'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
					$pdf->SetXY(140, $x);
					$pdf->Cell(20, 0, $spec['gr_prof'], 0, 1, 'L', 0, '', 0, false, 'B', 'B');
					$x+=9;
					//echo $spec['specialitate']. "  " . $spec['gr_prof'];
					}
				}
				$comple = "";
				if ($rezultat['superspecialitate']!=""){
					foreach($rezultat['superspecialitate'] as $spec){
							$comple .= $spec['specialitate'].";  ";
					}
				}
				$pdf->SetFont('freeserif', '', 10);

				$lg = strlen($comple);
				if ($lg > 80)
				{
					$s = substr($comple, 0, 81);
					$result = substr($s, 0, strrpos($s, ' '));
					$c1 = strlen($result);
					$rw1 = substr($comple,0,$c1);
					$rest = substr($comple,$c1,$lg);
					$pdf->SetFillColor(255, 255, 255);
					$pdf->SetXY(16, 200);
					$pdf->Multicell(180, 0, $rw1,  0, 'L', 1, 0, '', '', true);
					$lg2 = strlen($rest);
					if ($lg2 > 80)
					{
						$s = substr($rest, 0, 81);
						$result = substr($s, 0, strrpos($s, ' '));
						$c2 = strlen($result);
						$rw2 = substr($rest,0,$c2);
						$rest2 = substr($rest,$c2,$lg2);
						$pdf->SetFillColor(255, 255, 255);
						$pdf->SetXY(16, 209);
						$pdf->Multicell(180, 0, $rw2,  0, 'L', 1, 0, '', '', true);
						$lg3 = strlen($rest2);
						if ($lg3 > 80)
						{
							$s = substr($rest2, 0, 81);
							$result = substr($s, 0, strrpos($s, ';'));
							$c3 = strlen($result);
							$rw3 = substr($rest2,0,$c3);
							$pdf->SetFillColor(255, 255, 255);
							$pdf->SetXY(16, 218);
							$pdf->Multicell(180, 0, $rw3,  0, 'L', 1, 0, '', '', true);
						}
						else
						{
							$pdf->SetFillColor(255, 255, 255);
							$pdf->SetXY(16, 218);
							$pdf->Multicell(180, 0, $rest2,  0, 'L', 1, 0, '', '', true);
						}

					}
					else
					{
						$pdf->SetFillColor(255, 255, 255);
						$pdf->SetXY(16, 209);
						$pdf->Multicell(180, 0, $rest,  0, 'L', 1, 0, '', '', true);
					}

				}
				else
				{
					$pdf->SetFillColor(255, 255, 255);
					$pdf->SetXY(16, 200);
					$pdf->Multicell(180, 0, $comple,  0, 'L', 1, 0, '', '', true);
				}

		break;
		}
}
else {
	$data=[
			'token'		=> $token,
			'actiune'	=> 'dlp',
			'id'    	=> $id_mem,
		];
		$url=$url_host."/lista";
		$data_json = json_encode($data);
	 $rezultat = call_api($url,$data_json);
		//echo "<pre>";
		//print_r($rezultat);
		//echo "</pre>";

		$pdf->SetCreator(PDF_CREATOR);
		$pdf->SetAuthor('CMR');
		$pdf->SetTitle('Certificat membru nr. '.$id);
		$pdf->SetKeywords('TCPDF, PDF, example, test, guide');
		$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
		$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
		$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
		$pdf->SetHeaderMargin(0);
		$pdf->SetFooterMargin(0);
		$pdf->setPrintFooter(false);
		$pdf->SetAutoPageBreak(false, 0);
		$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
		$pdf->SetTextColor(0,0,0);
		$pdf->SetFont('times', '', 48);
		$pdf->AddPage();
		$pdf->SetFont('freeserif', '', 16);
		$y = 0;
  $dy = 27;
		foreach ($rezultat as $dlp)
		{
   $data = [
    'token'		=> $token,
    'actiune'	=> 'asigurare',
    'id'    	=> $id_mem,
    'dlp'    => $dlp['id_dlp'],
   ];
   $url = $url_host."/lista";
		 $data_json = json_encode($data);
	  $rez = call_api($url,$data_json);
   //echo "<pre>";
		 //print_r($rez);
		 //echo "</pre>";
   foreach ($rez as $asigurare)
   {
      $url = $url_host."/asig_nume";
      //echo "<pre>";
      //print_r($asigurare);
      //echo "</pre>";
      //echo $asigurare['id_asigurator'];
      $data = [ 'id' => $asigurare['id_asigurator'],];
      $data_json = json_encode($data);
      $asi = call_api($url,$data_json);
      //echo "<pre>";
      //print_r($asi);
      //echo "</pre>";
      $zy = $dy + $y;
      $pdf->SetFont('freeserif', '', 9);
      $pdf->SetXY(24, $zy);

      $pdf->SetFillColor(255, 255, 255);
      $pdf->MultiCell(68, 5, $asi['nume'], 0, 'L', 1, 0, '', '', true);

      $pdf->SetXY(93, $zy+4);
      $polita = $asigurare['polita_serie'] . "  " . $asigurare['polita_nr'];
      $pdf->Cell(20, 0, $polita, 0, 1, 'L', 0, '', 0, false, 'B', 'B');

      $pdf->SetFont('freeserif', '', 9);
      $perioada = timex($asigurare['data_start']). " - " . timex($asigurare['data_end']);
      $pdf->SetXY(136, $zy+4);
      $pdf->Cell(20, 0, $perioada, 0, 1, 'L', 0, '', 0, false, 'B', 'B');
      $y += 9;

   }
			$dy += 31;
		}

}

$nume_pdf = 'cert_medic_nr_'.$numar_cert.'.pdf';
$pdf->Output($nume_pdf, 'I');

//============================================================+
// END OF FILE
//============================================================+
