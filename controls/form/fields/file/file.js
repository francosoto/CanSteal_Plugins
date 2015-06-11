steal(
	'controls/form/fields'
,	'controls/upload'
).then(
	function()
	{
		Sigma.Form.Fields(
			'Sigma.Fields.File'
		,	{
				defaults:
				{
					name: 'default_name'
				,	label: 'default_label'
				,	'field-col': 'col-md-7'
				,	'label-col': 'col-md-3'
				,	id: undefined
				,	'class': undefined
				,	validate: undefined
				,	open: 'Abrir'
				,	upload: 'Importar'
				,	remove: 'Quitar'
				,	reopen: 'Cambiar'
				}
			}
		,	{
				_render_field: function()
				{
					this.uploadControl
					=	new	Sigma.Upload(
							can.$('<div>')
								.addClass('upload-box')
								.appendTo(
									this.$element
								)
						,	{
								data:
								{
									open:	this.options.open
								,	upload:	this.options.upload
								,	remove:	this.options.remove
								,	reopen:	this.options.reopen
								}
							,	ajax:	this.options.ajax
							,	fileExtensions:	this.options.fileExtensions
							}
						)

					this.$field
					=	this.uploadControl.element

					var	attrs
					=	new can.Observe(
							_.pick(
								this.options
							,	['name','id','class']
							)
						)
					,	$input
					=	this.element.find('input')

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

					this._super()
				}

			,	_render_form: function()
				{
					this._super()

					this
						.$field
							.removeClass('form-control')
				}

			,	_render_inline: function()
				{
					this._super()

					this
						.$field
							.removeClass('form-control')
				}

			,	_render_horizontal: function()
				{
					this._super()

					this
						.$field
							.removeClass('form-control')
				}

			,	resetData: function()
				{
					this.element.find('.fileupload-remove').click()
				}

			,	getValue: function()
				{
					return	this.element.find('input').data('file').name
				}

			,	getData: function()
				{
					return	this.element.find('input').data('file')
				}
			}
		)
	}
)