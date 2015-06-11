steal(
	'controls/form/fields'
).then(
	function()
	{
		Sigma.Form.Fields(
			'Sigma.Fields.Legend'
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
				/*_render_validations: function()
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

			,*/	setupContent: function()
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
							,	['name','id','class']
							)
						)
					,	$legend
					=	can.$('<legend>')
							.html(
								this.options.label
							)

					attrs
						.each(
							function(val,attr)
							{
								$legend
									.attr(
										attr
									,	val
									)
							}
						)

					this.$field
					=	$legend
							.appendTo(
								this.$element
							)

					this._super()
				}

			,	_render_form: function()
				{
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