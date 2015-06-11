steal(
	'controls/form/fields'
).then(
	function()
	{
		Sigma.Form.Fields(
			'Sigma.Fields.Select'
		,	{
				defaults:
				{
					name: 'default_name'
				,	label: 'default_label'
				,	'field-col': 'col-md-7'
				,	'label-col': 'col-md-3'
				,	options: new can.Observe.List()
				,	text: 'Seleccione una Opción...'
				,	multiple: false
				,	disabled: false
				,	id: undefined
				,	'class': undefined
				,	size: undefined
				}
			}
		,	{
				setupContent: function()
				{
					this._super()

					this.done
					=	new can.Observe({label: false, field: false, options: false})
				}

			,	_render_field: function()
				{
					var	attrs
					=	new can.Observe(
							_.pick(
								this.options
							,	['name','id','class','disabled','size', 'multiple']
							)
						)
					,	$select
					=	can.$('<select>')

					attrs
						.each(
							function(val,attr)
							{
								$select
									.attr(
										attr
									,	val
									)
							}
						)

					this.$field
					=	$select
							.appendTo(
								this.$element
							)

					var	field
					=	this.options

					var	options
					=	can.isDeferred(this.options.options)
						?	this.options.options
						:	this.options.ajax
							?	can.ajax(
									this.options.ajax
								)
							:	this.options.model
								? 	this.options.model
								: 	this.options.options

					if	(can.isDeferred(options))
						this._options_deferred(options,$select)
					else if(this.options.model)
					{
						var opts 
						= 	options.findAll()

						if(can.isDeferred(opts))
							this._options_deferred(opts,$select)
					}
					else
						this._render_options($select,options)

					this._super()
				}

			,	_options_deferred: function(options,$select)
				{
					var	field
					=	this.options

					options
						.pipe(
							function(options)
							{
								return	options instanceof can.Model.List
										?	options
										:	new	can.Observe.List(options)
												.each(
													function(option)
													{
														option
															.attr(
																{
																	getLabel: function()
																	{
																		return	this.attr(field.label_key)
																	}
																,	getValue: function()
																	{
																		return	this.attr(field.value_key)
																	}
																}
															)
													}
												)
							}
						)
						.then(
							can.proxy(
								this._render_options
							,	this	
							,	$select
							)
						)
				}

			,	_render_options: function($select,options)
				{
					var	selectValue
					=	this.options.multiple
						?	(this.options.value instanceof can.Observe.List)
							?	_.map(
									this.options.value.attr()
								,	function(item)
									{ 
										return item.id
									}
								)
							: 	this.options.value
						: 	(this.options.value instanceof can.Observe)
							?	can.isFunction(this.options.value.getValue)
								?	this.options.value.getValue()
								:	this.options.value.attr('value')
									? 	this.options.value.attr('value')
									: 	this.options.value.attr('id')
							:	this.options.value
					,	$option
					=	can.$('<option>')
							.attr('value',-1)
							.text(this.options.text)
							.data('value',null)
							.appendTo(
								$select
							)

					options
						.each(
							function(option)
							{
								var	$option
								=	can.$('<option>')
										.data('value',option)
										.appendTo($select)
								,	optionValue
								=	can.isFunction(option.getValue)
									?	option.getValue()
									:	option.attr('value')


								$option
									.attr(
										{
											value:	optionValue
										}
									)

								$option
									.text(
										can.isFunction(option.getLabel)
										?	option.getLabel()
										:	option.attr('label')
									)

								if	(_.isEqual(selectValue,_.isString(selectValue)?optionValue+'':optionValue) 
									|| 	(_.isArray(selectValue)
										&&	 _.contains(selectValue,optionValue)
										)
									)
									$option
										.prop(
											'selected'
										,	true
										)
							}
						)

					can.trigger(
						this.element
					,	'options.sigma.field'
					)
				}

			,	resetData: function()
				{
					this.$field.val(-1)
				}

			,	getSelected: function()
				{
					return	this
								.element
									.find('option:selected')
				}

			,	getValue: function()
				{
					var	$selected
					=	this.getSelected()

					return	(this.options.multiple)
							?	can.map(
									$selected
								,	function(option,index)
									{
										return	can.$(option).val()
									}
								)
							:	$selected
									.val()
				}

			,	getData: function()
				{
					var	$selected
					=	this.getSelected()

					return	(this.options.multiple)
							?	can.map(
									$selected
								,	function(option,index)
									{
										return	can.$(option).data('value')
									}
								)
							:	$selected
									.data('value')
				}

			,	'options.sigma.field': function()
				{
					this.done.attr('options',true)
					//if(_.isUndefined(this.options.addon))
					this._render_position()

					if(this.options.value)
						this.validateField()
				}

			,	'shown.sigma.field': function()
				{
					if(!_.isUndefined(this.options.addon))
						this._setup_addon()
				}
			}
		)
	}
)