import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PrestacionController::index
 * @see app/Http/Controllers/Admin/PrestacionController.php:19
 * @route '/admin/prestaciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/prestaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PrestacionController::index
 * @see app/Http/Controllers/Admin/PrestacionController.php:19
 * @route '/admin/prestaciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PrestacionController::index
 * @see app/Http/Controllers/Admin/PrestacionController.php:19
 * @route '/admin/prestaciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PrestacionController::index
 * @see app/Http/Controllers/Admin/PrestacionController.php:19
 * @route '/admin/prestaciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PrestacionController::index
 * @see app/Http/Controllers/Admin/PrestacionController.php:19
 * @route '/admin/prestaciones'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PrestacionController::index
 * @see app/Http/Controllers/Admin/PrestacionController.php:19
 * @route '/admin/prestaciones'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PrestacionController::index
 * @see app/Http/Controllers/Admin/PrestacionController.php:19
 * @route '/admin/prestaciones'
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
* @see \App\Http\Controllers\Admin\PrestacionController::create
 * @see app/Http/Controllers/Admin/PrestacionController.php:46
 * @route '/admin/prestaciones/crear'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/prestaciones/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PrestacionController::create
 * @see app/Http/Controllers/Admin/PrestacionController.php:46
 * @route '/admin/prestaciones/crear'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PrestacionController::create
 * @see app/Http/Controllers/Admin/PrestacionController.php:46
 * @route '/admin/prestaciones/crear'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PrestacionController::create
 * @see app/Http/Controllers/Admin/PrestacionController.php:46
 * @route '/admin/prestaciones/crear'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PrestacionController::create
 * @see app/Http/Controllers/Admin/PrestacionController.php:46
 * @route '/admin/prestaciones/crear'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PrestacionController::create
 * @see app/Http/Controllers/Admin/PrestacionController.php:46
 * @route '/admin/prestaciones/crear'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PrestacionController::create
 * @see app/Http/Controllers/Admin/PrestacionController.php:46
 * @route '/admin/prestaciones/crear'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\PrestacionController::store
 * @see app/Http/Controllers/Admin/PrestacionController.php:86
 * @route '/admin/prestaciones'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/prestaciones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PrestacionController::store
 * @see app/Http/Controllers/Admin/PrestacionController.php:86
 * @route '/admin/prestaciones'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PrestacionController::store
 * @see app/Http/Controllers/Admin/PrestacionController.php:86
 * @route '/admin/prestaciones'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\PrestacionController::store
 * @see app/Http/Controllers/Admin/PrestacionController.php:86
 * @route '/admin/prestaciones'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PrestacionController::store
 * @see app/Http/Controllers/Admin/PrestacionController.php:86
 * @route '/admin/prestaciones'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\PrestacionController::herramientas
 * @see app/Http/Controllers/Admin/PrestacionController.php:95
 * @route '/admin/prestaciones/laboratorios/{subLaboratorio}/herramientas'
 */
export const herramientas = (args: { subLaboratorio: number | { id: number } } | [subLaboratorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: herramientas.url(args, options),
    method: 'get',
})

