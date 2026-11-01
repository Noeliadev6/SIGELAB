import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BackupController::downloadDatabase
 * @see app/Http/Controllers/Admin/BackupController.php:20
 * @route '/admin/backup/database'
 */
export const downloadDatabase = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadDatabase.url(options),
    method: 'get',
})

downloadDatabase.definition = {
    methods: ["get","head"],
    url: '/admin/backup/database',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BackupController::downloadDatabase
 * @see app/Http/Controllers/Admin/BackupController.php:20
 * @route '/admin/backup/database'
 */
downloadDatabase.url = (options?: RouteQueryOptions) => {
    return downloadDatabase.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BackupController::downloadDatabase
 * @see app/Http/Controllers/Admin/BackupController.php:20
 * @route '/admin/backup/database'
 */
downloadDatabase.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadDatabase.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BackupController::downloadDatabase
 * @see app/Http/Controllers/Admin/BackupController.php:20
 * @route '/admin/backup/database'
 */
downloadDatabase.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadDatabase.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\BackupController::downloadDatabase
 * @see app/Http/Controllers/Admin/BackupController.php:20
 * @route '/admin/backup/database'
 */
    const downloadDatabaseForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadDatabase.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\BackupController::downloadDatabase
 * @see app/Http/Controllers/Admin/BackupController.php:20
 * @route '/admin/backup/database'
 */
        downloadDatabaseForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadDatabase.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\BackupController::downloadDatabase
 * @see app/Http/Controllers/Admin/BackupController.php:20
 * @route '/admin/backup/database'
 */
        downloadDatabaseForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadDatabase.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadDatabase.form = downloadDatabaseForm
const BackupController = { downloadDatabase }

export default BackupController