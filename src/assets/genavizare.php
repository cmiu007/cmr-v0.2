<?php

$aviz = $_REQUEST['aviz'];
$url_base = "https://devel-api.cmr.ro/api/";
//$token = $_REQUEST['token'];
$token = $_REQUEST['token'];
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
	'id' =>	$aviz,
	'actiune' => 'dlp',
];
$url = $url_base."get";
$data_json = json_encode($data);
$DLP = call_api($url, $data_json);
/*echo "<pre>";
print_r($DLP);
echo "</pre>";
*/

$data = [	'token' => 	$token,
	'id' =>	$DLP['id_certificat'],
	'actiune' => 'certificat',
];
$url = $url_base."get";
$data_json = json_encode($data);
$certificat = call_api($url, $data_json);



$id = $certificat['id_mem'];
$date_cert = json_decode($certificat['continut'], true);

$data = [
	'token' => 	$token,
	'id' =>	$aviz,
];
$url = $url_base."getaviz";
$data_json = json_encode($data);
$cppuri = call_api($url, $data_json);

$data = [	'token' => 	$token,
	'id' =>	$id,
	'actiune' => 'date_personale',
];
$url = $url_base."get";
$data_json = json_encode($data);
$medic = call_api($url, $data_json);

$numeMedic = $medic['nume']. ' ' . $medic['prenume'];
$CUIM = $medic['cuim'];



$NR_CERT = $certificat['id_certificat'];
$DATA_CERT = datex($certificat['data_start']);

$data = [
         'jud_id' => $medic['jud_id'],
];

$data_json = json_encode($data);
$url = $url_base."jud";
$rezultat = call_api($url, $data_json);
$CMJ = $rezultat[0]['nume'];

$data = [	'token' => 	$token,
			'id' =>	$medic['jud_id'],
			'actiune' => 'cmj',
];
$url = $url_base."get";
$data_json = json_encode($data);
$cmj = call_api($url, $data_json);

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
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

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
$titleYOrigin = $imgOrigin + 3;
$title2YOrigin = $titleYOrigin + 7 ;
$title3YOrigin = $title2YOrigin + 18 ;
$titularYOrigin = $title3YOrigin + 24;
$prezentaYOrigin = $titularYOrigin + 18 ;
$box1YOrigin = $prezentaYOrigin + 14;
$box2YOrigin = $box1YOrigin + 25;
$box3YOrigin = $box2YOrigin + 25;
$box4YOrigin = $box3YOrigin + 25;
$notaYOrigin = $box4YOrigin + 25;
$presedinteYOrigin = $notaYOrigin + 60;
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
<h3 style="letter-spacing:4px">COLEGIUL &nbsp;MEDICILOR&nbsp;DIN&nbsp;ROMÂNIA</h3>
';
$titlu2HTML = '
<span style="letter-spacing:2px;font-size:12"> Colegiul Medicilor <b>'.$CMJ.'</b></span>
<br>
<h2>A V I Z&nbsp; &nbsp;A N U A L</h2>
';
$titlu3HTML = '
<h2>privind exercitarea profesiei de medic</h2>
eliberat în data de <span style="font-weight: bold;">'.$acum.'</span>
';

$pdf->WriteHTMLCell($pageWidth - $imgOrigin - 1.5 - $origin, 38, $imgOrigin, $titleYOrigin, $titlu1HTML, 0, 0, $fill, true, 'C', true);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - 1.5 - $origin, 38, $imgOrigin, $title2YOrigin, $titlu2HTML, 0, 0, $fill, true, 'C', true);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - 1.5 - $origin, 38, $imgOrigin, $title3YOrigin, $titlu3HTML, 0, 0, $fill, true, 'C', true);

$pdf->SetFont('freeserif', '', 12);
$titularHTML = '
<p>
<b><u>Titular:</u></b> <span style="font-weight: bold;">'.$numeMedic.'</span>
</p>
<p>
<u>C.U.I.M.:</u> <span style="font-weight: bold;">'.$CUIM.'</span> <u>Certificat de membru</u> nr. <span style="font-weight: bold;">'.$NR_CERT.'</span> din data de <span style="font-weight: bold;">'.$DATA_CERT.'</span>
</p>
';
$pdf->SetFillColor(127, 127, 127);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - 1.5 - $origin * 2, 19, $origin + 5, $titularYOrigin , $titularHTML, 0, 0, $fill, true, 'L', true);

