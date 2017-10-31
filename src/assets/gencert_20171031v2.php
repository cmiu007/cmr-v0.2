<?php

$id = $_REQUEST['id'];
$cert = $_REQUEST['cert'];
$url_base = "https://devel-api.cmr.ro/api/";
$token = "bcf8c11367426e5e9330358abeee8bf4";
$acum = date("d.m.Y");

function call_api($url, $data_json)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json','Content-Length: ' . strlen($data_json)));
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
	curl_setopt($ch, CURLOPT_POSTFIELDS,$data_json);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response  = curl_exec($ch);
	//print_r($response);
	$rezultat = json_decode($response,true);
	curl_close($ch);
	return $rezultat; 
}

function datex($data)
{
	$s = explode('-',$data);
	$retur = $s[2].'.'.$s[1].'.'.$s[0];
	return $retur;
}

$data = [	'token' => 	$token,
	'id' =>	$id,
	'actiune' => 'date_personale',
];
$url = $url_base."get";
$data_json = json_encode($data);
$medic = call_api($url, $data_json);

$numeMedic = $medic['nume']. ' ' . $medic['prenume'];
$CUIM = $medic['cuim'];

$data = [	'token' => 	$token,
	'id' =>	$cert,
	'actiune' => 'certificat',
];
$url = $url_base."get";
$data_json = json_encode($data);
$certificat = call_api($url, $data_json);

$NR_CERT = $certificat['id_certificat'];
$DATA_CERT = datex($certificat['data_start']);

$data = [
         'jud_id' => $medic['jud_id'],
];

$data_json = json_encode($data);
$url = $url_base."jud";
$rezultat = call_api($url, $data_json);
$CMJ = $rezultat[0]['nume'];


$date_cert = json_decode($certificat['continut'], true);

$data = [	'token' => 	$token,
			'id' =>	$medic['jud_id'],
			'actiune' => 'cmj',
];
$url = $url_base."get";
$data_json = json_encode($data);
$cmj = call_api($url, $data_json);

/*echo "<pre>";
print_r($date_cert);
echo "</pre>";
*/
require_once('tcpdf/tcpdf.php');
date_default_timezone_set('Europe/Bucharest');

// creat a new pdf document
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
$pdf->SetProtection(array('modify', 'copy', 'extract', 'fill-forms', 'annot-forms', 'extract'), '', null, 1, null);

// set document information

$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Colegiul Medicilor din România');
$pdf->SetTitle('Aviz anual privind exercitarea profesiei de medic');
$pdf->SetSubject('Avizare pentru: '.$numeMedic); // TODO: de inlocuit cu Numele si CUIM
$pdf->SetKeywords('Lista specialitati si statusul avizarii'); // TODO:


// no header and footer
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);

// set auto page breaks
$pdf->SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// set some language-dependent strings (optional)
if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
    require_once(dirname(__FILE__).'/lang/eng.php');
    $pdf->setLanguageArray($l);
}

// ---------------------------------------------------------

$timesNew = TCPDF_FONTS::addTTFfont('tcpdf/fonts/times.ttf', 'TrueTypeUnicode', '', 32);
// set font
//$pdf->SetFont('times', '', 10);
$pdf->SetFont('freeserif', '', 10);
// deseneaza chenar
$pdf->SetAutoPageBreak(false);
$pdf->AddPage();

$fill = 0;
$origin = 7;
$pageWidth = 210;
$pageHeight = 297;
$innerLine = $origin + 1;
$imgOrigin = $innerLine + 2;
$timbruXOrigin =  175;
$timbruYOrigin = 20;
$titleXOrigin = $imgOrigin + 38;
$titleYOrigin = $imgOrigin;
$title2YOrigin = $titleYOrigin + 7 ;
$title3YOrigin = $title2YOrigin + 24 ;
$titularYOrigin = $title3YOrigin + 29;
$prezentaYOrigin = $titularYOrigin + 18 ;
$box1YOrigin = $prezentaYOrigin + 14;
$box2YOrigin = $box1YOrigin + 25;
$box3YOrigin = $box2YOrigin + 37;
$box4YOrigin = $box3YOrigin + 25;
$notaYOrigin = $box4YOrigin + 32;
$presedinteYOrigin = $notaYOrigin + 32;
$lsYOrigin = $presedinteYOrigin + 10;
$lsXOrigin = 170;



