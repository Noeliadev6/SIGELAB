<?php

namespace App\Services\Admin;

use RuntimeException;
use SimpleXMLElement;
use ZipArchive;

class XlsxPlanillaReader
{
    /** @return list<array{row:int,numero_registro:?string,nombre:string,carrera:string}> */
    public function read(string $path): array
    {
        $zip = new ZipArchive;
        if ($zip->open($path) !== true) {
            throw new RuntimeException('El archivo XLSX no pudo abrirse.');
        }

        $strings = $this->sharedStrings($zip);
        $xml = $zip->getFromName('xl/worksheets/sheet1.xml');
        if ($xml === false || ! ($sheet = simplexml_load_string($xml)) instanceof SimpleXMLElement) {
            throw new RuntimeException('El XLSX no contiene una hoja válida.');
        }

        $rows = $this->rows($sheet, $strings);
        $headerIndex = null;
        $columns = [];
        foreach ($rows as $index => $row) {
            foreach ($row as $column => $value) {
                $header = $this->normalize($value);
                if (in_array($header, ['n', 'numero', 'numero de estudiante', 'numero de registro', 'numero_registro', 'no'], true)) {
                    $columns['numero_registro'] = $column;
                } elseif (in_array($header, ['nombre', 'nombres', 'nombre y apellido', 'nombre y apellidos'], true)) {
                    $columns['nombre'] = $column;
                } elseif ($header === 'carrera') {
                    $columns['carrera'] = $column;
                }
            }
            if (isset($columns['nombre'], $columns['carrera'])) {
                $headerIndex = $index;
                break;
            }
        }

        if ($headerIndex === null) {
            throw new RuntimeException('El Excel debe tener columnas Nombre y Carrera. La columna N° o Número de registro es opcional para estudiantes externos.');
        }

        $students = [];
        for ($index = $headerIndex + 1; isset($rows[$index]); $index++) {
            $row = $rows[$index];
            $registrationNumber = trim((string) ($row[$columns['numero_registro']] ?? ''));
            $name = trim((string) ($row[$columns['nombre']] ?? ''));
            $career = trim((string) ($row[$columns['carrera']] ?? ''));
            if ($registrationNumber === '' && $name === '' && $career === '') {
                continue;
            }
            $students[] = [
                'row' => $index + 1,
                'numero_registro' => $registrationNumber === '' ? null : $registrationNumber,
                'nombre' => $name,
                'carrera' => $career,
            ];
        }

        $zip->close();

        return $students;
    }

    private function normalize(string $value): string
    {
        $value = mb_strtolower(trim($value));
        $value = str_replace(['°', '.', ':'], '', $value);

        return str_replace(['á', 'é', 'í', 'ó', 'ú', 'ü'], ['a', 'e', 'i', 'o', 'u', 'u'], $value);
    }

    private function rows(SimpleXMLElement $sheet, array $strings): array
    {
        $rows = [];
        $sheetRows = $sheet->xpath('/*[local-name()="worksheet"]/*[local-name()="sheetData"]/*[local-name()="row"]') ?: [];

        foreach ($sheetRows as $row) {
            $cells = [];
            $rowCells = $row->xpath('./*[local-name()="c"]') ?: [];

            foreach ($rowCells as $cell) {
                $reference = (string) $cell['r'];
                if (preg_match('/^([A-Z]+)\d+$/i', $reference, $matches) !== 1) {
                    continue;
                }

                $column = strtoupper($matches[1]);
                $value = $this->cellValue($cell, $strings);
                $cells[$column] = trim($value);
            }
            $rows[(int) $row['r'] - 1] = $cells;
        }
        ksort($rows);

        return $rows;
    }

    private function sharedStrings(ZipArchive $zip): array
    {
        $xml = $zip->getFromName('xl/sharedStrings.xml');
        if ($xml === false) {
            return [];
        }

        $sharedStrings = simplexml_load_string($xml);
        if (! $sharedStrings instanceof SimpleXMLElement) {
            return [];
        }

        $result = [];
        $items = $sharedStrings->xpath('/*[local-name()="sst"]/*[local-name()="si"]') ?: [];

        foreach ($items as $item) {
            $result[] = trim($this->textNodesValue($item));
        }

        return $result;
    }

    private function cellValue(SimpleXMLElement $cell, array $strings): string
    {
        $type = (string) $cell['t'];

        if ($type === 'inlineStr') {
            return $this->textNodesValue($cell);
        }

        $valueNodes = $cell->xpath('./*[local-name()="v"]') ?: [];
        $value = isset($valueNodes[0]) ? (string) $valueNodes[0] : '';

        if ($type === 's') {
            return $strings[(int) $value] ?? '';
        }

        return $value;
    }

    private function textNodesValue(SimpleXMLElement $element): string
    {
        $texts = $element->xpath('.//*[local-name()="t"]') ?: [];

        return implode('', array_map(static fn (SimpleXMLElement $text): string => (string) $text, $texts));
    }
}
