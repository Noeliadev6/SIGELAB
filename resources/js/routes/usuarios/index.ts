import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\UsuarioController::index
 * @see app/Http/Controllers/Admin/UsuarioController.php:17
 * @route '/admin/usuarios'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/usuarios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UsuarioController::index
 * @see app/Http/Controllers/Admin/UsuarioController.php:17
 * @route '/admin/usuarios'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UsuarioController::index
 * @see app/Http/Controllers/Admin/UsuarioController.php:17
 * @route '/admin/usuarios'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\UsuarioController::index
 * @see app/Http/Controllers/Admin/UsuarioController.php:17
 * @route '/admin/usuarios'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\UsuarioController::index
 * @see app/Http/Controllers/Admin/UsuarioController.php:17
 * @route '/admin/usuarios'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\UsuarioController::index
 * @see app/Http/Controllers/Admin/UsuarioController.php:17
 * @route '/admin/usuarios'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\UsuarioController::index
 * @see app/Http/Controllers/Admin/UsuarioController.php:17
 * @route '/admin/usuarios'
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
* @see \App\Http\Controllers\Admin\UsuarioController::create
 * @see app/Http/Controllers/Admin/UsuarioController.php:37
 * @route '/admin/usuarios/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/usuarios/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UsuarioController::create
 * @see app/Http/Controllers/Admin/UsuarioController.php:37
 * @route '/admin/usuarios/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UsuarioController::create
 * @see app/Http/Controllers/Admin/UsuarioController.php:37
 * @route '/admin/usuarios/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\UsuarioController::create
 * @see app/Http/Controllers/Admin/UsuarioController.php:37
 * @route '/admin/usuarios/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\UsuarioController::create
 * @see app/Http/Controllers/Admin/UsuarioController.php:37
 * @route '/admin/usuarios/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\UsuarioController::create
 * @see app/Http/Controllers/Admin/UsuarioController.php:37
 * @route '/admin/usuarios/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\UsuarioController::create
 * @see app/Http/Controllers/Admin/UsuarioController.php:37
 * @route '/admin/usuarios/create'
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
* @see \App\Http\Controllers\Admin\UsuarioController::store
 * @see app/Http/Controllers/Admin/UsuarioController.php:44
 * @route '/admin/usuarios'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/usuarios',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UsuarioController::store
 * @see app/Http/Controllers/Admin/UsuarioController.php:44
 * @route '/admin/usuarios'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UsuarioController::store
 * @see app/Http/Controllers/Admin/UsuarioController.php:44
 * @route '/admin/usuarios'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\UsuarioController::store
 * @see app/Http/Controllers/Admin/UsuarioController.php:44
 * @route '/admin/usuarios'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UsuarioController::store
 * @see app/Http/Controllers/Admin/UsuarioController.php:44
 * @route '/admin/usuarios'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\UsuarioController::show
 * @see app/Http/Controllers/Admin/UsuarioController.php:0
 * @route '/admin/usuarios/{usuario}'
 */