// Border
$style1 = array('width' => 0.5, 'cap' => 'round', 'join' => 'miter', 'dash' => 0, 'color' => array(50, 50, 127));
$style2 = array('width' => 1, 'cap' => 'round', 'join' => 'miter', 'dash' => 0, 'color' => array(50, 50, 127));
$pdf->Rect($origin, $origin, ($pageWidth - 2 * $origin), ($pageHeight - 2 * $origin), 'D', array('all' => $style1));
$pdf->Rect($innerLine, $innerLine, ($pageWidth - 2 * $innerLine), ($pageHeight - 2 * $innerLine), 'D', array('all' => $style2));

// Image method signature:
// Image($file, $x='', $y='', $w=0, $h=0, $type='', $link='', $align='', $resize=false, $dpi=300, $palign='', $ismask=false, $imgmask=false, $border=0, $fitbox=false, $hidden=false, $fitonpage=false)
$pdf->setJPEGQuality(100);
$pdf->Image('img/sigla_cmr.jpg', $imgOrigin, $imgOrigin + 2, 27, 21, 'JPEG', '', '', false, 300, '', false, false, 0, false, false, false);

$pdf->SetFillColor(255, 255, 127);
// MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0)
// $pdf->MultiCell($pageWidth - $titleXOrigin - $origin - 1.5, 38, $title, 0, 'C', 1, 1, $titleXOrigin, $titleYOrigin, true);

// writeHTML($html, $ln=true, $fill=false, $reseth=false, $cell=false, $align='')
// writeHTMLCell($w, $h, $x, $y, $html='', $border=0, $ln=0, $fill=0, $reseth=true, $align='', $autopadding=true)

$pdf->SetFont('freeserif', '', 8);
$timbru = '
<i>Timbru Sec</i>
';
$pdf->WriteHTMLCell(20, 10, $timbruXOrigin, $timbruYOrigin, $timbru, 0, 0, $fill, true, 'C', true);

$pdf->SetFont('freeserif', '', 10);

$titlu1HTML = '
<h3 style="letter-spacing:4px">COLEGIUL&nbsp; &nbsp;MEDICILOR&nbsp; &nbsp;DIN&nbsp; &nbsp;ROMÂNIA</h3>
';
$titlu2HTML = '
<span style="letter-spacing:2px"> Colegiul Medicilor <b>'.$CMJ.'</b></span>
';
$titlu3HTML = '
<h1 style="letter-spacing:3px;"><i>C E R T I F I C A T&nbsp; &nbsp;D E&nbsp; &nbsp;M E M B R U</i></h1>
nr. <b>'.$NR_CERT.'</b> din data de <b>'.$DATA_CERT.'</b>
';

$pdf->WriteHTMLCell($pageWidth - $imgOrigin - 1.5 - $origin, 38, $imgOrigin, $titleYOrigin, $titlu1HTML, 0, 0, $fill, true, 'C', true);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - 1.5 - $origin, 38, $imgOrigin, $title2YOrigin, $titlu2HTML, 0, 0, $fill, true, 'C', true);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - 1.5 - $origin, 38, $imgOrigin, $title3YOrigin, $titlu3HTML, 0, 0, $fill, true, 'C', true);

$pdf->SetFont('freeserif', '', 12);
$titularHTML = '
<p>
Titular: <b>'.$numeMedic.'</b>
</p>
<p>
Titluri deținute: <b>Profesor Doctor, Cercetator gradul III</b> 
</p>
<p>
C.N.P./data nașterii: <b>'.$medic['cnp'].'</b> Cod unic de identificare (C.U.I.M): <b>'.$medic['cuim'].'</b>
</p>
<p>
Formarea medicală de bază:  promoția <b>'.$medic['fac_promotie'].'</b>, atestată prin titlul de calificare  seria/nr. <b>'.$date_cert['dipl_serie'].' / '.$date_cert['dipl_nr'].'</b>
eliberat de <b>'.$date_cert['facultate'].'</b>.
<br>
recunoscut <i>(dacă este cazul)</i> prin certificatul de recunoaștere cu seria/nr. <b>PP / 88377392</b> din <b>21/10/2020</b>
</p>

