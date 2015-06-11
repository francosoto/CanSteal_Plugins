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
).then( 
	function()
	{
		can.Control(
			'Sigma.Pagination'
		,	{
				defaults:
				{
				//	items por pag
					perPage: 10
				//	cantidad de pags a mostrar
				,	maxIndex: 0
				//	cantidad de registros por paginar
				,	count: 0
				//	vista del paginador
				,	view: 'views/pagination/init.mustache'
				//	funcion a llamar cuando se cambia de pag
				,	onPageChange: function(offset)
					{
						steal.dev.log('Nuevo offset',offset)
					}
				//	Error si la pag no existe
				,	wrong_page: 'No Existe!'
				}
			}
		,	{
				init: function(element,options)
				{
					this.pagination
					=	new can.Observe(
							{
								first_page:		1
							,	prev_page:		1
							,	current_page:	1
							,	pages:			new can.Observe.List(this.getPages())
							,	next_page:		this.getPages().length > 1 ? 2 : 1
							,	last_page:		this.getLastPage()
							}
						)

					this._render_pagination()
				}

			,	getPages: function()
				{
					return	can.map(
								_.range(this.getLastPage())
							,	function(i)
								{
									return	{page_number: (i+1)}
								}
							)
				}

			,	getLastPage: function()
				{
					return	Math.ceil(this.options.count/((this.options.perPage <= 0) ? 1 : this.options.perPage))
				}

			,	_render_pagination: function()
				{
					this.$pagination
					=	can.$('<div>')
							.appendTo(this.element)

					can.append(
						this.$pagination
					,	can.view(
							steal.idToUri(this.options.view).path
						,	this.pagination
						)
					)

					this.pagination
							.bind(
								'current_page'
							,	can.proxy(this.setActive,this)
							)

					// this
					// 	.pagination
					// 		.attr(
					// 			'current_page'
					// 		,	1
					// 		)
				}

			,	_update_paginador: function()
				{
					this.$pagination.remove()

					this.init()
				}

			,	_render_error: function(error)
				{					
					var	$alert
					=	this.element.find('.alert-wrong-page').length > 0
						?	this.element.find('.alert-wrong-page').empty()
						:	can.$('<div>')
								.addClass('alert alert-danger alert-wrong-page alert-dismissable')

					this.timer
					=	setTimeout(
							function()
							{
								$alert.remove()
							}
						,	4000
						)				


					$alert
						.html(error)
						.prepend(
							can.$('<button>')
								.html('&times;')
								.attr(
									{
										'class': 'close close-error'
									,	type: 'button'
									}
								)
						)
						.appendTo(
							this.element
						)
				}

			,	'li:not(".disabled") a.jumpTo click': function(el,ev)
				{
					this
						.setCurrentPage(
							can.$(el).attr('page-to-jump')
						)
				}

			,	'input.jumpTo keyup': function(el,ev)
				{
					if	(ev.keyCode == 13)
						this
							.setCurrentPage(
								can.$(el).val()
							)
				}

			,	'button.jumpTo click': function()
				{
					this
						.setCurrentPage(
							this.element.find('input.jumpTo').val()
						)
				}

			,	'button.close-error click': function(el,ev)
				{
					clearTimeout(this.timer)

					can.$(el)
						.parents('.alert-wrong-page')
							.remove()
				}

			,	update_to_remove: function()
				{
					this.setCurrentPage(this.pagination.attr('current_page') - 1)
					this.propagationActive = true
				}

			,	setCurrentPage: function(page)
				{
					var	intPage
					=	parseInt(
							page
						)

					if	(intPage < 1 || intPage > this.getLastPage() || _.isNaN(intPage))
						this._render_error(this.options.wrong_page)
					else
						this
							.pagination
								.attr(
									'current_page'
								,	intPage
								)
				}

			,	setActive: function(ev,newVal,oldVal)
				{
					this.checkPrev(newVal)
					
					this.element
							.find('.page a[page-to-jump="'+oldVal+'"]')
								.parents('li')
									.removeClass('active')

					this.element
							.find('.page a[page-to-jump="'+newVal+'"]')
								.parents('li')
									.addClass('active')
									.show()
					
					this.checkNext(newVal)

					this.updatePrevAndNext(newVal)

					if	(newVal != oldVal)
						this
							.options
								.onPageChange(
									this.getCurrentIndex()
								)

					if	(this.options.maxIndex)
						this._resolve_pages_ranges()
				}

			,	isFirst: function(newVal)
				{
					return	(this.pagination.attr('first_page') == newVal)
				}

			,	checkPrev: function(newVal)
				{
					var	$prev_and_first
					=	this.element
								.find('.first-page, .prev-page')

					if	(this.isFirst(newVal))
						$prev_and_first
							.addClass('disabled')
					else
						$prev_and_first
								.removeClass('disabled')
				}

			,	isLast: function(newVal)
				{
					return	(this.pagination.attr('last_page') == newVal)
				}

			,	checkNext: function(newVal)
				{
					var	$next_and_last
					=	this.element
								.find('.last-page, .next-page')

					if	(this.isLast(newVal))
						$next_and_last
							.addClass('disabled')
					else
						$next_and_last
							.removeClass('disabled')
				}

			,	updatePrevAndNext: function(newVal)
				{
					this
						.pagination
							.attr(
								'prev_page'
							,	newVal-1
							)

					this
						.pagination
							.attr(
								'next_page'
							,	newVal+1
							)
				}

			,	_resolve_pages_ranges: function()
				{
					var	visibles
					=	_.union(
							this.getLeftSide()
						,	this.getRightSide()
						)

					this.element
							.find('.pagination .page:not(".active")')
								.each(
									function(i,page)
									{
										var	page_number
										=	parseInt(
												can.$(page).find('.jumpTo').attr('page-to-jump')
											)
										
										if	(
												_.include(
													visibles
												,	page_number
												)
											)
												can.$(page).show()
											else
												can.$(page).hide()
									}
								)
				}

			,	getCount: function()
				{
					return	this.options.count
				}

			,	setCount: function(newCount)
				{
					if	(this.options.count != newCount)
					{
						this.options.count
						=	newCount

						this
							.pagination
								.attr('pages')
									.replace(
										this.getPages()
									)

						this
							.pagination
								.attr(
									'last_page'
								,	this.getLastPage()
								)

						this.pagination.attr('current_page',1)

						if(!this.propagationActive)
						{
							this.setActive(undefined,1,1)
							this.propagationActive = false
						}
						else
						{
							newVal
							= 	this.pagination.attr('current_page')
							
							this.element
								.find('.page a[page-to-jump="'+newVal+'"]')
									.parents('li')
										.addClass('active')
										.show()

							this.checkPrev(newVal)
					
							this.checkNext(newVal)

							this.updatePrevAndNext(newVal)

							if	(this.options.maxIndex)
								this._resolve_pages_ranges()
						}

						// this._update_paginador()
					}	
				}

			,	getCurrentIndex: function()
				{
					return	this.pagination.attr('current_page') - 1
				}

			,	getMaxLeft: function()
				{
					return 	((Math.floor(this.options.maxIndex/2)) - ((this.options.maxIndex % 2 == 0 ) ? 1 : 0))
				}

			,	getMaxRight: function()
				{
					return	(Math.floor(this.options.maxIndex/2))
				}

			,	getLeftOffset: function()
				{
					var	offset
					=	(this.getCurrentIndex()-this.getMaxLeft())

					return	(offset < 0)
							?	Math.abs(offset)
							:	0
				}

			,	getRightOffset: function()
				{
					var	offset
					=	((this.getLastPage() - (this.getCurrentIndex() +	1)) - this.getMaxRight())

					return	(offset < 0)
							?	Math.abs(offset)
							:	0
				}

			,	getLeftIndex: function()
				{
					return	this.getMaxLeft() - this.getLeftOffset() + this.getRightOffset()
				} 

			,	getRightIndex: function()
				{				
					return	this.getMaxRight() - this.getRightOffset() + this.getLeftOffset()
				}

			,	getLeftSide: function()
				{
					var	offset
					=	this.pagination.attr('current_page')

					return	can.map(
								_.range(this.getLeftIndex())
							,	function(i)
								{
									return	offset - (i+1)
								}
							).reverse()
				}

			,	getRightSide: function()
				{
					var	offset
					=	this.pagination.attr('current_page')

					return	can.map(
								_.range(this.getRightIndex())
							,	function(i)
								{
									return	offset + (i+1)
								}
							)
				}
			}
		)
	}
)