herramientas.definition = {
    methods: ["get","head"],
    url: '/admin/prestaciones/laboratorios/{subLaboratorio}/herramientas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PrestacionController::herramientas
 * @see app/Http/Controllers/Admin/PrestacionController.php:95
 * @route '/admin/prestaciones/laboratorios/{subLaboratorio}/herramientas'
 */
herramientas.url = (args: { subLaboratorio: number | { id: number } } | [subLaboratorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subLaboratorio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subLaboratorio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subLaboratorio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subLaboratorio: typeof args.subLaboratorio === 'object'
                ? args.subLaboratorio.id
                : args.subLaboratorio,
                }

    return herramientas.definition.url
            .replace('{subLaboratorio}', parsedArgs.subLaboratorio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PrestacionController::herramientas
 * @see app/Http/Controllers/Admin/PrestacionController.php:95
 * @route '/admin/prestaciones/laboratorios/{subLaboratorio}/herramientas'
 */
herramientas.get = (args: { subLaboratorio: number | { id: number } } | [subLaboratorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: herramientas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PrestacionController::herramientas
 * @see app/Http/Controllers/Admin/PrestacionController.php:95
 * @route '/admin/prestaciones/laboratorios/{subLaboratorio}/herramientas'
 */
herramientas.head = (args: { subLaboratorio: number | { id: number } } | [subLaboratorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: herramientas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PrestacionController::herramientas
 * @see app/Http/Controllers/Admin/PrestacionController.php:95
 * @route '/admin/prestaciones/laboratorios/{subLaboratorio}/herramientas'
 */
    const herramientasForm = (args: { subLaboratorio: number | { id: number } } | [subLaboratorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: herramientas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PrestacionController::herramientas
 * @see app/Http/Controllers/Admin/PrestacionController.php:95
 * @route '/admin/prestaciones/laboratorios/{subLaboratorio}/herramientas'
 */
        herramientasForm.get = (args: { subLaboratorio: number | { id: number } } | [subLaboratorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: herramientas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PrestacionController::herramientas
 * @see app/Http/Controllers/Admin/PrestacionController.php:95
 * @route '/admin/prestaciones/laboratorios/{subLaboratorio}/herramientas'
 */
        herramientasForm.head = (args: { subLaboratorio: number | { id: number } } | [subLaboratorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: herramientas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    herramientas.form = herramientasForm
/**
* @see \App\Http\Controllers\Admin\PrestacionController::devoluciones
 * @see app/Http/Controllers/Admin/PrestacionController.php:104
 * @route '/admin/prestaciones/devoluciones'
 */
export const devoluciones = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: devoluciones.url(options),
    method: 'get',
})

devoluciones.definition = {
    methods: ["get","head"],
    url: '/admin/prestaciones/devoluciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PrestacionController::devoluciones
 * @see app/Http/Controllers/Admin/PrestacionController.php:104
 * @route '/admin/prestaciones/devoluciones'
 */
devoluciones.url = (options?: RouteQueryOptions) => {
    return devoluciones.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PrestacionController::devoluciones
 * @see app/Http/Controllers/Admin/PrestacionController.php:104
 * @route '/admin/prestaciones/devoluciones'
 */
devoluciones.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: devoluciones.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PrestacionController::devoluciones
 * @see app/Http/Controllers/Admin/PrestacionController.php:104
 * @route '/admin/prestaciones/devoluciones'
 */
devoluciones.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: devoluciones.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PrestacionController::devoluciones
 * @see app/Http/Controllers/Admin/PrestacionController.php:104
 * @route '/admin/prestaciones/devoluciones'
 */
    const devolucionesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: devoluciones.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PrestacionController::devoluciones
 * @see app/Http/Controllers/Admin/PrestacionController.php:104
 * @route '/admin/prestaciones/devoluciones'
 */
        devolucionesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: devoluciones.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PrestacionController::devoluciones
 * @see app/Http/Controllers/Admin/PrestacionController.php:104
 * @route '/admin/prestaciones/devoluciones'
 */
        devolucionesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: devoluciones.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    devoluciones.form = devolucionesForm
/**
* @see \App\Http\Controllers\Admin\PrestacionController::devolver
 * @see app/Http/Controllers/Admin/PrestacionController.php:126
 * @route '/admin/prestaciones/{prestamo}/devolver'
 */
export const devolver = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: devolver.url(args, options),
    method: 'put',
})

devolver.definition = {
    methods: ["put"],
    url: '/admin/prestaciones/{prestamo}/devolver',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\PrestacionController::devolver
 * @see app/Http/Controllers/Admin/PrestacionController.php:126
 * @route '/admin/prestaciones/{prestamo}/devolver'
 */
devolver.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return devolver.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PrestacionController::devolver
 * @see app/Http/Controllers/Admin/PrestacionController.php:126
 * @route '/admin/prestaciones/{prestamo}/devolver'
 */
devolver.put = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: devolver.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\PrestacionController::devolver
 * @see app/Http/Controllers/Admin/PrestacionController.php:126
 * @route '/admin/prestaciones/{prestamo}/devolver'
 */
    const devolverForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: devolver.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PrestacionController::devolver
 * @see app/Http/Controllers/Admin/PrestacionController.php:126
 * @route '/admin/prestaciones/{prestamo}/devolver'
 */
        devolverForm.put = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: devolver.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    devolver.form = devolverForm
/**
* @see \App\Http\Controllers\Admin\PrestacionController::escannerRemoto
 * @see app/Http/Controllers/Admin/PrestacionController.php:202
 * @route '/admin/prestaciones/escanner-remoto'
 */
export const escannerRemoto = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: escannerRemoto.url(options),
    method: 'get',
})

escannerRemoto.definition = {
    methods: ["get","head"],
    url: '/admin/prestaciones/escanner-remoto',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PrestacionController::escannerRemoto
 * @see app/Http/Controllers/Admin/PrestacionController.php:202
 * @route '/admin/prestaciones/escanner-remoto'
 */
escannerRemoto.url = (options?: RouteQueryOptions) => {
    return escannerRemoto.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PrestacionController::escannerRemoto
 * @see app/Http/Controllers/Admin/PrestacionController.php:202
 * @route '/admin/prestaciones/escanner-remoto'
 */
escannerRemoto.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: escannerRemoto.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PrestacionController::escannerRemoto
 * @see app/Http/Controllers/Admin/PrestacionController.php:202
 * @route '/admin/prestaciones/escanner-remoto'
 */
escannerRemoto.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: escannerRemoto.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PrestacionController::escannerRemoto
 * @see app/Http/Controllers/Admin/PrestacionController.php:202
 * @route '/admin/prestaciones/escanner-remoto'
 */
    const escannerRemotoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: escannerRemoto.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PrestacionController::escannerRemoto
 * @see app/Http/Controllers/Admin/PrestacionController.php:202
 * @route '/admin/prestaciones/escanner-remoto'
 */
        escannerRemotoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: escannerRemoto.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PrestacionController::escannerRemoto
 * @see app/Http/Controllers/Admin/PrestacionController.php:202
 * @route '/admin/prestaciones/escanner-remoto'
 */
        escannerRemotoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: escannerRemoto.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    escannerRemoto.form = escannerRemotoForm
/**
* @see \App\Http\Controllers\Admin\PrestacionController::historial
 * @see app/Http/Controllers/Admin/PrestacionController.php:142
 * @route '/admin/prestaciones/historial'
 */
export const historial = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(options),
    method: 'get',
})

historial.definition = {
    methods: ["get","head"],
    url: '/admin/prestaciones/historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PrestacionController::historial
 * @see app/Http/Controllers/Admin/PrestacionController.php:142
 * @route '/admin/prestaciones/historial'
 */
historial.url = (options?: RouteQueryOptions) => {
    return historial.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PrestacionController::historial
 * @see app/Http/Controllers/Admin/PrestacionController.php:142
 * @route '/admin/prestaciones/historial'
 */
historial.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PrestacionController::historial
 * @see app/Http/Controllers/Admin/PrestacionController.php:142
 * @route '/admin/prestaciones/historial'
 */
historial.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historial.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PrestacionController::historial
 * @see app/Http/Controllers/Admin/PrestacionController.php:142
 * @route '/admin/prestaciones/historial'
 */
    const historialForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historial.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PrestacionController::historial
 * @see app/Http/Controllers/Admin/PrestacionController.php:142
 * @route '/admin/prestaciones/historial'
 */
        historialForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historial.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PrestacionController::historial
 * @see app/Http/Controllers/Admin/PrestacionController.php:142
 * @route '/admin/prestaciones/historial'
 */
        historialForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historial.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historial.form = historialForm
const PrestacionController = { index, create, store, herramientas, devoluciones, devolver, escannerRemoto, historial }

export default PrestacionController