';

$pdf->SetFillColor(127, 127, 127);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - 1.5 - $origin * 2, 19, $origin + 5, $titularYOrigin, $titularHTML, 0, 0, $fill, true, 'L', true);

// ---------------------------

$specialitate = '
<style type="text/css">
.tg  {cellpadding:2;}
.tg td{padding:10px 5px;}
.tg th{font-weight:normal;padding:10px 5px}
.tg .tg-yzt1{vertical-align:middle;border-bottom:1pt solid black;background-color:#efefef;}
.tg .tg-yw4l{vertical-align:middle;border-bottom:1pt solid black;background-color:#efefef;}
.tg .tg-b7b8{background-color:#f9f9f9;vertical-align:top}
.tg .tg-spec{width:80%}
.tg .tg-grad{width:20%}
</style>
<div class="tg-wrap"><table class="tg">
  <tr>
    <th class="tg-yzt1 tg-spec" style="bgcolor:#d3d3d3">Specialități:</th>
    <th class="tg-yw4l tg-grad">Grad profesional:</th>
  </tr>';
  $i=0;
  foreach($date_cert['specialitati'] as $spec)
  {
	if ($i%2 ==0 )
		$specialitate .= '
		<tr>
		  <td class="tg-b7b8 tg-spec">'.$spec['specialitate'].'</td>
		  <td class="tg-b7b8 tg-grad">'.$spec['gr_prof'].'</td>
		</tr>';
	else
		$specialitate .= '
		<tr>
		  <td class="tg-yw4zl tg-spec">'.$spec['specialitate'].'</td>
		  <td class="tg-yw4l tg-grad">'.$spec['gr_prof'].'</td>
		</tr>';
	$i++;
  }
  
  $specialitate .= '</table></div>';
  
 // echo $specialitate;

$pdf->SetFillColor(0, 127, 127);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin - 10, 19, $origin + 5, $box2YOrigin, $specialitate, 0, 0, $fill, true, 'L', true);

$super ="";
foreach($date_cert['superspecialitate'] as $spec)
{
	$super .= $spec['specialitate'].'; ';
}

$competente = '
<style type="text/css">
.tg td{padding:10px 5px;}
.tg th{font-weight:normal;padding:10px 5px;}
.tg .tg-yzt1{background-color:#efefef;vertical-align:middle;border-bottom:1pt solid black;}
.tg .tg-yw4l{vertical-align:middle}
.tg .tg-b7b8{vertical-align:middle;}
.tg .tg-spec{width:100%}
@media screen and (max-width: 767px) {.tg {width: auto !important;}.tg col {width: auto !important;}.tg-wrap {overflow-x: auto;-webkit-overflow-scrolling: touch;}}</style>
<div class="tg-wrap"><table class="tg">
  <tr>
    <th class="tg-yzt1 tg-spec">Studii Complementare:</th>
  </tr>
  <tr>
    <td class="tg-b7b8 tg-spec">'.$super.'</td>
  </tr>
</table></div>
';
$pdf->SetFillColor(0, 127, 127);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin - 10, 19, $origin + 5, $box3YOrigin, $competente, 0, 0, $fill, true, 'L', true);

//----------------------------
$dj = datex($date_cert['data_juramant']);
// $pdf->SetFont('freeserif', '', 8);
$footer1 = '
Data depunerii jurământului: <b>'.$dj.'</b>
';
$pdf->SetFillColor(255, 255, 0);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin, 19, $origin + 1.5, $notaYOrigin, $footer1, 0, 0, $fill, true, 'J', true);

$pdf->SetFont('freeserif', '', 10);
$footer2 = '
<h2>Președinte,</h2>
<h2>'.$cmj['presedinte'].'</h2>
<p>
…………………………………………………………
</p>
Notă: Avizul anual constituie o componentă a certificatului de membru, care trebuie să însoțească pagina principală a acestuia.
';
$pdf->SetFillColor(255, 255, 0);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin, 19, $origin + 1.5, $presedinteYOrigin, $footer2, 0, 0, $fill, true, 'C', true);

