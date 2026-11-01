import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\CatalogoController::index
 * @see app/Http/Controllers/Admin/CatalogoController.php:19
 * @route '/admin/catalogo'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/catalogo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CatalogoController::index
 * @see app/Http/Controllers/Admin/CatalogoController.php:19
 * @route '/admin/catalogo'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CatalogoController::index
 * @see app/Http/Controllers/Admin/CatalogoController.php:19
 * @route '/admin/catalogo'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CatalogoController::index
 * @see app/Http/Controllers/Admin/CatalogoController.php:19
 * @route '/admin/catalogo'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\CatalogoController::index
 * @see app/Http/Controllers/Admin/CatalogoController.php:19
 * @route '/admin/catalogo'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\CatalogoController::index
 * @see app/Http/Controllers/Admin/CatalogoController.php:19
 * @route '/admin/catalogo'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\CatalogoController::index
 * @see app/Http/Controllers/Admin/CatalogoController.php:19
 * @route '/admin/catalogo'
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
* @see \App\Http\Controllers\Admin\CatalogoController::store
 * @see app/Http/Controllers/Admin/CatalogoController.php:44
 * @route '/admin/catalogo'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/catalogo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CatalogoController::store
 * @see app/Http/Controllers/Admin/CatalogoController.php:44
 * @route '/admin/catalogo'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CatalogoController::store
 * @see app/Http/Controllers/Admin/CatalogoController.php:44
 * @route '/admin/catalogo'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\CatalogoController::store
 * @see app/Http/Controllers/Admin/CatalogoController.php:44
 * @route '/admin/catalogo'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CatalogoController::store
 * @see app/Http/Controllers/Admin/CatalogoController.php:44
 * @route '/admin/catalogo'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\CatalogoController::update
 * @see app/Http/Controllers/Admin/CatalogoController.php:62
 * @route '/admin/catalogo/{herramienta}'
 */
