import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import estudiantes from './estudiantes'
/**
* @see \App\Http\Controllers\Admin\MateriaController::index
 * @see app/Http/Controllers/Admin/MateriaController.php:19
 * @route '/admin/materias'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/materias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MateriaController::index
 * @see app/Http/Controllers/Admin/MateriaController.php:19
 * @route '/admin/materias'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MateriaController::index
 * @see app/Http/Controllers/Admin/MateriaController.php:19
 * @route '/admin/materias'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\MateriaController::index
 * @see app/Http/Controllers/Admin/MateriaController.php:19
 * @route '/admin/materias'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\MateriaController::index
 * @see app/Http/Controllers/Admin/MateriaController.php:19
 * @route '/admin/materias'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\MateriaController::index
 * @see app/Http/Controllers/Admin/MateriaController.php:19
 * @route '/admin/materias'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\MateriaController::index
 * @see app/Http/Controllers/Admin/MateriaController.php:19
 * @route '/admin/materias'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\MateriaController::store
 * @see app/Http/Controllers/Admin/MateriaController.php:59
 * @route '/admin/materias'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/materias',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\MateriaController::store
 * @see app/Http/Controllers/Admin/MateriaController.php:59
 * @route '/admin/materias'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MateriaController::store
 * @see app/Http/Controllers/Admin/MateriaController.php:59
 * @route '/admin/materias'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\MateriaController::store
 * @see app/Http/Controllers/Admin/MateriaController.php:59
 * @route '/admin/materias'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MateriaController::store
 * @see app/Http/Controllers/Admin/MateriaController.php:59
 * @route '/admin/materias'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\MateriaController::update
 * @see app/Http/Controllers/Admin/MateriaController.php:66
 * @route '/admin/materias/{materia}'
 */
export const update = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/materias/{materia}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\MateriaController::update
 * @see app/Http/Controllers/Admin/MateriaController.php:66
 * @route '/admin/materias/{materia}'
 */
update.url = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { materia: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { materia: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    materia: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        materia: typeof args.materia === 'object'
                ? args.materia.id
                : args.materia,
                }

    return update.definition.url
            .replace('{materia}', parsedArgs.materia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MateriaController::update
 * @see app/Http/Controllers/Admin/MateriaController.php:66
 * @route '/admin/materias/{materia}'
 */
update.put = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\MateriaController::update
 * @see app/Http/Controllers/Admin/MateriaController.php:66
 * @route '/admin/materias/{materia}'
 */
    const updateForm = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MateriaController::update
 * @see app/Http/Controllers/Admin/MateriaController.php:66
 * @route '/admin/materias/{materia}'
 */
        updateForm.put = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\MateriaController::destroy
 * @see app/Http/Controllers/Admin/MateriaController.php:76
 * @route '/admin/materias/{materia}'
 */
export const destroy = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/materias/{materia}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\MateriaController::destroy
 * @see app/Http/Controllers/Admin/MateriaController.php:76
 * @route '/admin/materias/{materia}'
 */
destroy.url = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { materia: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { materia: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    materia: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        materia: typeof args.materia === 'object'
                ? args.materia.id
                : args.materia,
                }

    return destroy.definition.url
            .replace('{materia}', parsedArgs.materia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MateriaController::destroy
 * @see app/Http/Controllers/Admin/MateriaController.php:76
 * @route '/admin/materias/{materia}'
 */
destroy.delete = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\MateriaController::destroy
 * @see app/Http/Controllers/Admin/MateriaController.php:76
 * @route '/admin/materias/{materia}'
 */
    const destroyForm = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MateriaController::destroy
 * @see app/Http/Controllers/Admin/MateriaController.php:76
 * @route '/admin/materias/{materia}'
 */
        destroyForm.delete = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const materias = {
    index: Object.assign(index, index),
estudiantes: Object.assign(estudiantes, estudiantes),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default materias