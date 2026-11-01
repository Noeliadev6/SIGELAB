import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\EstudianteImportController::store
 * @see app/Http/Controllers/Admin/EstudianteImportController.php:35
 * @route '/admin/estudiantes/import'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/estudiantes/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\EstudianteImportController::store
 * @see app/Http/Controllers/Admin/EstudianteImportController.php:35
 * @route '/admin/estudiantes/import'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EstudianteImportController::store
 * @see app/Http/Controllers/Admin/EstudianteImportController.php:35
 * @route '/admin/estudiantes/import'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\EstudianteImportController::store
 * @see app/Http/Controllers/Admin/EstudianteImportController.php:35
 * @route '/admin/estudiantes/import'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\EstudianteImportController::store
 * @see app/Http/Controllers/Admin/EstudianteImportController.php:35
 * @route '/admin/estudiantes/import'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const importMethod = {
    store: Object.assign(store, store),
}

export default importMethod