export const update = (args: { herramienta: number | { id: number } } | [herramienta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/catalogo/{herramienta}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\CatalogoController::update
 * @see app/Http/Controllers/Admin/CatalogoController.php:62
 * @route '/admin/catalogo/{herramienta}'
 */
update.url = (args: { herramienta: number | { id: number } } | [herramienta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { herramienta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { herramienta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    herramienta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        herramienta: typeof args.herramienta === 'object'
                ? args.herramienta.id
                : args.herramienta,
                }

    return update.definition.url
            .replace('{herramienta}', parsedArgs.herramienta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CatalogoController::update
 * @see app/Http/Controllers/Admin/CatalogoController.php:62
 * @route '/admin/catalogo/{herramienta}'
 */
update.put = (args: { herramienta: number | { id: number } } | [herramienta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\CatalogoController::update
 * @see app/Http/Controllers/Admin/CatalogoController.php:62
 * @route '/admin/catalogo/{herramienta}'
 */
    const updateForm = (args: { herramienta: number | { id: number } } | [herramienta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CatalogoController::update
 * @see app/Http/Controllers/Admin/CatalogoController.php:62
 * @route '/admin/catalogo/{herramienta}'
 */
        updateForm.put = (args: { herramienta: number | { id: number } } | [herramienta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\CatalogoController::destroy
 * @see app/Http/Controllers/Admin/CatalogoController.php:80
 * @route '/admin/catalogo/{herramienta}'
 */
export const destroy = (args: { herramienta: number | { id: number } } | [herramienta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/catalogo/{herramienta}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\CatalogoController::destroy
 * @see app/Http/Controllers/Admin/CatalogoController.php:80
 * @route '/admin/catalogo/{herramienta}'
 */
destroy.url = (args: { herramienta: number | { id: number } } | [herramienta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { herramienta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { herramienta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    herramienta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        herramienta: typeof args.herramienta === 'object'
                ? args.herramienta.id
                : args.herramienta,
                }

    return destroy.definition.url
            .replace('{herramienta}', parsedArgs.herramienta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CatalogoController::destroy
 * @see app/Http/Controllers/Admin/CatalogoController.php:80
 * @route '/admin/catalogo/{herramienta}'
 */
destroy.delete = (args: { herramienta: number | { id: number } } | [herramienta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\CatalogoController::destroy
 * @see app/Http/Controllers/Admin/CatalogoController.php:80
 * @route '/admin/catalogo/{herramienta}'
 */
    const destroyForm = (args: { herramienta: number | { id: number } } | [herramienta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Admin/CatalogoController.php:80
 * @route '/admin/catalogo/{herramienta}'
 */
        destroyForm.delete = (args: { herramienta: number | { id: number } } | [herramienta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\CatalogoController::actualizarEstadoUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:119
 * @route '/admin/catalogo/unidades/{unidad}'
 */
export const actualizarEstadoUnidad = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarEstadoUnidad.url(args, options),
    method: 'patch',
})

actualizarEstadoUnidad.definition = {
    methods: ["patch"],
    url: '/admin/catalogo/unidades/{unidad}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\CatalogoController::actualizarEstadoUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:119
 * @route '/admin/catalogo/unidades/{unidad}'
 */
actualizarEstadoUnidad.url = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return actualizarEstadoUnidad.definition.url
            .replace('{unidad}', parsedArgs.unidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CatalogoController::actualizarEstadoUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:119
 * @route '/admin/catalogo/unidades/{unidad}'
 */
actualizarEstadoUnidad.patch = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarEstadoUnidad.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\CatalogoController::actualizarEstadoUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:119
 * @route '/admin/catalogo/unidades/{unidad}'
 */
    const actualizarEstadoUnidadForm = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarEstadoUnidad.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CatalogoController::actualizarEstadoUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:119
 * @route '/admin/catalogo/unidades/{unidad}'
 */
        actualizarEstadoUnidadForm.patch = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarEstadoUnidad.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizarEstadoUnidad.form = actualizarEstadoUnidadForm
/**
* @see \App\Http\Controllers\Admin\CatalogoController::actualizarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:133
 * @route '/admin/catalogo/unidades/{unidad}/editar'
 */
export const actualizarUnidad = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarUnidad.url(args, options),
    method: 'put',
})

actualizarUnidad.definition = {
    methods: ["put"],
    url: '/admin/catalogo/unidades/{unidad}/editar',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\CatalogoController::actualizarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:133
 * @route '/admin/catalogo/unidades/{unidad}/editar'
 */
actualizarUnidad.url = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return actualizarUnidad.definition.url
            .replace('{unidad}', parsedArgs.unidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CatalogoController::actualizarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:133
 * @route '/admin/catalogo/unidades/{unidad}/editar'
 */
actualizarUnidad.put = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarUnidad.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\CatalogoController::actualizarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:133
 * @route '/admin/catalogo/unidades/{unidad}/editar'
 */
    const actualizarUnidadForm = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarUnidad.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CatalogoController::actualizarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:133
 * @route '/admin/catalogo/unidades/{unidad}/editar'
 */
        actualizarUnidadForm.put = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarUnidad.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizarUnidad.form = actualizarUnidadForm
/**
* @see \App\Http\Controllers\Admin\CatalogoController::eliminarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:171
 * @route '/admin/catalogo/unidades/{unidad}'
 */
export const eliminarUnidad = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminarUnidad.url(args, options),
    method: 'delete',
})

eliminarUnidad.definition = {
    methods: ["delete"],
    url: '/admin/catalogo/unidades/{unidad}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\CatalogoController::eliminarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:171
 * @route '/admin/catalogo/unidades/{unidad}'
 */
eliminarUnidad.url = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return eliminarUnidad.definition.url
            .replace('{unidad}', parsedArgs.unidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CatalogoController::eliminarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:171
 * @route '/admin/catalogo/unidades/{unidad}'
 */
eliminarUnidad.delete = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminarUnidad.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\CatalogoController::eliminarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:171
 * @route '/admin/catalogo/unidades/{unidad}'
 */
    const eliminarUnidadForm = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: eliminarUnidad.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CatalogoController::eliminarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:171
 * @route '/admin/catalogo/unidades/{unidad}'
 */
        eliminarUnidadForm.delete = (args: { unidad: number | { id: number } } | [unidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: eliminarUnidad.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    eliminarUnidad.form = eliminarUnidadForm
/**
* @see \App\Http\Controllers\Admin\CatalogoController::buscarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:208
 * @route '/admin/catalogo/unidades/buscar'
 */
export const buscarUnidad = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarUnidad.url(options),
    method: 'get',
})

buscarUnidad.definition = {
    methods: ["get","head"],
    url: '/admin/catalogo/unidades/buscar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CatalogoController::buscarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:208
 * @route '/admin/catalogo/unidades/buscar'
 */
buscarUnidad.url = (options?: RouteQueryOptions) => {
    return buscarUnidad.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CatalogoController::buscarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:208
 * @route '/admin/catalogo/unidades/buscar'
 */
buscarUnidad.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarUnidad.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CatalogoController::buscarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:208
 * @route '/admin/catalogo/unidades/buscar'
 */
buscarUnidad.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarUnidad.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\CatalogoController::buscarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:208
 * @route '/admin/catalogo/unidades/buscar'
 */
    const buscarUnidadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarUnidad.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\CatalogoController::buscarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:208
 * @route '/admin/catalogo/unidades/buscar'
 */
        buscarUnidadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarUnidad.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\CatalogoController::buscarUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:208
 * @route '/admin/catalogo/unidades/buscar'
 */
        buscarUnidadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarUnidad.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarUnidad.form = buscarUnidadForm
/**
* @see \App\Http\Controllers\Admin\CatalogoController::storeUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:89
 * @route '/admin/catalogo/unidades'
 */
export const storeUnidad = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeUnidad.url(options),
    method: 'post',
})

storeUnidad.definition = {
    methods: ["post"],
    url: '/admin/catalogo/unidades',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CatalogoController::storeUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:89
 * @route '/admin/catalogo/unidades'
 */
storeUnidad.url = (options?: RouteQueryOptions) => {
    return storeUnidad.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CatalogoController::storeUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:89
 * @route '/admin/catalogo/unidades'
 */
storeUnidad.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeUnidad.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\CatalogoController::storeUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:89
 * @route '/admin/catalogo/unidades'
 */
    const storeUnidadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeUnidad.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CatalogoController::storeUnidad
 * @see app/Http/Controllers/Admin/CatalogoController.php:89
 * @route '/admin/catalogo/unidades'
 */
        storeUnidadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeUnidad.url(options),
            method: 'post',
        })
    
    storeUnidad.form = storeUnidadForm
const CatalogoController = { index, store, update, destroy, actualizarEstadoUnidad, actualizarUnidad, eliminarUnidad, buscarUnidad, storeUnidad }

export default CatalogoController