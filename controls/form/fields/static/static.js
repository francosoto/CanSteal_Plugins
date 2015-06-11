steal(
	'controls/form/fields'
).then(
	function()
	{
		Sigma.Form.Fields(
			'Sigma.Fields.Static'
		,	{
				defaults:
				{
					name: 'default_name'
				,	label: 'default_label'
				,	'field-col': 'col-md-7'
				,	'label-col': 'col-md-3'
				,	id: undefined
				,	'class': undefined
				,	disabled: false
				,	value: undefined
				}
			}
		,	{
				_render_field: function()
				{
					var	attrs
					=	new can.Observe(
							_.pick(
								this.options
							,	['name','id','class']
							)
						)
					,	$static
					=	can.$('<p>')
							.addClass('form-control-static')
							.html(
								this.options.value
							)

					attrs
						.each(
							function(val,attr)
							{
								$static
									.attr(
										attr
									,	val
									)
							}
						)

					this.$field
					=	$static
							.appendTo(
								this.$element
							)

					this._super()
				}

			,	_render_form: function()
				{
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
						.$label
							.addClass('sr-only')

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
					this
						.$label
							.addClass('control-label')
							.addClass(this.options['label-col'])

					this
						.$field
							.wrap(
								can.$('<div>')
									.addClass(this.options['field-col'])
							)
					
					this
						.$validations
							.appendTo(
								this
									.$field
										.parent()
							)

					can.trigger(
						this.element
					,	'shown.sigma.field'
					,	this.options.name
					)
				}
			}
		)
	}
)