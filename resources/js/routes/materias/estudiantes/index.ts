import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\MateriaController::store
 * @see app/Http/Controllers/Admin/MateriaController.php:91
 * @route '/admin/materias/{materia}/estudiantes'
 */
export const store = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/materias/{materia}/estudiantes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\MateriaController::store
 * @see app/Http/Controllers/Admin/MateriaController.php:91
 * @route '/admin/materias/{materia}/estudiantes'
 */
store.url = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{materia}', parsedArgs.materia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MateriaController::store
 * @see app/Http/Controllers/Admin/MateriaController.php:91
 * @route '/admin/materias/{materia}/estudiantes'
 */
store.post = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\MateriaController::store
 * @see app/Http/Controllers/Admin/MateriaController.php:91
 * @route '/admin/materias/{materia}/estudiantes'
 */
    const storeForm = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MateriaController::store
 * @see app/Http/Controllers/Admin/MateriaController.php:91
 * @route '/admin/materias/{materia}/estudiantes'
 */
        storeForm.post = (args: { materia: number | { id: number } } | [materia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\MateriaController::destroy
 * @see app/Http/Controllers/Admin/MateriaController.php:98
 * @route '/admin/materias/{materia}/estudiantes/{estudiante}'
 */
export const destroy = (args: { materia: number | { id: number }, estudiante: number | { id: number } } | [materia: number | { id: number }, estudiante: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/materias/{materia}/estudiantes/{estudiante}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\MateriaController::destroy
 * @see app/Http/Controllers/Admin/MateriaController.php:98
 * @route '/admin/materias/{materia}/estudiantes/{estudiante}'
 */
destroy.url = (args: { materia: number | { id: number }, estudiante: number | { id: number } } | [materia: number | { id: number }, estudiante: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    materia: args[0],
                    estudiante: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        materia: typeof args.materia === 'object'
                ? args.materia.id
                : args.materia,
                                estudiante: typeof args.estudiante === 'object'
                ? args.estudiante.id
                : args.estudiante,
                }

    return destroy.definition.url
            .replace('{materia}', parsedArgs.materia.toString())
            .replace('{estudiante}', parsedArgs.estudiante.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MateriaController::destroy
 * @see app/Http/Controllers/Admin/MateriaController.php:98
 * @route '/admin/materias/{materia}/estudiantes/{estudiante}'
 */
destroy.delete = (args: { materia: number | { id: number }, estudiante: number | { id: number } } | [materia: number | { id: number }, estudiante: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\MateriaController::destroy
 * @see app/Http/Controllers/Admin/MateriaController.php:98
 * @route '/admin/materias/{materia}/estudiantes/{estudiante}'
 */
    const destroyForm = (args: { materia: number | { id: number }, estudiante: number | { id: number } } | [materia: number | { id: number }, estudiante: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Admin/MateriaController.php:98
 * @route '/admin/materias/{materia}/estudiantes/{estudiante}'
 */
        destroyForm.delete = (args: { materia: number | { id: number }, estudiante: number | { id: number } } | [materia: number | { id: number }, estudiante: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const estudiantes = {
    store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
}

export default estudiantes