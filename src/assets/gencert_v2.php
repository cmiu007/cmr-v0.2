<?php

require_once('tcpdf/tcpdf.php');
date_default_timezone_set('Europe/Bucharest');

// creat a new pdf document
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
$pdf->SetProtection(array('modify', 'copy', 'extract', 'fill-forms', 'annot-forms', 'extract'), '', null, 1, null);

// set document information

$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Colegiul Medicilor din România');
$pdf->SetTitle('Aviz anual privind exercitarea profesiei de medic');
$pdf->SetSubject('Avizare pentru: Numele si Prenumele'); // TODO: de inlocuit cu Numele si CUIM
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
$title3YOrigin = $title2YOrigin + 28 ;
$titularYOrigin = $title3YOrigin + 40;
$prezentaYOrigin = $titularYOrigin + 18 ;
$box1YOrigin = $prezentaYOrigin + 14;
$box2YOrigin = $box1YOrigin + 25;
$box3YOrigin = $box2YOrigin + 40;
$box4YOrigin = $box3YOrigin + 23;
$notaYOrigin = $box4YOrigin + 23;
$presedinteYOrigin = $notaYOrigin + 25;
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
<h3>C O L E G I U L &nbsp; &nbsp;M E D I C I L O R&nbsp; &nbsp; D I N &nbsp; &nbsp;R O M Â N I A</h3>
';
$titlu2HTML = '
Colegiul Medicilor <b>TIMIȘOARA</b>
';
$titlu3HTML = '
<h1>C E R T I F I C A T&nbsp; &nbsp;D E&nbsp; &nbsp;M E M B R U</h1>
nr. <b>837726</b> din data de <b>10/01/2017</b>
';

$pdf->WriteHTMLCell($pageWidth - $imgOrigin - 1.5 - $origin, 38, $imgOrigin, $titleYOrigin, $titlu1HTML, 0, 0, $fill, true, 'C', true);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - 1.5 - $origin, 38, $imgOrigin, $title2YOrigin, $titlu2HTML, 0, 0, $fill, true, 'C', true);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - 1.5 - $origin, 38, $imgOrigin, $title3YOrigin, $titlu3HTML, 0, 0, $fill, true, 'C', true);

$pdf->SetFont('freeserif', '', 12);
$titularHTML = '
<p>
Titular: <b>Popescu Ionel</b>
</p>
<p>
Titluri deținute: <b>Profesor Doctor, Cercetator gradul III</b> 
</p>
<p>
C.N.P./data nașterii: <b>1740428997811</b> Cod unic de identificare (C.U.I.M): <b>1740428997811</b>
</p>
<p>
Formarea medicală de bază:  promoția <b>1977</b>, atestată prin titlul de calificare  seria/nr. <b>RR / 2312334</b>
eliberat de <b>Universitatea de Medicină și Farmacie "Carol Davila" din Bucuresti</b>.
<br>
recunoscut <i>(dacă este cazul)</i> prin certificatul de recunoaștere cu seria/nr. <b>PP / 88377392</b> din <b>21/10/2020</b>
</p>

';

$pdf->SetFillColor(127, 127, 127);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - 1.5 - $origin * 2, 19, $origin + 5, $titularYOrigin, $titularHTML, 0, 0, $fill, true, 'L', true);

// $prezenta = '
// <p style="font-weight: bold; "><i>
// Prin prezenta se certifică faptul că titularul are dreptul de a profesa ca medic,<br>
// în următoarele grupe de specialități:
// </i></p>
// ';
// $pdf->SetFillColor(255, 127, 127);
// $pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin, 19, $origin + 1.5 , $prezentaYOrigin, $prezenta, 0, 0, $fill, true, 'C', true);

