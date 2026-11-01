<?php

namespace App\Services\Admin;

use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DatabaseBackupService
{
    /**
     * Genera y descarga un volcado SQL completo de la base de datos.
     */
    public function downloadSqlBackup(): StreamedResponse
    {
        $connection = config('database.default');
        $databaseName = config("database.connections.{$connection}.database");
        $cleanDbName = is_string($databaseName) ? basename(str_replace('\\', '/', $databaseName)) : 'lab_meca';
        $cleanDbName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $cleanDbName);
        $filename = 'backup_'.$cleanDbName.'_'.now()->format('Y-m-d_His').'.sql';

        $headers = [
            'Content-Type' => 'application/sql; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->streamDownload(function () use ($connection, $databaseName) {
            $out = fopen('php://output', 'w');

            fwrite($out, "-- ============================================================\n");
            fwrite($out, "-- SIGELAB - Backup de Base de Datos\n");
            fwrite($out, "-- Sistema de Gestión de Laboratorio de Mecánica\n");
            fwrite($out, "-- Base de datos: {$databaseName}\n");
            fwrite($out, '-- Fecha de generación: '.now()->toDateTimeString()."\n");
            fwrite($out, "-- Motor de conexión: {$connection}\n");
            fwrite($out, "-- ============================================================\n\n");

            if ($connection === 'sqlite') {
                $this->dumpSqlite($out);
            } else {
                $this->dumpMysql($out);
            }

            fclose($out);
        }, $filename, $headers);
    }

    /**
     * Genera volcado para MySQL / MariaDB.
     *
     * @param  resource  $out
     */
    private function dumpMysql($out): void
    {
        fwrite($out, "/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;\n");
        fwrite($out, "/*!40101 SET NAMES utf8mb4 */;\n");
        fwrite($out, "/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;\n");
        fwrite($out, "/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;\n\n");

        $tables = DB::select('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"');
        $pdo = DB::getPdo();

        foreach ($tables as $tableObj) {
            $tableArray = (array) $tableObj;
            $tableName = reset($tableArray);

            fwrite($out, "-- ------------------------------------------------------------\n");
            fwrite($out, "-- Estructura de tabla `{$tableName}`\n");
            fwrite($out, "-- ------------------------------------------------------------\n");
            fwrite($out, "DROP TABLE IF EXISTS `{$tableName}`;\n");

            $createTable = DB::select("SHOW CREATE TABLE `{$tableName}`");
            $createTableArray = (array) ($createTable[0] ?? []);
            $createSql = $createTableArray['Create Table'] ?? '';
            fwrite($out, "{$createSql};\n\n");

            // Volcado de registros
            fwrite($out, "-- Volcado de datos para la tabla `{$tableName}`\n");
            $rows = DB::table($tableName)->get();

            if ($rows->isNotEmpty()) {
                foreach ($rows->chunk(100) as $chunk) {
                    $valuesSql = [];
                    foreach ($chunk as $row) {
                        $rowArray = (array) $row;
                        $escapedValues = array_map(function ($val) use ($pdo) {
                            if (is_null($val)) {
                                return 'NULL';
                            }

                            return $pdo->quote((string) $val);
                        }, $rowArray);
                        $valuesSql[] = '('.implode(', ', $escapedValues).')';
                    }
                    fwrite($out, "INSERT INTO `{$tableName}` VALUES \n".implode(",\n", $valuesSql).";\n");
                }
            }
            fwrite($out, "\n");
        }

        fwrite($out, "/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;\n");
        fwrite($out, "/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;\n");
        fwrite($out, "-- Fin del respaldo\n");
    }

    /**
     * Genera volcado para SQLite.
     *
     * @param  resource  $out
     */
    private function dumpSqlite($out): void
    {
        $tables = DB::select("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
        $pdo = DB::getPdo();

        fwrite($out, "PRAGMA foreign_keys = OFF;\n\n");

        foreach ($tables as $table) {
            $tableName = $table->name;
            fwrite($out, "-- ------------------------------------------------------------\n");
            fwrite($out, "-- Tabla: {$tableName}\n");
            fwrite($out, "-- ------------------------------------------------------------\n");
            fwrite($out, "DROP TABLE IF EXISTS \"{$tableName}\";\n");
            fwrite($out, "{$table->sql};\n\n");

            $rows = DB::table($tableName)->get();
            if ($rows->isNotEmpty()) {
                foreach ($rows->chunk(100) as $chunk) {
                    foreach ($chunk as $row) {
                        $rowArray = (array) $row;
                        $cols = array_map(fn ($col) => "\"{$col}\"", array_keys($rowArray));
                        $vals = array_map(fn ($val) => is_null($val) ? 'NULL' : $pdo->quote((string) $val), array_values($rowArray));
                        fwrite($out, "INSERT INTO \"{$tableName}\" (".implode(', ', $cols).') VALUES ('.implode(', ', $vals).");\n");
                    }
                }
            }
            fwrite($out, "\n");
        }

        fwrite($out, "PRAGMA foreign_keys = ON;\n");
        fwrite($out, "-- Fin del respaldo\n");
    }
}