$prezenta = '
<p style="font-weight: bold; "><i>
Prin prezenta se certifică faptul că titularul are dreptul de a profesa ca medic, astfel:<br>
</i></p>
';
$pdf->SetFillColor(255, 127, 127);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin, 19, $origin + 1.5 , $prezentaYOrigin, $prezenta, 0, 0, $fill, true, 'C', true);

$pdf->SetFont('freeserif', '', 10);

$deltay = 0;
$Y = $box1YOrigin;
 $deltay = 0;
  $Y = $box1YOrigin;
  //echo "<pre>";
  //print_r($cppuri);
  //echo "</pre>";
  

  foreach($cppuri as $nume_grup => $grup)
  {
			 /*echo 'Nume grup:' .$nume_grup."<br>";
				echo "<pre>";
				print_r($grup);
    echo "</pre>";*/
			
    $nextBoxOffset=0;
    if (sizeof($grup) == 0)
					continue;
				$specialitate = '<table border="1" cellpadding="2">
    <tr>
      <th bgcolor="#d3d3d3">'.$nume_grup.'</th>
    </tr>';
    foreach($grup as $cpz){
					/*echo "<pre>";
				 print_r($cpz);
     echo "</pre>";*/
					
      $nextBoxOffset+=25;
      $dlp_data_start = datex($cpz['data_start']);
      $dlp_data_end = datex($cpz['data_end']);
      //echo 'Tip asigurare:'.$cpz['tip'];
	  switch ($cpz['tip'])
	  {
		case "1":
				$specialitate .= '
				<tr>
				<th>
					Specialitate: <span style="font-weight: bold;">'.$cpz['nume_cpp'].'</span>  Grad profesional: <span style="font-weight: bold;">'.$cpz['nume_gr_prof'].'</span>
				  <br>
					Drept de practică: <span style="font-weight: bold;">'.$cpz['nume_tip_avizare'].'</span>
				  <br>
					Poliță asigurare: seria <span style="font-weight: bold;">'.$cpz['polita_serie'].'</span> nr <span style="font-weight: bold;">'.$cpz['polita_nr'].'</span>
					încheiată la <span style="font-weight: bold;">'.$cpz['nume_asigurator'].'</span>
				  <br>
					Valabilitate aviz: <span style="font-weight: bold;">'.$dlp_data_start.'-'.$dlp_data_end.'</span>
				</th>
        </tr>';

		break;
    case "2":
		case "3":
		case "4":
		case "5":
				$specialitate .= '
				<tr>
				<th>
					Specialitate: <span style="font-weight: bold;">'.$cpz['nume_cpp'].'</span>
				  <br>
					Drept de practică: <span style="font-weight: bold;">'.$cpz['nume_tip_avizare'].'</span>
				  <br>
					Poliță asigurare: seria <span style="font-weight: bold;">'.$cpz['polita_serie'].'</span> nr <span style="font-weight: bold;">'.$cpz['polita_nr'].'</span>
					încheiată la <span style="font-weight: bold;">'.$cpz['nume_asigurator'].'</span>
				  <br>
					Valabilitate aviz: <span style="font-weight: bold;">'.$dlp_data_start.'-'.$dlp_data_end.'</span>
				</th>
				</tr>';
		break;
		case "6":
		case "7":
		case "8":
		case "9":
		case "10":
				$specialitate .= '
				<tr>
				<th>
					Specialitate: <span style="font-weight: bold;">'.$cpz['nume_cpp'].'</span>
				  <br>
					Drept de practică: <span style="font-weight: bold;">Fără drept de liberă practică</span>
				  <br>
				</th>
				</tr>';
		break;
	  }

	}
		  $specialitate .= '</table>';
      $pdf->SetFillColor(0, 127, 127);
      $pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin, 19, $origin + 1.5 , $Y, $specialitate, 0, 0, $fill, true, 'L', true);
      $Y+=$nextBoxOffset;
	//echo $specialitate;
  }

