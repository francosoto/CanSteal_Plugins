steal(
	'controls/form/fields'
).then(
	function()
	{
		Sigma.Form.Fields(
			'Sigma.Fields.Textarea'
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
				,	cols: undefined
				,	rows: undefined
				,	readonly: undefined
				}
			}
		,	{
				_render_field: function()
				{
					var	attrs
					=	new can.Observe(
							_.pick(
								this.options
							,	['name','id','class','disabled','cols','rows','readonly']
							)
						)
					,	$textarea
					=	can.$('<textarea>')

					attrs
						.each(
							function(val,attr)
							{
								$textarea
									.attr(
										attr
									,	val
									)
							}
						)

					if	(!_.isUndefined(this.options.value))
						$textarea
							.val(
								this.options.value
							)
					this.$field
					=	$textarea
							.appendTo(
								this.$element
							)

					this._super()
				}
			}
		)
	}
)