// $pdf->SetFont('freeserif', '', 10);
// $specialitate = '
// <table border="1" cellpadding="2">
// <tr>
// <th bgcolor="#d3d3d3">SPECIALITĂȚI MEDICALE / CHIRURGICALE / PARACLINICE</th>
// </tr>
// <tr>
// <th>
// Specialitate: <b>Cardiologie</b>  grad profesional: <b>Primar</b> tip: <b>cu raspundere limitata</b>
// <br>
// Asigurator: <b>ASIROM VIENNA INSURANCE GROUP</b> Polita Seria: <b>MM</b> Nr: <b>000626748</b>
// <br>
// Valabilitate aviz: <b>01.01.2018-31.12.2018</b>
// </th>
// </tr>
// </table>
// ';
// $pdf->SetFillColor(0, 127, 127);
// $pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin, 19, $origin + 1.5, $box1YOrigin, $specialitate, 0, 0, $fill, true, 'L', true);

// ---------------------------

$specialitate = '
<style type="text/css">
.tg  {border-collapse:collapse;border-color:#000000;margin:0px;}
.tg td{height:25px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#000000;color:#333;background-color:#fff;}
.tg th{height:35px;vertical-align:center;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#000000;color:#333;background-color:#f0f0f0;}
.tg .tg-t2ww{fwidth:"80%";font-weight:bold;text-decoration:underline;text-align:left;vertical-align:center}
.tg .tg-t2cw{fwidth:"20%";font-weight:bold;text-decoration:underline;text-align:right;vertical-align:center}
.tg .tg-yy4l{width:"3%";vertical-align:center;text-align:left}
.tg .tg-yw4l{width:"78%";vertical-align:center;text-align:left}
.tg .tg-yz4l{width:"19%";vertical-align:center;text-align:left}

</style>
<table class="tg" border="3">
  <tr>
    <th class="tg-t2ww" colspan="2">Specialități</th>
    <th class="tg-t2cw">Grad Profesional</th>
  </tr>
  <tr>
    <td class="tg-yy4l">1.</td>
    <td class="tg-yw4l">Cardiologie</td>
    <td class="tg-yz4l">Primar</td>
  </tr>
  <tr>
    <td class="tg-yy4l">2.</td>
    <td class="tg-yw4l">O specialitate foarte foarte lunga</td>
    <td class="tg-yz4l">Secundar</td>
  </tr>
  <tr>
    <td class="tg-yy4l">3.</td>
    <td class="tg-yw4l"></td>
    <td class="tg-yz4l"></td>
  </tr>
  <tr>
    <td class="tg-yy4l">4.</td>
    <td class="tg-yw4l"></td>
    <td class="tg-yz4l"></td>
  </tr>
</table>
';
$pdf->SetFillColor(0, 127, 127);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin - 10, 19, $origin + 5, $box2YOrigin, $specialitate, 0, 0, $fill, true, 'L', true);

$competente = '
<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;border-color:#00;margin:0px auto;}
.tg td{padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#000000;color:#333;background-color:#fff;}
.tg th{padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#000000;color:#333;background-color:#f0f0f0;}
.tg .tg-t2ww{font-weight:bold;text-decoration:underline;text-align:left;vertical-align:center}
.tg .tg-yw4l{vertical-align:center;text-align:left}

</style>
<table class="tg" border="3">
  <tr>
    <th class="tg-t2ww">Studii Complementare</th>
  </tr>
  <tr>
    <td class="tg-yw4l">Cardiologie</td>
  </tr>
</table>

';
$pdf->SetFillColor(0, 127, 127);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin - 10, 19, $origin + 5, $box3YOrigin, $competente, 0, 0, $fill, true, 'L', true);

//----------------------------

// $pdf->SetFont('freeserif', '', 8);
$footer1 = '
Data depunerii jurământului: <b>10/12/2017</b>
';
$pdf->SetFillColor(255, 255, 0);
$pdf->WriteHTMLCell($pageWidth - $imgOrigin - $origin, 19, $origin + 1.5, $notaYOrigin, $footer1, 0, 0, $fill, true, 'J', true);

$pdf->SetFont('freeserif', '', 10);
$footer2 = '
<h2>Președinte,</h2>
<h2>Popescu Ionel al doilea</h2>
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