switch ($date_cert['tip_cert'])
{
  case "A":
    $Y += 5;
		$pdf->SetFont('freeserif', '', 8);
		$footer1 = '
		<span style="font-weight: bold; text-decoration: underline;">Nota:</span>
		<br>
		1.	Titularul are dreptul să practice profesia conform prevederilor de mai sus numai în specialitățile în care este avizat și numai în intervalul de timp pentru care există avizul anual al C.M.R.</li>
		<br>
		2.	Avizarea se face anual, pe baza asigurării de răspundere civilă pentru greșeli în activitatea profesională, valabilă pentru anul respectiv</li>
		<br><br>
		<span style="font-weight: bold; text-decoration: underline;">Mențiuni privind dreptul de practică:</span>
		<br>
		<b><i>(1)	drept de liberă practică</i></b> în specialitatea avizată în baza căruia titularul poate, potrivit pregătirii pentru care deține un titlu profesional, să desfășoare activități
		medicale în sistemul public de sănătate sau/și în sistemul privat, fie ca angajat, fie ca persoană fizică independentă pe bază de contract. Titularul poate înființa, în condițiile legii,
		cabinet(e) de practică medicală.
		<br>
		<b><i>(2)	drept de practică supravegheată în activitatea de medic rezident</i></b>, numai în unitățile sanitare acreditate, în condițiile Ordonanței Guvernului nr. 18/2009 privind organizarea
		și finanțarea rezidențiatului, aprobată prin Legea nr. 103/2012, cu completările ulterioare, și ale Ordinului Ministerului Sănătății Publice și al ministrului educației, cercetării și tineretului
		nr. 1141/1386/2007 privind modul de efectuare a pregătirii prin rezidențiat în specialitățile prevăzute de Nomenclatorul specialităților medicale, medico-dentare și farmaceutice pentru rețeaua
		de asistență medicală, cu modificările și completările ulterioare.
		<br>
		<b><i>(3)	drept de practică supravegheată</i></b> în baza căruia titularul își poate desfășura activitatea numai în cabinete medicale individuale, sub îndrumarea unui medic cu drept
		de liberă practică, în funcție de specialitatea în care a fost confirmat medic rezident, în condițiile Ordonanței Guvernului nr. 18/2009 privind organizarea și finanțarea rezidențiatului,
		aprobată prin Legea nr. 103/2012, cu completările ulterioare.
		';
		$pdf->SetFillColor(255, 255, 0);
		$pdf->WriteHTMLCell(
      $pageWidth - $imgOrigin - $origin, 19, $origin + 1.5 , $Y, $footer1, 0, 0, $fill, true, 'J', true);
	break;
	case "B":
		$pdf->SetFont('freeserif', '', 8);
		$footer1 = '
		<span style="font-weight: bold; text-decoration: underline;">Nota:</span>
		<br>
		1.	Titularul are dreptul să practice profesia conform prevederilor de mai sus numai în specialitățile în care este avizat și numai în intervalul de timp pentru care există avizul anual al C.M.R.</li>
		<br>
		2.	Avizarea se face anual, pe baza asigurării de răspundere civilă pentru greșeli în activitatea profesională, valabilă pentru anul respectiv</li>
		<br><br>
		<span style="font-weight: bold; text-decoration: underline;">Mențiuni privind dreptul de practică:</span>
		<br>
		<b><i>(1)	competențe limitate </i></b> în baza cărora titularul își poate desfășura activitatea numai ca angajat în unitățile sanitare publice și private, în condițiile Ordonanței Guvernului nr.
		18/2009 privind organizarea și finanțarea rezidențiatului, aprobată prin Legea nr. 103/2012, cu modificările și completările ulterioare,  și ale Ordinului Ministrului  Sănătății nr. 527/2011
		pentru aprobarea Normelor metodologice privind încadrarea și activitatea medicului cu competențe limitate.
		<br>
		<b><i>(2)	drept de practică supravegheată în activitatea de medic rezident</i></b>, numai în unitățile sanitare acreditate, în condițiile Ordonanței Guvernului nr. 18/2009 privind organizarea
		și finanțarea rezidențiatului, aprobată prin Legea nr. 103/2012, cu completările ulterioare, și ale Ordinului Ministerului Sănătății Publice și al ministrului educației, cercetării și tineretului
		nr. 1141/1386/2007 privind modul de efectuare a pregătirii prin rezidențiat în specialitățile prevăzute de Nomenclatorul specialităților medicale, medico-dentare și farmaceutice pentru rețeaua
		de asistență medicală, cu modificările și completările ulterioare.
		<br>
		<b><i>(3)	drept de practică supravegheată</i></b> în baza căruia titularul își poate desfășura activitatea numai în cabinete medicale individuale, sub îndrumarea unui medic cu drept
		de liberă practică, în funcție de specialitatea în care a fost confirmat medic rezident, în condițiile Ordonanței Guvernului nr. 18/2009 privind organizarea și finanțarea rezidențiatului,
		aprobată prin Legea nr. 103/2012, cu completările ulterioare.
		';
		$pdf->SetFillColor(255, 255, 0);
		$pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin, 19, $origin + 1.5 , $notaYOrigin, $footer1, 0, 0, $fill, true, 'J', true);
	break;
  case "C":

		$pdf->SetFont('freeserif', '', 8);
		$footer1 = '
		<span style="font-weight: bold; text-decoration: underline;">Nota:</span>
		<br>
		1.	Titularul are dreptul să practice profesia conform prevederilor de mai sus numai în specialitățile în care este avizat și numai în intervalul de timp pentru care există avizul anual al
		C.M.R.</li>
		<br>
		2.	Avizarea se face anual, pe baza asigurării de răspundere civilă pentru greșeli în activitatea profesională, valabilă pentru anul respectiv</li>
		<br><br>
		<span style="font-weight: bold; text-decoration: underline;">Mențiuni privind dreptul de practică:</span>
		<br>
		<b><i>(1)	drept de liberă practică</i></b> conform art. 64 lit. d) din Legea nr. 95/2006 privind reforma în domeniul sănătății, republicată, cu modificările și completările ulterioare și/sau art. 24
		alin.(1) din Ordonanța Guvernului nr. 18/2009 privind organizarea și finanțarea rezidențiatului, aprobată prin Legea nr. 103/2012, cu modificările și completările ulterioare;
		<br>
		<b><i>(2)	drept de practică supravegheată în activitatea de medic rezident</i></b>, numai în unitățile sanitare acreditate, în condițiile Ordonanței Guvernului nr. 18/2009 privind organizarea
		și finanțarea rezidențiatului, aprobată prin Legea nr. 103/2012, cu completările ulterioare, și ale Ordinului Ministerului Sănătății Publice și al ministrului educației, cercetării și tineretului
		nr. 1141/1386/2007 privind modul de efectuare a pregătirii prin rezidențiat în specialitățile prevăzute de Nomenclatorul specialităților medicale, medico-dentare și farmaceutice pentru rețeaua
		de asistență medicală, cu modificările și completările ulterioare.
		<br>
		<b><i>(3)	drept de practică supravegheată</i></b> în baza căruia titularul își poate desfășura activitatea numai în cabinete medicale individuale, sub îndrumarea unui medic cu drept
		de liberă practică, în funcție de specialitatea în care a fost confirmat medic rezident, în condițiile Ordonanței Guvernului nr. 18/2009 privind organizarea și finanțarea rezidențiatului,
		aprobată prin Legea nr. 103/2012, cu completările ulterioare.
		';
		$pdf->SetFillColor(255, 255, 0);
		$pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin, 19, $origin + 1.5 , $notaYOrigin, $footer1, 0, 0, $fill, true, 'J', true);
	break;
}
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
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin, 19, $origin + 1.5 , $presedinteYOrigin, $footer2, 0, 0, $fill, true, 'C', true);

$ls = '
L.S.
';
// $pdf->WriteHTMLCell(20, 10, $lsXOrigin , $lsYOrigin, $ls, 0, 0, $fill, true, 'C', true);
$pdf->WriteHTMLCell(20, 10, $lsXOrigin , $lsYOrigin, $ls, 0, 0, $fill, true, 'C', true);

$pdf->Output('aviz_'.$CUIM.'.pdf', 'I');

