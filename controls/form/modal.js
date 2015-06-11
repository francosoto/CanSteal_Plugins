steal(
	'controls/form'
,	'controls/modal'
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
				,	destroyOnHide: true
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
							,	destroyOnHide: this.options.destroyOnHide
							}
						)

					can.$('<form>')
						.appendTo(
							this.element.find('.modal-body')
						)

					this.$buttonGroup
					=	this
							.element
								.find('.modal-footer')
									.addClass('col-md-offset-4')

					this._super(data)
				}

			,	_render_field: function($form,field)
				{
					if	(_.isEqual(field.type,'button') && (_.isBoolean(field.submit) && field.submit))	{
						this
							.fieldControls
								.attr(
									field.name
								,	new	Sigma.Fields.Button(
										this.$buttonGroup
									,	field
											.attr(
												{
													position:	this.options.type
												,	value:		_.isUndefined(this.options.default_data.attr(field.name))
																?	field.value
																:	this.options.default_data.attr(field.name)
												}
											)
									)
								)
						this
							.$buttonGroup
								.html(
									this
										.fieldControls
											.attr(field.name)
												.element
													.find('button')
								)

						this.submitButton = this.fieldControls.attr(field.name)
					}	else
						this._super($form,field)
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