export const show = (args: { usuario: string | number } | [usuario: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/usuarios/{usuario}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UsuarioController::show
 * @see app/Http/Controllers/Admin/UsuarioController.php:0
 * @route '/admin/usuarios/{usuario}'
 */
show.url = (args: { usuario: string | number } | [usuario: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { usuario: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    usuario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        usuario: args.usuario,
                }

    return show.definition.url
            .replace('{usuario}', parsedArgs.usuario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UsuarioController::show
 * @see app/Http/Controllers/Admin/UsuarioController.php:0
 * @route '/admin/usuarios/{usuario}'
 */
show.get = (args: { usuario: string | number } | [usuario: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\UsuarioController::show
 * @see app/Http/Controllers/Admin/UsuarioController.php:0
 * @route '/admin/usuarios/{usuario}'
 */
show.head = (args: { usuario: string | number } | [usuario: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\UsuarioController::show
 * @see app/Http/Controllers/Admin/UsuarioController.php:0
 * @route '/admin/usuarios/{usuario}'
 */
    const showForm = (args: { usuario: string | number } | [usuario: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\UsuarioController::show
 * @see app/Http/Controllers/Admin/UsuarioController.php:0
 * @route '/admin/usuarios/{usuario}'
 */
        showForm.get = (args: { usuario: string | number } | [usuario: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\UsuarioController::show
 * @see app/Http/Controllers/Admin/UsuarioController.php:0
 * @route '/admin/usuarios/{usuario}'
 */
        showForm.head = (args: { usuario: string | number } | [usuario: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Admin\UsuarioController::edit
 * @see app/Http/Controllers/Admin/UsuarioController.php:59
 * @route '/admin/usuarios/{usuario}/edit'
 */
export const edit = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/usuarios/{usuario}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UsuarioController::edit
 * @see app/Http/Controllers/Admin/UsuarioController.php:59
 * @route '/admin/usuarios/{usuario}/edit'
 */
edit.url = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { usuario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { usuario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    usuario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        usuario: typeof args.usuario === 'object'
                ? args.usuario.id
                : args.usuario,
                }

    return edit.definition.url
            .replace('{usuario}', parsedArgs.usuario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UsuarioController::edit
 * @see app/Http/Controllers/Admin/UsuarioController.php:59
 * @route '/admin/usuarios/{usuario}/edit'
 */
edit.get = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\UsuarioController::edit
 * @see app/Http/Controllers/Admin/UsuarioController.php:59
 * @route '/admin/usuarios/{usuario}/edit'
 */
edit.head = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\UsuarioController::edit
 * @see app/Http/Controllers/Admin/UsuarioController.php:59
 * @route '/admin/usuarios/{usuario}/edit'
 */
    const editForm = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\UsuarioController::edit
 * @see app/Http/Controllers/Admin/UsuarioController.php:59
 * @route '/admin/usuarios/{usuario}/edit'
 */
        editForm.get = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\UsuarioController::edit
 * @see app/Http/Controllers/Admin/UsuarioController.php:59
 * @route '/admin/usuarios/{usuario}/edit'
 */
        editForm.head = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\UsuarioController::update
 * @see app/Http/Controllers/Admin/UsuarioController.php:69
 * @route '/admin/usuarios/{usuario}'
 */
export const update = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/usuarios/{usuario}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\UsuarioController::update
 * @see app/Http/Controllers/Admin/UsuarioController.php:69
 * @route '/admin/usuarios/{usuario}'
 */
update.url = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { usuario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { usuario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    usuario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        usuario: typeof args.usuario === 'object'
                ? args.usuario.id
                : args.usuario,
                }

    return update.definition.url
            .replace('{usuario}', parsedArgs.usuario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UsuarioController::update
 * @see app/Http/Controllers/Admin/UsuarioController.php:69
 * @route '/admin/usuarios/{usuario}'
 */
update.put = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\UsuarioController::update
 * @see app/Http/Controllers/Admin/UsuarioController.php:69
 * @route '/admin/usuarios/{usuario}'
 */
update.patch = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\UsuarioController::update
 * @see app/Http/Controllers/Admin/UsuarioController.php:69
 * @route '/admin/usuarios/{usuario}'
 */
    const updateForm = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UsuarioController::update
 * @see app/Http/Controllers/Admin/UsuarioController.php:69
 * @route '/admin/usuarios/{usuario}'
 */
        updateForm.put = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\UsuarioController::update
 * @see app/Http/Controllers/Admin/UsuarioController.php:69
 * @route '/admin/usuarios/{usuario}'
 */
        updateForm.patch = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\UsuarioController::destroy
 * @see app/Http/Controllers/Admin/UsuarioController.php:88
 * @route '/admin/usuarios/{usuario}'
 */
export const destroy = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/usuarios/{usuario}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\UsuarioController::destroy
 * @see app/Http/Controllers/Admin/UsuarioController.php:88
 * @route '/admin/usuarios/{usuario}'
 */
destroy.url = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { usuario: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { usuario: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    usuario: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        usuario: typeof args.usuario === 'object'
                ? args.usuario.id
                : args.usuario,
                }

    return destroy.definition.url
            .replace('{usuario}', parsedArgs.usuario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UsuarioController::destroy
 * @see app/Http/Controllers/Admin/UsuarioController.php:88
 * @route '/admin/usuarios/{usuario}'
 */
destroy.delete = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\UsuarioController::destroy
 * @see app/Http/Controllers/Admin/UsuarioController.php:88
 * @route '/admin/usuarios/{usuario}'
 */
    const destroyForm = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UsuarioController::destroy
 * @see app/Http/Controllers/Admin/UsuarioController.php:88
 * @route '/admin/usuarios/{usuario}'
 */
        destroyForm.delete = (args: { usuario: number | { id: number } } | [usuario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const usuarios = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default usuarios