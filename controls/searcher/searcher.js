steal(
	'controls/form'
,	'controls/searcher/searcher.css'
).then(
	function()
	{
		Sigma.Control(
			'Sigma.Searcher'
		,	{
				pluginName:	'sigma_searcher'
			,	defaults:
				{
					view: 'views/searcher/init.mustache'
				,	onBeforeAdvaced: function(formData)
					{
						return	formData.form
					}
				,	onBeforeQuick: function(query)
					{
						return	query
					}
				,	onAdvancedSearch: undefined
				,	onQuickSearch: undefined
				,	functionsContext: undefined
				,	searchKey: 'search'
				,	data:
					{
						searchLabel: 'Buscar'
					,	advanced: false
					,	advancedTitle: 'Busqueda Avanzada'
					}
				,	onSuccess: function(){}
				,	onFail:	function(){}
				}
			}
		,	{
				_render_content: function(data)
				{
					data
						.attr(
							can.extend(
								{
									searchKey: 'search'
								,	searchLabel: 'Buscar'
								,	advanced: false
								,	advancedTitle: 'Busqueda Avanzada'
								}
							,	data.attr()
							)
						)

					this._super(data)

					if	(data.attr('advanced'))
						this._render_advanced(data)
				}

			,	_render_advanced: function(data)
				{
					this.$avanzada
					=	this.element.find('.busqueda-avanzada')

					this.advancedForm
					=	new	Sigma.Form(
							can.$('<form>')
								.appendTo(
									this.$avanzada	
								)
						,	{
								data:	data.attr('advanced')
							,	type:	'form-horizontal'
							}
						)

					can.$('<button>')
							.addClass('btn btn-default pull-right advanced-search')
							.text('Buscar')
							.attr('type','button')
							.appendTo(
								this.$avanzada
							)

					this
						.advancedForm
							.element
								.removeClass('row')
				}

			,	'.toggle-busqueda-avanzada click': function(el,ev)
				{
					if	(this.$avanzada.is(':hidden'))
						this.$avanzada
								.css(
									{
										width: this.element.width()-5
									}
								)
				}

			,	'.busqueda-avanzada click': function(el,ev)
				{
					ev.preventDefault()
					ev.stopPropagation()
				}

			,	'.quick-search click': function(el,ev)
				{
					var	$quickInput
					=	this.element.find('.quick-input')

					this
						.perform_quick_search(
							this.getInputSerialized($quickInput)
						)
				}

			,	'.quick-input keyup':function(el,ev)
				{
					if	(ev.keyCode == 13)
						this
							.perform_quick_search(
								this.getInputSerialized(can.$(el))
							)
				}

			,	getInputSerialized: function($input)
				{
					return	{
								key:	this.options.searchKey
							,	value:	$input.val()
							}
				}

			,	perform_quick_search: function(valToBeSearched)
				{
					if	(can.isFunction(this.options.onQuickSearch))
					{
						var $quickButton
						=	this.element.find('.quick-search')
						,	$quickInput
						=	this.element.find('.quick-input')
						,	buttonHTML
						=	$quickButton.html()
						,	quickFormData
						=	this.options.onBeforeQuick(
								valToBeSearched
							)

						$quickInput
							.prop('disabled',true)

						$quickButton
							.prop('disabled',true)

						$quickButton
							.empty()
							.text('Buscando...')

						can.$('<i>')
							.addClass('fa fa-spinner fa-spin')
							.css('margin-left','5px')
							.appendTo($quickButton)

						this
							.options
								.onQuickSearch(quickFormData)
								.then(
									can.proxy(this.options.onSuccess,this)
								,	can.proxy(this.options.onFail,this)
								)
								.always(
									function()
									{
										$quickButton
											.html(
												buttonHTML
											)

										$quickInput
											.prop('disabled',false)

										$quickButton
											.prop('disabled',false)
									}
								)
					}	else
						steal.dev.log("No se seteo ninguna función onQuickSearch")
				}

			,	'.advanced-search click': function(el,ev)
				{
					if	(can.isFunction(this.options.onAdvancedSearch))
					{
						var $avancedButton
						=	this.element.find('.advanced-search')
						,	buttonHTML
						=	$avancedButton.html()
						,	advancedFormData
						=	this.options.onBeforeAdvaced(
								this
									.advancedForm
										.getFormData()
							)
						,	$avanzada
						=	this.element.find('.advanced-dropdown')

						$avancedButton
							.prop('disabled',true)

						$avancedButton
							.empty()
							.text('Buscando...')

						can.$('<i>')
							.addClass('fa fa-spinner fa-spin')
							.css('margin-left','5px')
							.appendTo($avancedButton)

						this._habilitar_botones()

						this
							.options
								.onAdvancedSearch(advancedFormData)
								.then(
									can.proxy(this.options.onSuccess,this)
								,	can.proxy(this.options.onFail,this)
								).always(
									function()
									{
										$avancedButton
											.html(
												buttonHTML
											)

										$avancedButton
											.prop('disabled',false)

										$avanzada
											.removeClass('open')
									}
								)
					}	else
						steal.dev.log("No se seteo ninguna función onAdvancedSearch")
				}
			
			,	'.advanced-dropdown hidden.bs.dropdown':function()
				{
					this._habilitar_botones()
				}

			,	'.advanced-dropdown shown.bs.dropdown':function()
				{
					this.element
							.find('.quick-search')
								.prop('disabled',true)

					this.element
							.find('.quick-input')
								.prop('disabled',true)
				}

			,	_habilitar_botones: function()
				{
					this.element
							.find('.quick-search')
								.prop('disabled',false)

					this.element
							.find('.quick-input')
								.prop('disabled',false)
				}
			}
		)
	}
)