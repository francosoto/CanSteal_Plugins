steal(
	'controls/form/fields'
).then(
	function()
	{
		Sigma.Form.Fields(
			'Sigma.Fields.Checkbox'
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
				,	checked: false
				}
			}
		,	{
				setupContent: function()
				{
					this.done
					=	new can.Observe({label: false, field: false})

					this.$validations
					=	can.$()
				}

			,	_render_content: function()
				{
					this._render_label()
				}

			,	_render_field: function()
				{
					var	attrs
					=	new can.Observe(
							_.pick(
								this.options
							,	['name','id','class','disabled','checked']
							)
						)
					,	$input
					=	can.$('<input>')
							.attr(
								'type'
							,	'checkbox'
							)

					if	(_.isBoolean(this.options.value))
						attrs
							.attr(
								'checked'
							,	this.options.value
							)

					attrs
						.each(
							function(val,attr)
							{
								$input
									.attr(
										attr
									,	val
									)
							}
						)
					this.$field
					=	$input
							.prependTo(
								this
									.element
										.find('label')
							)

					can.trigger(
						this.element
					,	'field.sigma.field'
					)
				}

			,	_render_form: function()
				{
					this
						.element
							.removeClass('form-group')

					this
						.element
							.addClass('checkbox')

					this
						.$validations
							.appendTo(
								this
									.$field
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
								.addClass('checkbox-inline')
								.css('margin-right',10)

					this
						.$validations
							.appendTo(
								this
									.$field
							)

					can.trigger(
						this.element
					,	'shown.sigma.field'
					,	this.options.name
					)
				}

			,	_render_horizontal: function()
				{
					can.$('<div>')
						.addClass(this.options['field-col'])
						.addClass(this.getOffset())
						.append(
							can.$('<div>')
								.addClass('checkbox')
								.append(
									this
										.element
											.find('label')
								)
						)
						.appendTo(
							this.element
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

			,	resetData: function()
				{
					this.$field.attr('checked',false)

					this.$field.data('value',undefined)
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

			,	'label.sigma.field': function()
				{
					this.done.attr('label',true)
					this._render_field()
				}

			,	'field.sigma.field': function()
				{
					this.done.attr('field',true)
					this._render_position()
				}
			}
		)
	}
)