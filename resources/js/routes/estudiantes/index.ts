import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import importMethod7367d2 from './import'
/**
* @see \App\Http\Controllers\Admin\EstudianteController::index
 * @see app/Http/Controllers/Admin/EstudianteController.php:19
 * @route '/admin/estudiantes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/estudiantes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\EstudianteController::index
 * @see app/Http/Controllers/Admin/EstudianteController.php:19
 * @route '/admin/estudiantes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EstudianteController::index
 * @see app/Http/Controllers/Admin/EstudianteController.php:19
 * @route '/admin/estudiantes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\EstudianteController::index
 * @see app/Http/Controllers/Admin/EstudianteController.php:19
 * @route '/admin/estudiantes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\EstudianteController::index
 * @see app/Http/Controllers/Admin/EstudianteController.php:19
 * @route '/admin/estudiantes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\EstudianteController::index
 * @see app/Http/Controllers/Admin/EstudianteController.php:19
 * @route '/admin/estudiantes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\EstudianteController::index
 * @see app/Http/Controllers/Admin/EstudianteController.php:19
 * @route '/admin/estudiantes'
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
* @see \App\Http\Controllers\Admin\EstudianteImportController::importMethod
 * @see app/Http/Controllers/Admin/EstudianteImportController.php:18
 * @route '/admin/estudiantes/import'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importMethod.url(options),
    method: 'get',
})

importMethod.definition = {
    methods: ["get","head"],
    url: '/admin/estudiantes/import',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\EstudianteImportController::importMethod
 * @see app/Http/Controllers/Admin/EstudianteImportController.php:18
 * @route '/admin/estudiantes/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EstudianteImportController::importMethod
 * @see app/Http/Controllers/Admin/EstudianteImportController.php:18
 * @route '/admin/estudiantes/import'
 */
importMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\EstudianteImportController::importMethod
 * @see app/Http/Controllers/Admin/EstudianteImportController.php:18
 * @route '/admin/estudiantes/import'
 */
importMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: importMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\EstudianteImportController::importMethod
 * @see app/Http/Controllers/Admin/EstudianteImportController.php:18
 * @route '/admin/estudiantes/import'
 */
    const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: importMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\EstudianteImportController::importMethod
 * @see app/Http/Controllers/Admin/EstudianteImportController.php:18
 * @route '/admin/estudiantes/import'
 */
        importMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\EstudianteImportController::importMethod
 * @see app/Http/Controllers/Admin/EstudianteImportController.php:18
 * @route '/admin/estudiantes/import'
 */
        importMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    importMethod.form = importMethodForm
/**
* @see \App\Http\Controllers\Admin\EstudianteController::create
 * @see app/Http/Controllers/Admin/EstudianteController.php:31
 * @route '/admin/estudiantes/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/estudiantes/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\EstudianteController::create
 * @see app/Http/Controllers/Admin/EstudianteController.php:31
 * @route '/admin/estudiantes/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EstudianteController::create
 * @see app/Http/Controllers/Admin/EstudianteController.php:31
 * @route '/admin/estudiantes/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\EstudianteController::create
 * @see app/Http/Controllers/Admin/EstudianteController.php:31
 * @route '/admin/estudiantes/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\EstudianteController::create
 * @see app/Http/Controllers/Admin/EstudianteController.php:31
 * @route '/admin/estudiantes/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\EstudianteController::create
 * @see app/Http/Controllers/Admin/EstudianteController.php:31
 * @route '/admin/estudiantes/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\EstudianteController::create
 * @see app/Http/Controllers/Admin/EstudianteController.php:31
 * @route '/admin/estudiantes/create'
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
* @see \App\Http\Controllers\Admin\EstudianteController::store
 * @see app/Http/Controllers/Admin/EstudianteController.php:36
 * @route '/admin/estudiantes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/estudiantes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\EstudianteController::store
 * @see app/Http/Controllers/Admin/EstudianteController.php:36
 * @route '/admin/estudiantes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EstudianteController::store
 * @see app/Http/Controllers/Admin/EstudianteController.php:36
 * @route '/admin/estudiantes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\EstudianteController::store
 * @see app/Http/Controllers/Admin/EstudianteController.php:36
 * @route '/admin/estudiantes'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\EstudianteController::store
 * @see app/Http/Controllers/Admin/EstudianteController.php:36
 * @route '/admin/estudiantes'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\EstudianteController::update
 * @see app/Http/Controllers/Admin/EstudianteController.php:54
 * @route '/admin/estudiantes/{estudiante}'
 */
export const update = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/estudiantes/{estudiante}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\EstudianteController::update
 * @see app/Http/Controllers/Admin/EstudianteController.php:54
 * @route '/admin/estudiantes/{estudiante}'
 */
update.url = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estudiante: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { estudiante: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    estudiante: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estudiante: typeof args.estudiante === 'object'
                ? args.estudiante.id
                : args.estudiante,
                }

    return update.definition.url
            .replace('{estudiante}', parsedArgs.estudiante.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EstudianteController::update
 * @see app/Http/Controllers/Admin/EstudianteController.php:54
 * @route '/admin/estudiantes/{estudiante}'
 */
update.put = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\EstudianteController::update
 * @see app/Http/Controllers/Admin/EstudianteController.php:54
 * @route '/admin/estudiantes/{estudiante}'
 */
    const updateForm = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\EstudianteController::update
 * @see app/Http/Controllers/Admin/EstudianteController.php:54
 * @route '/admin/estudiantes/{estudiante}'
 */
        updateForm.put = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\EstudianteController::destroy
 * @see app/Http/Controllers/Admin/EstudianteController.php:61
 * @route '/admin/estudiantes/{estudiante}'
 */
export const destroy = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/estudiantes/{estudiante}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\EstudianteController::destroy
 * @see app/Http/Controllers/Admin/EstudianteController.php:61
 * @route '/admin/estudiantes/{estudiante}'
 */
destroy.url = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estudiante: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { estudiante: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    estudiante: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estudiante: typeof args.estudiante === 'object'
                ? args.estudiante.id
                : args.estudiante,
                }

    return destroy.definition.url
            .replace('{estudiante}', parsedArgs.estudiante.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EstudianteController::destroy
 * @see app/Http/Controllers/Admin/EstudianteController.php:61
 * @route '/admin/estudiantes/{estudiante}'
 */
destroy.delete = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\EstudianteController::destroy
 * @see app/Http/Controllers/Admin/EstudianteController.php:61
 * @route '/admin/estudiantes/{estudiante}'
 */
    const destroyForm = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\EstudianteController::destroy
 * @see app/Http/Controllers/Admin/EstudianteController.php:61
 * @route '/admin/estudiantes/{estudiante}'
 */
        destroyForm.delete = (args: { estudiante: number | { id: number } } | [estudiante: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
    index: Object.assign(index, index),
import: Object.assign(importMethod, importMethod7367d2),
create: Object.assign(create, create),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default estudiantes