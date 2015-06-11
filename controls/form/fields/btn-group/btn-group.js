steal(
	'controls/form/fields'
).then(
	function()
	{
		Sigma.Form.Fields(
			'Sigma.Fields.Btn-group'
		,	{
				defaults:
				{
					name: 'default_name'
				,	id: undefined
				,	'class': undefined
				,	disabled: false
				,	'field-col': 'col-md-7'
				,	'label-col': 'col-md-3'
				}
			}
		,	{
				_render_validations: function()
				{
					can.trigger(
						this.element
					,	'validated.sigma.field'
					,	{
							field:	this.options.name
						,	isValidated: true
						}
					)
				}


			,	setupContent: function()
				{
					this.done
					=	new can.Observe({buttons: false})
				}

			,	_render_content: function()
				{
					this._render_field()
				}

			,	_render_field: function()
				{
					this.$field
					=	can.$('<div>')

					this
						.element
							.html(
								this
									.$field
										.addClass('btn-group')
							)

					this
						.options
							.buttons
								.each(
									can.proxy(this._render_button,this)
								)

					this._super()
				}

			,	_render_button: function(button)
				{
					var	attrs
					=	new can.Observe(
							_.pick(
								button
							,	['name','id','class','disabled']
							)
						)
					,	$button
					=	can.$('<a>')

					attrs
						.each(
							function(val,attr)
							{
								$button
									.attr(
										attr
									,	val
									)
							}
						)
					
					$button
						.addClass('btn')
						.addClass(!_.isEmpty(button.size) && button.size)
						.addClass(!_.isEmpty(button.kind) && button.kind)
						.data('button',button)
						.html(
								button.label
							)
						.appendTo(
							this.$field
						)

					if	(this.isSubmitButton(button))
						$button
							.addClass('submit-button')
	
					this._super()
				}

			,	_render_form: function()
				{
					this
						.element
							.removeClass('form-group')

					can.trigger(
						this.element
					,	'shown.sigma.field'
					,	this.options.name
					)
				}

			,	_render_inline: function()
				{
					can.trigger(
						this.element
					,	'shown.sigma.field'
					,	this.options.name
					)
				}

			,	_render_horizontal: function()
				{
					this
						.element
							.find('button')
							.appendTo(
								can.$('<div>')
									.addClass(this.options['field-col'])
									.addClass(this.getOffset())
									.appendTo(
										this.element
									)
							)

					can.trigger(
						this.element
					,	'shown.sigma.field'
					,	this.options.name
					)
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

			,	isSubmitButton: function(button)
				{
					return	_.isBoolean(button.submit) && button.submit
				}

			,	'field.sigma.field': function()
				{
					this.done.attr('buttons',true)
					this._render_position()
				}

			,	toggleButton: function(disabled,html)
				{
					this
						.element
							.find('button')
								.prop('disabled',disabled)

					this
						.element
							.find('button')
								.html(
									html
								)
				}

			,	'button click': function(el,ev)
				{
					if	(this.isSubmitButton())
						can.trigger(
							this.element
						,	'submit.sigma.form'
						,	can.$(el).data('button')
						)
				}
			}
		)
	}
)