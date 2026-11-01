import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\CatalogoController::update
 * @see app/Http/Controllers/Admin/CatalogoController.php:119
 * @route '/admin/catalogo/unidades/{unidad}'
 */
export const update = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/catalogo/unidades/{unidad}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\CatalogoController::update
 * @see app/Http/Controllers/Admin/CatalogoController.php:119
 * @route '/admin/catalogo/unidades/{unidad}'
 */
update.url = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unidad: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { unidad: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    unidad: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        unidad: typeof args.unidad === 'object'
                ? args.unidad.id
                : args.unidad,
                }

    return update.definition.url
            .replace('{unidad}', parsedArgs.unidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CatalogoController::update
 * @see app/Http/Controllers/Admin/CatalogoController.php:119
 * @route '/admin/catalogo/unidades/{unidad}'
 */
update.patch = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\CatalogoController::update
 * @see app/Http/Controllers/Admin/CatalogoController.php:119
 * @route '/admin/catalogo/unidades/{unidad}'
 */
    const updateForm = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CatalogoController::update
 * @see app/Http/Controllers/Admin/CatalogoController.php:119
 * @route '/admin/catalogo/unidades/{unidad}'
 */
        updateForm.patch = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\CatalogoController::editar
 * @see app/Http/Controllers/Admin/CatalogoController.php:133
 * @route '/admin/catalogo/unidades/{unidad}/editar'
 */
export const editar = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: editar.url(args, options),
    method: 'put',
})

editar.definition = {
    methods: ["put"],
    url: '/admin/catalogo/unidades/{unidad}/editar',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\CatalogoController::editar
 * @see app/Http/Controllers/Admin/CatalogoController.php:133
 * @route '/admin/catalogo/unidades/{unidad}/editar'
 */
editar.url = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unidad: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { unidad: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    unidad: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        unidad: typeof args.unidad === 'object'
                ? args.unidad.id
                : args.unidad,
                }

    return editar.definition.url
            .replace('{unidad}', parsedArgs.unidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CatalogoController::editar
 * @see app/Http/Controllers/Admin/CatalogoController.php:133
 * @route '/admin/catalogo/unidades/{unidad}/editar'
 */
editar.put = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: editar.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\CatalogoController::editar
 * @see app/Http/Controllers/Admin/CatalogoController.php:133
 * @route '/admin/catalogo/unidades/{unidad}/editar'
 */
    const editarForm = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: editar.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CatalogoController::editar
 * @see app/Http/Controllers/Admin/CatalogoController.php:133
 * @route '/admin/catalogo/unidades/{unidad}/editar'
 */
        editarForm.put = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: editar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    editar.form = editarForm
/**
* @see \App\Http\Controllers\Admin\CatalogoController::destroy
 * @see app/Http/Controllers/Admin/CatalogoController.php:171
 * @route '/admin/catalogo/unidades/{unidad}'
 */
export const destroy = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/catalogo/unidades/{unidad}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\CatalogoController::destroy
 * @see app/Http/Controllers/Admin/CatalogoController.php:171
 * @route '/admin/catalogo/unidades/{unidad}'
 */
destroy.url = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { unidad: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { unidad: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    unidad: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        unidad: typeof args.unidad === 'object'
                ? args.unidad.id
                : args.unidad,
                }

    return destroy.definition.url
            .replace('{unidad}', parsedArgs.unidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CatalogoController::destroy
 * @see app/Http/Controllers/Admin/CatalogoController.php:171
 * @route '/admin/catalogo/unidades/{unidad}'
 */
destroy.delete = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\CatalogoController::destroy
 * @see app/Http/Controllers/Admin/CatalogoController.php:171
 * @route '/admin/catalogo/unidades/{unidad}'
 */
    const destroyForm = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CatalogoController::destroy
 * @see app/Http/Controllers/Admin/CatalogoController.php:171
 * @route '/admin/catalogo/unidades/{unidad}'
 */
        destroyForm.delete = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Admin\CatalogoController::buscar
 * @see app/Http/Controllers/Admin/CatalogoController.php:208
 * @route '/admin/catalogo/unidades/buscar'
 */
export const buscar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscar.url(options),
    method: 'get',
})

buscar.definition = {
    methods: ["get","head"],
    url: '/admin/catalogo/unidades/buscar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CatalogoController::buscar
 * @see app/Http/Controllers/Admin/CatalogoController.php:208
 * @route '/admin/catalogo/unidades/buscar'
 */
buscar.url = (options?: RouteQueryOptions) => {
    return buscar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CatalogoController::buscar
 * @see app/Http/Controllers/Admin/CatalogoController.php:208
 * @route '/admin/catalogo/unidades/buscar'
 */
buscar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CatalogoController::buscar
 * @see app/Http/Controllers/Admin/CatalogoController.php:208
 * @route '/admin/catalogo/unidades/buscar'
 */
buscar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscar.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\CatalogoController::buscar
 * @see app/Http/Controllers/Admin/CatalogoController.php:208
 * @route '/admin/catalogo/unidades/buscar'
 */
    const buscarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscar.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\CatalogoController::buscar
 * @see app/Http/Controllers/Admin/CatalogoController.php:208
 * @route '/admin/catalogo/unidades/buscar'
 */
        buscarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscar.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\CatalogoController::buscar
 * @see app/Http/Controllers/Admin/CatalogoController.php:208
 * @route '/admin/catalogo/unidades/buscar'
 */
        buscarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscar.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscar.form = buscarForm
/**
* @see \App\Http\Controllers\Admin\CatalogoController::store
 * @see app/Http/Controllers/Admin/CatalogoController.php:89
 * @route '/admin/catalogo/unidades'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/catalogo/unidades',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CatalogoController::store
 * @see app/Http/Controllers/Admin/CatalogoController.php:89
 * @route '/admin/catalogo/unidades'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CatalogoController::store
 * @see app/Http/Controllers/Admin/CatalogoController.php:89
 * @route '/admin/catalogo/unidades'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\CatalogoController::store
 * @see app/Http/Controllers/Admin/CatalogoController.php:89
 * @route '/admin/catalogo/unidades'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CatalogoController::store
 * @see app/Http/Controllers/Admin/CatalogoController.php:89
 * @route '/admin/catalogo/unidades'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const unidades = {
    update: Object.assign(update, update),
editar: Object.assign(editar, editar),
destroy: Object.assign(destroy, destroy),
buscar: Object.assign(buscar, buscar),
store: Object.assign(store, store),
}

export default unidades