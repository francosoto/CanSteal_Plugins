steal(
	'controls/form/fields'
).then(
	function()
	{
		Sigma.Form.Fields(
			'Sigma.Fields.Button'
		,	{
				defaults:
				{
					name: 'default_name'
				,	id: undefined
				,	'class': undefined
				,	disabled: false
				,	'field-col': 'col-md-7'
				,	'label-col': 'col-md-3'
				,	kind: 'btn-default'
				,	size: undefined
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
					=	new can.Observe({field: false})
				}

			,	_render_content: function()
				{
					this._render_field()
				}

			,	_render_field: function()
				{
					var	attrs
					=	new can.Observe(
							_.pick(
								this.options
							,	['name','id','class','disabled']
							)
						)
					,	$button
					=	can.$('<button>')
							.attr(
								'type'
							,	'button'
							)

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
					
					this.$field
					=	$button
							.addClass('btn')
							.addClass(!_.isEmpty(this.options.size) && this.options.size)
							.addClass(!_.isEmpty(this.options.kind) && this.options.kind)
							.html(
									this.options.label
								)
							.appendTo(
								this.element
							)

					if	(this.isSubmitButton())
						this
							.$field
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
						.$field
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

			,	isSubmitButton: function()
				{
					return	_.isBoolean(this.options.submit) && this.options.submit
				}

			,	'field.sigma.field': function()
				{
					this.done.attr('field',true)
					this._render_position()
				}

			,	toggleButton: function(disabled,html)
				{
					this
						.$field
							.prop('disabled',disabled)

					this
						.$field
							.html(
								html
							)
				}

			,	'button[name={name}] click': function(el,ev)
				{
					ev.stopPropagation()
					if	(this.isSubmitButton())
						can.trigger(
							this.element
						,	'submit.sigma.form'
						)
				}
			}
		)
	}
)