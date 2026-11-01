import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BackupController::database
 * @see app/Http/Controllers/Admin/BackupController.php:20
 * @route '/admin/backup/database'
 */
export const database = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: database.url(options),
    method: 'get',
})

database.definition = {
    methods: ["get","head"],
    url: '/admin/backup/database',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BackupController::database
 * @see app/Http/Controllers/Admin/BackupController.php:20
 * @route '/admin/backup/database'
 */
database.url = (options?: RouteQueryOptions) => {
    return database.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BackupController::database
 * @see app/Http/Controllers/Admin/BackupController.php:20
 * @route '/admin/backup/database'
 */
database.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: database.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BackupController::database
 * @see app/Http/Controllers/Admin/BackupController.php:20
 * @route '/admin/backup/database'
 */
database.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: database.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\BackupController::database
 * @see app/Http/Controllers/Admin/BackupController.php:20
 * @route '/admin/backup/database'
 */
    const databaseForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: database.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\BackupController::database
 * @see app/Http/Controllers/Admin/BackupController.php:20
 * @route '/admin/backup/database'
 */
        databaseForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: database.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\BackupController::database
 * @see app/Http/Controllers/Admin/BackupController.php:20
 * @route '/admin/backup/database'
 */
        databaseForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: database.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    database.form = databaseForm
const backup = {
    database: Object.assign(database, database),
}

export default backup