$ls = '
L.S.
';
// $pdf->WriteHTMLCell(20, 10, $lsXOrigin , $lsYOrigin, $ls, 0, 0, $fill, true, 'C', true);
$pdf->WriteHTMLCell(20, 10, $lsXOrigin, $lsYOrigin, $ls, 0, 0, $fill, true, 'C', true);

$pdf-> Output('test.pdf', 'I'); // TODO: de inlocuit cu aviz_CUIM

// add new page pt diferente
$pdf->AddPage();
$pdf->setPage(2);
$pdf->SetFont('freeserif', '', 12);
$certTipB1 = '
<style>
.tg td{height:35px; padding:10px 5px;word-break:normal}
.tg  {margin:10px;}
.tg .tg-yy4l{width:"3%";vertical-align:center;text-align:left}
.tg .tg-yw4l{width:"97%";vertical-align:center;text-align:left}
</style>
<table class="tg">
  <tr>
    <td class="tg-yy4l">O</td>
    <td class="tg-yw4l">Medic cu competențe limitate</td>
  </tr>
  <tr>
    <td class="tg-yy4l">O</td>
    <td class="tg-yw4l">Medic rezident</td>
  </tr>
  <tr>
    <td class="tg-yy4l"></td>
    <td class="tg-yw4l">în specialitatea: <strong>Specialitatea specialitatilor</strong></td>
  </tr>
  <tr>
    <td class="tg-yy4l">O</td>
    <td class="tg-yw4l">Rezidențiat finalizat fără examen de confirmare</td>
  </tr>
  <tr>
    <td class="tg-yy4l"></td>
    <td class="tg-yw4l">în specialitatea: <strong>Specialitatea specialitatilor</strong></td>
  </tr>
</table>
';
$pdf->SetFillColor(0, 127, 127);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin - 10, 19, $origin + 5, $box2YOrigin, $certTipB1, 0, 0, $fill, true, 'L', true);

$certTipB2 = '
<p style="align:center">TITULARUL PREZENTULUI CERTIFICAT NU ARE DREPT DE LIBERĂ PRACTICĂ</p>
';
$pdf->SetFillColor(0, 127, 127);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin - 10, 19, $origin + 5, $box4YOrigin, $certTipB2, 0, 0, $fill, true, 'L', true);

// add new page pt diferente
$pdf->AddPage();
$pdf->setPage(3);

$certTipC = '
<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;border-color:#00;margin:10px auto;}
.tg td{padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#000000;color:#333;background-color:#fff;}
.tg th{padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#000000;color:#333;background-color:#f0f0f0;}
.tg .tg-t2ww{fwidth:"80%";font-weight:bold;text-decoration:underline;text-align:left;vertical-align:center}
.tg .tg-t2cw{fwidth:"20%";font-weight:bold;text-decoration:underline;text-align:right;vertical-align:center}
.tg .tg-yy4l{width:"3%";vertical-align:center;text-align:left}
.tg .tg-yw4l{width:"97%";vertical-align:center;text-align:left}

</style>
<table class="tg">
  <tr>
    <th class="tg-t2ww"></th>
    <th class="tg-t2cw"></th>
  </tr>
  <tr>
    <td class="tg-yy4l">1.</td>
    <td class="tg-yw4l">MEDIC DE MEDICINĂ GENERALĂ</td>
  </tr>
  <tr>
    <td class="tg-yy4l">2.</td>
    <td class="tg-yw4l"></td>
  </tr>
  <tr>
    <td class="tg-yy4l">3.</td>
    <td class="tg-yw4l"></td>
  </tr>
  <tr>
    <td class="tg-yy4l">4.</td>
    <td class="tg-yw4l"></td>
  </tr>
</table>
';
$pdf->SetFillColor(0, 127, 127);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin - 10, 19, $origin + 5, $box2YOrigin, $certTipC, 0, 0, $fill, true, 'L', true);




$pdf-> Output('test.pdf', 'I'); // TODO: de inlocuit cu aviz_CUIM

