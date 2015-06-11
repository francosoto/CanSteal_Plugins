steal(
	'controls/form/fields'
).then(
	function()
	{
		Sigma.Form.Fields(
			'Sigma.Fields.Radio'
		,	{
				defaults:
				{
					name: 'default_name'
				,	'field-col': 'col-md-7'
				,	'label-col': 'col-md-3'
				,	id: undefined
				,	'class': undefined
				,	disabled: false
				,	checked: false
				}
			}
		,	{
				setupContent: function()
				{
					this.done
					=	new can.Observe({options: false})

					this.$validations
					=	can.$()
				}

			,	_render_content: function()
				{
					this._render_field()
				}

			,	_render_field: function()
				{
					var	self
					=	this
					,	options
					=	can.isDeferred(this.options.options)
						?	this.options.options
						:	this.options.ajax
							?	can.ajax(
									this.options.ajax
								)
							:	this.options.options

					if	(can.isDeferred(options))
						options
							.pipe(
								function(options)
								{
									return	new	can.Observe.List(options)
													.each(
														function(option)
														{
															option
																.attr(
																	{
																		getLabel: function()
																		{
																			return	this.attr(self.options.label_key)
																		}
																	,	getValue: function()
																		{
																			return	this.attr(self.options.value_key)
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
								)
							)
					else
						this
							._render_options(options)

				}

			,	_render_options: function(options)
				{
					var	self
					=	this

					options
						.each(
							function(option)
							{
								var	$radio
								=	can.$('<input>')
										.attr('type','radio')
										.attr('name',self.options.name)
										.data('value',option)

								var	attrs
								=	new can.Observe(
										_.pick(
											option
										,	['id','class','disabled','checked','value']
										)
									)

								attrs
									.each(
										function(val,attr)
										{
											$radio
												.attr(
													attr
												,	val
												)
										}
									)

								if	(_.isEqual(self.options.value,attrs.attr('value')))
									$radio
										.prop('checked',true)

								$radio
									.prependTo(
										can.$('<label>')
											.html(
												option.label
											)
											.appendTo(
												can.$('<div>')
													.addClass('radio')
													.appendTo(
														self.$element
													)
											)
									)

							}
						)

					can.trigger(
						this.element
					,	'options.sigma.field'
					)
				}

			,	_render_form: function()
				{
					this
						.element
							.removeClass('form-group')

					this
						.$validations
							.appendTo(
								this
									.element
							)

					can.trigger(
						this.element
					,	'shown.sigma.field'
					,	this.options.name
					)
				}

			,	_render_inline: function()
				{
					this
						.element
							.find('label')
								.addClass('radio-inline')
								.css('margin-right',10)
								.unwrap()

					this
						.$validations
							.appendTo(
								this
									.element
							)

					can.trigger(
						this.element
					,	'shown.sigma.field'
					,	this.options.name
					)
				}

			,	_render_horizontal: function()
				{
					var	self
					=	this

					this
						.element
							.find('label')
								.unwrap()

					this
						.element
							.find('label')
								.each(
									function(i,label)
									{
										can.$(label)
											.appendTo(
												can.$('<div>')
													.addClass('radio')
													.appendTo(
														can.$('<div>')
															.addClass(self.options['field-col'])
															.addClass(self.getOffset())
															.appendTo(
																self.element
															)
													)
											)
									}
								)

					this
						.$validations
							.appendTo(
								this
									.element
							)

					can.trigger(
						this.element
					,	'shown.sigma.field'
					,	this.options.name
					)
				}

			,	resetData: function()
				{
					this.element.find('input').attr('checked',false)
				}

			,	getOffset: function()
				{
					var	responsive
					=	can.map(
							this.options['label-col'].split(' ')
						,	function(col,i)
							{
								var	splited
								=	col.split('-')
								,	last
								=	splited.pop()

								splited
									.push('offset')

								splited
									.push(last)

								return	splited.join('-')
							}
						)

					return	responsive.join('-')
				}

			,	getValue: function()
				{
					return	this.element.find('input').is(':checked')
				}

			,	getData: function()
				{
					return	this.element.find('input:checked').data('value')
				}

			,	'options.sigma.field': function()
				{
					this.done.attr('options',true)
					this._render_position()
				}
			}
		)
	}
)