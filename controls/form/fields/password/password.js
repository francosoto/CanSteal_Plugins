steal(
	'controls/form/fields'
).then(
	function()
	{
		Sigma.Form.Fields(
			'Sigma.Fields.Password'
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
				,	placeholder: undefined
				,	validate: undefined
				}
			}
		,	{
				_render_field: function()
				{
					var	attrs
					=	new can.Observe(
							_.pick(
								this.options
							,	['name','id','class','disabled','placeholder','value']
							)
						)
					,	$input
					=	can.$('<input>')
							.attr(
								'type'
							,	'password'
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
							.appendTo(
								this.$element
							)

					this._super()
				}
			}
		)
	}
)