import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import unidades from './unidades'
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
const catalogo = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
unidades: Object.assign(unidades, unidades),
}

export default catalogo