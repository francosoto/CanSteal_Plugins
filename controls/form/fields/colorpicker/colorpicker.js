steal(
	'controls/form/fields'
,	'plugin'
).then(
	function()
	{
		Sigma.Form.Fields(
			'Sigma.Fields.Colorpicker'
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
							,	'text'
							)
							.addClass('pick-a-color')

					$input
						.pickAColor(
							{
								showSpectrum:			true
							,	showSavedColors:		true
							,	saveColorsPerElement:	true
							,	fadeMenuToggle:			true
							,	showHexInput:			true
							,	showBasicColors:		true
							,	allowBlank:				true
							}
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

			,	getValue: function()
				{
					return	this.getData().toHexString()
				}

			,	getData: function()
				{
					return	tinycolor(this.$field.val())
				}

			,	'shown.sigma.field': function($input)
				{
					this
						.$field
							.pickAColor()

					this
						.$element
							.find('.caret')
								.remove()

					this
						.$element
							.find('.color-menu')
								.css('left',-(this.$field.outerWidth() + this.$element.find('.hex-pound').outerWidth()))
				}
			}
		)
	}
)