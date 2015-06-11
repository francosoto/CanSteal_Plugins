steal(
	'lib'
,	'plugin'
,	'can/control'
,	'can/observe'
,	'can/view'
,	'can/view/mustache'
,	'can/construct/super'
,	'can/construct/proxy'
,	'can/control/plugin'
,	'can/observe/sort'
).then(
	function()
	{
		can.Control(
			'Sigma.Control'
		,	{
				defaults:
				{
					view:			false
				,	view_error:		'views/control/error.mustache'
				,	view_loading:	'views/control/loading.mustache'
				,	view_empty:		'views/control/empty.mustache'
				,	msg_error:		new can.Observe({text:'Ocurrió un error inesperado'})
				,	msg_empty:		new	can.Observe({text:'No se envió data'})
				,	msg_loading:	new can.Observe({text:'Ocurrió un error al cargar'})
				,	data:			undefined
				}
			}
		,	{
				init:function(elem,options)
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

					this._render_loading()
					
					if	(!options.data)
						this._render_error()
					else
						if	(can.isEmptyObject(options.data))
							this._render_empty(options.msg_empty)
						else
							if	(can.isDeferred(options.data))
								this._render_deferred(options.data)
							else
								if	(
										options.data instanceof can.Observe
									||	options.data instanceof can.Observe.List
									)
									{
										this._clean(this.element)
										
										this._render_content(
											options.data
										)
									}
								else
									this._render_object(options.data)
				}

			,	destroy: function()
				{
					steal.dev.log("Destroying "+this.constructor.fullName)
					var	$element
					=	this.element
					can.Control.prototype.destroy.call( this )
					if	(!_.isEmpty($element))
						$element.remove()
				}

			,	_render_deferred:function(data)
				{
					var	self
					=	this
					data
						.then(
							function(resolved)
							{
								self.options.data
								=	resolved

								self._clean(self.element)

								if	(
										self.options.data instanceof can.Observe
									||	self.options.data instanceof can.Observe.List
									)
										self._render_content(
											self.options.data
										)
								else
									self._render_object(self.options.data)
							}
						,	function(resolved)
							{
								self.options.data
								=	resolved

								self._clean(self.element)

								self._render_error(resolved)
							}
						)

				}
				
			,	_render_object:function(data)
				{
					this.options.data
					=	can.isArray(data)
						?	new can.Observe.List(data)
						:	new can.Observe(data)

					this._clean(this.element)

					this._render_content(
						this.options.data
					)
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

			,	_render_loading_by_element: function($element)
				{
					can.append(
						$element
					,	can.view(
							this.options.view_loading
						)
					)
				}

			,	_render_error:function(error)
				{
					can.append(
						this.element
					,	can.view(
							this.options.view_error
						,	can.extend(
								error
							,	this.options.msg_error
							)
						)
					)
				}

			,	_render_empty:function(empty)
				{
					can.append(
						this.element
					,	can.view(
							this.options.view_empty
						,	empty
						)
					)
				}

			,	_render_content: function(data)
				{
					can.append(
						this.element
					,	can.view(
							this.options.view
						,	data
						)
					)
				}

			,	_clean: function(element)
				{
					if(element)
						element
							.find('*')
								.remove()
				}
			}	
		)
	}
)