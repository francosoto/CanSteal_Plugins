steal(
	'sigma/controls/form'
,	'sigma/controls/modal'
).then(
	function()
	{
		Sigma.Form(
			'Sigma.Form.Modal'
		,	{
				pluginName:	'sigma_form_modal'
			,	defaults:
				{
					title: ''
				,	onHide: undefined
				,	onHidden: undefined
				,	onShow: undefined
				,	onShown: undefined
				,	hideOnSubmit: true
				}
			}
		,	{
				_render_content: function(data)
				{
					this.Modal
					=	new	Sigma.Modal(
							this.element
						,	{
								data:
								{
									title: this.options.title
								}
							,	onHide: this.options.onHide
							,	onHidden: this.options.onHidden
							,	onShow: this.options.onShow
							,	onShown: this.options.onShown
							}
						)

					can.$('<form>')
						.appendTo(
							this.element.find('.modal-body')
						)

					this._super(data)
				}

			,	_render_button: function($formGroup,field)
				{
					var	$buttonGroup
					=	this.element.find('.modal-footer')

					var	$field
					=	can.$('<button>')
							.appendTo($buttonGroup)

					$formGroup
						.parent()
							.remove()

					$buttonGroup
						.addClass('col-md-offset-4')

					$field
						.attr(
							{
								name:	field.name
							,	'class':	'btn pull-right' + ' ' + (field['class'] || 'btn-default') + ' ' + (field.submit && 'submit-button')
							,	id:		field.id || ''
							,	type: field.type
							}
						)

					$field
						.text(
							field.label
						)

					if	(field.submit)
						this.submited
						=	false						
				}

			,	'submited.sigma.form': function(el,ev)
				{
					if	(this.options.hideOnSubmit)
							this.Modal.element.modal('hide')
				}
			}
		)
	}
)