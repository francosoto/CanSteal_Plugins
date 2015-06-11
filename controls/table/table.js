steal(
	'lib'
,	'can/control'
,	'can/observe'
,	'can/view'
,	'can/view/mustache'
,	'can/construct/super'
,	'can/construct/proxy'
,	'can/control/plugin'
,	'plugin'
,	'controls/table/table.css'
,	'controls/pagination'
,	'controls/searcher'
,	'can/observe/sort'
).then(
	function()
	{
		can.Control(
			'Sigma.Table'
		,	{
				defaults:
				{
					/*
						view: Vista de la tabla
						paginable: Objeto {ipp: 10} (Items Por Pagina) o false si no tiene paginador
						view_pages: Vista opcional para el paginador
						sorteable: Bool que determina si es o no sorteable (Si es sorteable se buscaran la clase sorteable en los header de los campos, aquellos que la tengan seran sorteables).
						data: Datos para la tabla o una funcion que retorne los datos (Puede ser deferred o no)
	
						PAGINADOR
						El manejor de las paginas funciona asi...

						Si tiene datos se realiza un filtro sobre los datos, mostrando segun un offset y limit ciertos datos.
						Si tiene una funcion, se pasan los parametros offset y limit para que la funciona acote el resultado.
						
						SORTS
						Para incluir un sortBy debe de existir la clase "sorteable" en el header del campo

						El manejador de sorts funciona asi...
						
						Si tiene datos se realiza un can.sortBy sobre los datos y se reorganiza la tabla.
						Si tiene una funcion se pasa el parametro sortBy para que la funcion reordene la data.


						IMPORTANTE: los datos del paginador (offset y limit) y del sorter (sortBy) se exitienden a los datos de la funcion, es decir, que la funcion debe soportar ambos parametros!
						
						{
							offset:	0
						,	limit:	0
						,	sort:
							{
								by: 'nombre'
							,	order: asc || desc
							}
						}

					*/
					view:			'views/table/init.mustache'
				,	view_pages:		'views/table/pages.mustache'
				,	view_error:		'views/control/error.mustache'
				,	view_loading:	'views/control/loading.mustache'
				,	paginable:		false
				,	sorteable:		false
				,	searcheable:	false
				,  	scrollable:    	false
				,	autoUpdate:		true
				,	index:			false
				,	data:			undefined
				,	queries:
					{
						pagination: undefined
					,	sort: undefined
					,	query: undefined
					}
				}
			}
		,	{
				init: function(element,options)
				{
					can.each(
						this.options
					,	this.proxy(
							function(val,prop)
							{
								if(/^view/.test(prop) && val)
									this.options[prop]=steal.idToUri(val).path
							}
						)
					)

					this.table_data
					=	new can.Observe({items: [], count: 0})

					this._render_loading()

					this._render_table()
				}

			,	_render_loading: function()
				{
					can.append(
						this.element
					,	can.view(
							this.options.view_loading
						)
					)
				}

			,	_render_loading_tr: function()
				{			
					if(this.element)
					{
						can.append(
							can.$('<td>')
								.attr(
									'colspan'
								,	this.element.length > 0
									?	this.element
											.find('table thead tr th')
												.length
									: 	1
								)
								.appendTo(
									can.$('<tr>')
										.addClass('loading')
										.append(
										)
										.appendTo(
											this
												.element
													.find('table tbody')
										)
								)
						,	can.view(
								this.options.view_loading
							)
						)
					}
				}

			,	_remove_loading_tr: function()
				{
					if(this.element)
						this
							.element
								.find('table tbody tr.loading')
									.remove()
				}

			,	_render_table: function()
				{
					this._clean(this.element)

					can.append(
						this.element
					,	can.view(
							this.options.view
						,	this.table_data
						)
					)


					if	(this.options.searcheable)
						this._render_searcheable()

					if	(this.options.sorteable)
						this._render_sorteable()

					if	(this.options.paginable)
					{
						this.options.queries.pagination.offset = 0
						this._render_paginable()
					}

					else
		             	if (this.options.scrollable)
							this._render_scrollable()

					this._refresh_data(can.proxy(this._new_data,this))
				}

			,	_render_searcheable: function()
				{
					this.Searcher
					=	new	Sigma.Searcher(
							can.$('<div class="table-searcher">')
								.prependTo(
									this.element
								)
						,	{
								onQuickSearch:		can.proxy(this._search_query,this)
							,	onAdvancedSearch:	can.proxy(this._update_query,this)
							,	onBeforeQuick: 		this.options.onBeforeQuick
							,	onBeforeAdvaced:	this.options.onBeforeAdvanced
							,	searchKey:			this.options.searchKey
							,	onSuccess:			this.options.onSuccess
							,	onFail:				this.options.onFail	
													?	this.options.onFail
													: 	can.proxy(this._remove_loading_tr,this)
							,	data:
								{
									advanced:	this.options.advanced
								}
							}
						)
				}

			,	_render_sorteable: function()
				{
					this
						.element
							.find('table thead tr th.sorteable')
								.each(
									can.proxy(this._make_sorteable,this)
								)
				}

			,	_make_sorteable: function(index,th)
				{
					var	$sorts
					=	can.$('<span>')
							.addClass('pull-right')
					,	$text
					=	can.$('<span>')
							.html(
								can.$(th).html()
							)

					can.$('<i>')
						.addClass('fa fa-sort-desc fa-lg')
						.appendTo(
							$sorts
						)
					
					can.$('<i>')
						.addClass('fa fa-sort-asc fa-lg')
						.appendTo(
							$sorts
						)

					can.$(th)
						.empty()

					$text
						.appendTo(
							can.$(th)
						)

					$sorts
						.appendTo(
							can.$(th)
						)
				}

			,	'.fa-sort-asc:not(".active") click': function(el,ev)
				{
					this._enable_sort(el,'asc')
				}

			,	'.fa-sort-desc:not(".active") click': function(el,ev)
				{
					this._enable_sort(el,'desc')
				}

			,	_enable_sort: function(el,order)
				{
					this.element
							.find('.fa-sort-asc, .fa-sort-desc')
								.removeClass('active')
								.removeClass('text-info')

					can.$(el)
						.addClass('active')
						.addClass('text-info')

					this.options.queries.sort
					=	can.extend(
							{
								by:		can.$(el).parents('th.sorteable').attr('to-sort')
							,	order:	order
							}
						,	can.$(el).parents('th.sorteable').attr('to-sort-model')
							?	{
									model:	can.$(el).parents('th.sorteable').attr('to-sort-model')
								}
							:	{}
						)

					this._update_sorts()
				}

			,	_render_paginable: function()
				{
					this.Paginador
					=	new	Sigma.Pagination(
							can.$('<div class="table-pagination">')
								.appendTo(
									this.element
								)
						,	{
								perPage: this.options.queries.pagination.limit
							,	maxIndex: this.options.queries.pagination.maxIndex
							,	onPageChange: can.proxy(this._update_page,this)
							,	currentPage: 1
							,	count: this.table_data.attr('count')
							}		
						)
				}
			,	_render_scrollable: function()
				{
					var	$table
					=   this
							.element
								.find('table')
					,	ths_width
					=	_.map(
							$table.find('thead th')
						,	function(th,i,ths)
							{
								var	offset
								=	_.isEqual(i+1,ths.length)
									?	15
									: 	-15/(ths.length-1)
								return	can.$(th).outerWidth() + offset
							}
						)


					// ancho a los th
					$table
						.find('thead th')
							.each(
								function(i,th)
								{
									can.$(th)
										.css(
											'width'
										,	ths_width[i]
										)
								}
							)

					//        base para table
					$table
						.css(
						{
							width: '100%'
						,	display: 'block'
						}
					)

					//        base para thead
					$table
						.find('thead')
							.css(
								{
									display: 'inline-block' 
								,	width: '100%'
								}
					)

					// base para body
					$table
						.find('tbody')
							.css(
								{
									'height': this.options.scrollHeight
								,	'display': 'inline-block'
								,	'width': '100%'
								,	'overflow': 'auto'
								,	'overflow-x': 'hidden'
								}
							)

					this._set_td_scrollable()
				}

			,	_set_td_scrollable: function()
				{
					var	$table
					=	this
							.element
								.find('table')
					,	ths_width
					=	_.map(
							$table.find('thead tr:visible th')
						,	function(th)
							{
								return	can.$(th).outerWidth()
							}
						)

					//	ancho a los td
					$table
						.find('tbody tr:visible')
							.each(
								function(i,tr)
								{
									var	aux_ths
									=	ths_width.clone()

									can.$(tr)
										.find('td:visible')
											.each(
												function(z,td)
												{
													var	offset
													=	_.isEmpty(can.$(td).attr('colspan'))
														?	1
														: 	parseInt(can.$(td).attr('colspan'))
													,	widths
													=	_.first(
															aux_ths
														,	offset
														)

													can.$(td)
														.css(
															'width'
														,	_.reduce(
																widths
															,	function(sum,num)
																{
																	return	(sum || 0) + num
																}
															)
														)

													aux_ths
													=	_.rest(
														aux_ths
														,	offset
													)
												}
											)

									// can.$(tr)
									//	.find('td:visible:last')
									//		.css(
									//			'width'
									//		,	_.last(ths_width) - 15
									//		)
								}
							)
				}

			,	_refresh_data: function(function_update)
				{
					this._render_loading_tr()

					// function_update 
					// =	function_update
					// 	?	function_update
					// 	: 	this._update_data

					return	(can.isFunction(this.options.data))
							?	this.options.data(this.options.queries)
									.then(
										can.proxy(this._update_data,this)
									)

							:	can.isDeferred(this.options.data)
								?	this._update_deferrred_data()
								: 	this._update_data(
										this.filteredData()
									)
				}

			,	_search_query: function(queries)
				{
					this.options.queries.pagination.offset
					=	0

					return	this._update_query(queries)
				}

			,	_update_query: function(queries)
				{
					this.options.queries.query
					=	queries

					return	this._refresh_data()
				}

			,	_update_page: function(page)
				{
					this.options.queries.pagination.offset
					=	page*this.options.queries.pagination.limit
					
					return	this._refresh_data()
				}

			,	_update_sorts: function()
				{
					return	this._refresh_data()
				}

			,	_update_deferrred_data: function() //WHAAAT?? Te sarpaste en R
				{
					var	self
					=	this

					this.options.data
						.then(
							function(resolvedData)
							{
								self.options.data
								=	resolvedData

								self._update_data(
									self.filteredData()
								)
							}
						)
				}

			,	_update_data: function(data)
				{
					if (this.options.index)
						can.each(
							data.items
						,	function(item,index)
							{
								item.attr('itemIndex',index+1)
							}
						)	

					this._load_data(data,'updated.sigma.table')
				}

			,	_new_data: function(data)
				{
					this._load_data(data,'new.sigma.table')
				}

			,	_load_data: function(data,event)
				{
					this._remove_loading_tr()

					this.table_data 
							.attr('items')
								.replace(data.items)

					this.table_data
							.attr('count',data.count)
					
					if	(
							this.Paginador
						&&	(this.Paginador.getCount() != this.table_data.attr('count'))
						)
							this
								.Paginador
									.setCount(this.table_data.attr('count'))
					 else
						if 	(this.options.scrollable)
							this._set_td_scrollable()

					can.trigger(
						this.element
					,	event
					)
				}

			,	filteredData: function()
				{
					var	self
					=	this
					,	offset
					=	this.options.queries.pagination
						?	this.options.queries.pagination.offset
						:	0
					,	limit
					=	this.options.queries.pagination
						?	this.options.queries.pagination.limit
						:	this.options.data.length
					,	Sorted
					=	this.options.queries.sort
						?	_.sortBy(
								this.options.data
							,	function(item,index)
								{
									return	item[self.options.queries.sort.by]
								}
							)
						:	this.options.data
					,	Paginated
					=	_.filter(
							self.options.queries.sort && self.options.queries.sort.order == 'asc'
							?	Sorted.reverse()
							:	Sorted
						,	function(item,index)
							{
								return	(index >= offset) && (index < (offset + limit))
							}
						)

					return	{
								items: 	Paginated
							,	count: 	this.options.data
										? 	this.options.data.length
										: 	0
							}
				}

			,	_clean: function(element)
				{
					element
						.find('*')
							.remove()
				}

			,	'{data} length': function(newData,event,length)
				{
					if	(this.options.autoUpdate)
					{
						this
							._refresh_data()
					}
				}
				
			,	' delete_row': function()
				{
					this._update_page()

					if(this.element.find('tbody tr:visible:not(".loading")').length == 0)
						this.Paginador.update_to_remove()
				}
			}
		)
	}
)