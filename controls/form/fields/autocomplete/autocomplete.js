steal(
	'controls/form/fields'
,	'controls/typeahead'
).then(
	function()
	{
		Sigma.Form.Fields(
			'Sigma.Fields.Autocomplete'
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
							,	['name','id','class','disabled','placeholder']
							)
						)
					,	$input
					=	can.$('<input>')
							.attr(
								'type'
							,	'text'
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
					
					$input
						.appendTo(
							this.$element
						)


					new	Sigma.Autocomplete(
						this.$field
						=	$input
					,	this.options
					)

					if	(_.isUndefined(this.options.addon))
					{
						this.options
							.attr(
								'addon'
							,	{
									type: 'icon'
								,	icon: 'fa-search'
								}
							)
					}

					this._super()
				}

			,	'selected.sigma.typeahead': function(el,ev)
				{
					if	(this.validateControl)
						this.validateControl.validateField(
							this.getValue()
						,	this.getData()
						,	this.options.value
							? 	_.isFunction(this.options.value[this.options.display])
								? 	this.options.value[this.options.display]()
								: 	this.options.value[this.options.display]
							: 	this.options.value
						)
				}
			}
		)
	}
)