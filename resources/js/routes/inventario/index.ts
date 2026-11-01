import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\InventarioSubLaboratorioController::index
 * @see app/Http/Controllers/Admin/InventarioSubLaboratorioController.php:22
 * @route '/admin/inventario'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/inventario',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InventarioSubLaboratorioController::index
 * @see app/Http/Controllers/Admin/InventarioSubLaboratorioController.php:22
 * @route '/admin/inventario'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InventarioSubLaboratorioController::index
 * @see app/Http/Controllers/Admin/InventarioSubLaboratorioController.php:22
 * @route '/admin/inventario'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\InventarioSubLaboratorioController::index
 * @see app/Http/Controllers/Admin/InventarioSubLaboratorioController.php:22
 * @route '/admin/inventario'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\InventarioSubLaboratorioController::index
 * @see app/Http/Controllers/Admin/InventarioSubLaboratorioController.php:22
 * @route '/admin/inventario'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\InventarioSubLaboratorioController::index
 * @see app/Http/Controllers/Admin/InventarioSubLaboratorioController.php:22
 * @route '/admin/inventario'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\InventarioSubLaboratorioController::index
 * @see app/Http/Controllers/Admin/InventarioSubLaboratorioController.php:22
 * @route '/admin/inventario'
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
* @see \App\Http\Controllers\Admin\InventarioSubLaboratorioController::transferir
 * @see app/Http/Controllers/Admin/InventarioSubLaboratorioController.php:36
 * @route '/admin/inventario/transferir'
 */
export const transferir = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transferir.url(options),
    method: 'post',
})

transferir.definition = {
    methods: ["post"],
    url: '/admin/inventario/transferir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\InventarioSubLaboratorioController::transferir
 * @see app/Http/Controllers/Admin/InventarioSubLaboratorioController.php:36
 * @route '/admin/inventario/transferir'
 */
transferir.url = (options?: RouteQueryOptions) => {
    return transferir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InventarioSubLaboratorioController::transferir
 * @see app/Http/Controllers/Admin/InventarioSubLaboratorioController.php:36
 * @route '/admin/inventario/transferir'
 */
transferir.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transferir.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\InventarioSubLaboratorioController::transferir
 * @see app/Http/Controllers/Admin/InventarioSubLaboratorioController.php:36
 * @route '/admin/inventario/transferir'
 */
    const transferirForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: transferir.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\InventarioSubLaboratorioController::transferir
 * @see app/Http/Controllers/Admin/InventarioSubLaboratorioController.php:36
 * @route '/admin/inventario/transferir'
 */
        transferirForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: transferir.url(options),
            method: 'post',
        })
    
    transferir.form = transferirForm
const inventario = {
    index: Object.assign(index, index),
transferir: Object.assign(transferir, transferir),
}

export default inventario