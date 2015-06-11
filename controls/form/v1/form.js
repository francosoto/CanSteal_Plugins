steal(
	'sigma/lib'
,	'can/util/string/deparam'
,	'sigma/controls/control'
,	'sigma/controls/upload'
,	'sigma/controls/date'
,	'sigma/controls/email'
,	'sigma/controls/modal'
).then(
	function(){
		Sigma.Control(
			'Sigma.Form'
		,	{
				pluginName:	'sigma_form'
			,	defaults:
				{
					/*
						data -> Campos del Formulario
						Tipo: Objeto o Array
						Si es un Objeto define la columna en la que se situa.
						Si es un Array define los campos que forman parte del formulario

						Ejemplo de Objeto
						{
							nombreColumna1: ArrayDeCamposDeLaColumna2
						,	nombreColumna2: ArrayDeCamposDeLaColumna2
						}

						Ejemplo de Array
						[
							Campo1
						,	Campo2
						,	Campo3
						]

						Campo -> Campo del Formulario
						Tipo: Objeto

						Estructura:
						(Basica)
						{
							type:	TipoDeCampo
						,	name:	NombreDelCampo
						,	label:	LabelDelCampo 
						}

						(Avanzada)

						Algunos Campos permiten datos extras
						
						Campo del Tipo Select
						{
							options: OptionsDelSelect Array con opciones
						,	ajax: Deferred o bien Objeto Ajax
						}
					
						Campo del Tipo Autocomplete
						{
							ajax: Objeto Ajax donde realizar la consulta
						}

						Campo del Tipo Date
						{
							format: FormatoDeLaFecha
						,	weekStart: Dia de la semana con que se comienza la semana (-6;6)
						,	viewMode: Vista con la que se inicia. {days,months,years}
						,	minViewMode: Limite de la Vista. {days,months,years}
						}

						Campo del Tipo File
						{
							ajax: Objeto Ajax donde realizar el upload
						,	onSuccess: Funcion a realizar si la peticion es correcta
						,	onFail: Funcion a realizar si la peticion es falla
						,	onComplete: Funcion a realizar si la peticion termina (de forma correcta o incorrecta)
						}

						Campo del Tipo Button
						{
							ajax: Objeto Ajax donde realizar una consulta
						,	onSuccess: Funcion a realizar si la peticion es correcta
						,	onFail: Funcion a realizar si la peticion es falla
						,	onComplete: Funcion a realizar si la peticion termina (de forma correcta o incorrecta)
						}

						Datos extras comunes para los campos
						{
							required:	Si es requerido o no. {true,false}
						,	validate:	Funcion de validacion del campo. [Function]
						,	id:			IdDelCampo
						,	'class':		Clase o Clases extras para el campo
						}

						TipoDeCampos
						text			> Input del Tipo Text
						password		> Input del Tipo Password
						checkbox		> Input del Tipo Checkbox
						radio			> Input del Tipo Radio
						date			> Input del Tipo Text que utiliza un Plugin de Seleccion de Fechas
						email			> Input del Tipo Text que valida mails
						autocomplete	> Input del Tipo Text que tiene Autocomplete
						select			> Select
						textarea		> Textarea
						file			> Input del Tipo File que utiliza el Plugin Sigma.Upload
						button			> Button del formulario
						legend			> Leyenda

					*/
					data:	undefined
					//	Clase/s a agregar al formulario
				,	'class':	''
					//	Id/s a agregar al formulario
				,	id:		''
					//	Tipo de Formulario {form-inline,form-horizontal}
				,	type:	''
				,	default_data: undefined
				,	onSubmit: undefined
				}
			}
		,	{
				_render_content: function(data)
				{
					var	$form
					=	this.getForm()

					this.$form
					=	$form

					this.toBeValidated
					=	new can.Observe()

					this.submited
					=	true

					this.requireds
					=	new can.Observe.List()
					
					$form
						.attr(
							{
								id:		this.options.id
							,	'class':	'sigma_form '+this.options['class'] +' '+ this.options.type
							,	onsubmit: "return false;"
							}
						)

					this[
							data instanceof can.Observe.List
							?	'_render_fields'
							:	'_render_columns'
						]($form,data)

					if	(this.formHasRequired)
						this._render_required_advice()

					can.trigger(
						this.$form
					,	'form_ready'
					)

					if	(this.options.default_data)
						this._check_validations()
				}

			,	_render_columns: function($form,columns)
				{
					$form
						.addClass('row')

					columns
						.each(
							can.proxy(
								this._render_column
							,	this	
							,	$form
							,	Math.floor(12/can.Observe.keys(columns).length)
							)
						)
				}

			,	_render_column: function($form,col_length,fields,col_name)
				{
					var	$column
					=	can.$('<div>')
							.addClass(
								'col-md-'+col_length
							)
							.appendTo($form)

					$column
						.attr(
							{
								id:	col_name	
							}
						)

					this._render_fields($column,fields)
				}

			,	_render_fields: function($form,fields)
				{
					fields
						.each(
							can.proxy(
								this._render_field
							,	this	
							,	$form
							)
						)
				}

			,	_render_field: function($form,field)
				{
					if	(can.isFunction(this['_render_'+field.type]))
					{
						var	$formGroup
						=	can.$('<div>')
								.addClass('form-group')
								.addClass((field.name && field.name)+'-form-group')
								.appendTo($form)
						,	$controlGroup
						=	$formGroup
						,	self
						=	this

						this._render_label($formGroup,field)

						if	(this.options.type=='form-horizontal')
						{
							$formGroup
								.find('label')
									.addClass(field['label-col'] || 'col-md-4')
							$controlGroup
							=	can.$('<div>')
									.appendTo($formGroup)
									.addClass(field['field-col'] || 'col-md-8')
						}

						if	(this.options.default_data && !_.isUndefined(this.options.default_data.attr(field.name)))
							field.attr('value',this.options.default_data.attr(field.name))

						this['_render_'+field.type]($controlGroup,field)

						if 	(field.note)
							this._render_note($controlGroup,field)

						if	(field.help)
							this._render_help($controlGroup,field)	

						if	(field.addon)
							this._render_addon($controlGroup,field)	

						if	(field.required)
							this._render_required($formGroup,field)

						field
							.bind(
								'change'
							,	function(ev,attr,how,newVal,oldVal)
								{
									if	(attr == 'required' && newVal && !oldVal)
										self._render_required($formGroup,field)
									else
										if (attr == 'required' && !newVal && oldVal)
										{
											$formGroup
												.find('.text-danger')
													.remove()
											self.requireds
												.splice(self.requireds.indexOf(field.name),1)
										}
								}

							)

						if	(can.isFunction(field.onChange))
							$formGroup
								.bind(
									'change'
								,	function(ev)
									{
										return	field
													.onChange(
													//	Form
														self.$form
													//	Change Event
													,	ev
													//	$field
													,	can.$(ev.target)
													//	field.value
													,	self.getValue(field.name)
													)
									}
								)

						if (field.validate)
							this._render_validate($formGroup,$controlGroup,field)
					}	else
						steal.dev.log("Funcion "+field.type+" no conocida...")
				}

			,	'_render_btn-group': function($formGroup,field)
				{
					var $group
					=	can.$('<div>')
							.attr(
								{
									'class':	'btn-group '+field['class']
								,	id:			field.id	
								}
							)

					$formGroup
						.replaceWith(
							$group
						)

					field.attr('buttons')
							.each(
								can.proxy(
									this['_render_a-button']
								,	this	
								,	$group
								)
							)
				}

			,	_render_required: function($formGroup,field)
				{
					$formGroup
						.find('label')
							.append(
								can.$('<span>')
									.addClass('text-danger')
									.text('*')
							)

					this.formHasRequired
					=	true

					this.requireds
							.push(field.name)
				}

			,	_render_required_advice: function()
				{
					can.append(
						can.$('<span>')
							.addClass('help-block text-center')
							.appendTo(this.$form)
					,	[
							can.$('<span>')
								.addClass('text-danger')
								.text('[*] ')
						,	can.$('<span>')
								.text(' Indica que el campo es obligatorio.')
								.prepend(
									can.$('<i>')
										.addClass('fa fa-angle-double-right')
								)
						]
					)
				}

			,	_render_help: function($formGroup,field)
				{
					can.$('<i>')
						.addClass('fa fa-question-circle fa-2x text-info')
						.css(
							{
								left: $formGroup.width() + 20
							,	top: 3
							,	position: 'absolute'	
							}
						)
						.tooltip(
							{
								title:	field.help
							,	html: true
							,	container: 'body'
							}
						)
						.appendTo($formGroup)
				}

			,	_render_addon: function($formGroup,field)
				{
					$formGroup
						.addClass('input-group')

					var	$span
					=	can.$('<span>')

					$span
						.addClass(field.addon.button ? 'input-group-btn' : 'input-group-addon')
							[(field.addon.where || 'append')+'To'](
								$formGroup
							)

					if	(field.addon.icon)
						$span
							.append(
								can.$('<i>')
									.addClass(field.addon.icon)
							)
					else
						if	(field.addon.button)
							$span
								.append(
									can.$('<button>')
										.html(
											field.addon.button.label
										)
										.attr(
											{
												name:	field.addon.button.name
											,	'class':	'btn pull-right' + ' ' + (field.addon.button['class'] || 'btn-default')
											,	id:		field.addon.button.id || ''
											,	type: 'button'
											}
										)
								)
						else
							$span
								.html(
									field.addon.text
								)
				}

			,	_render_note: function($formGroup,field)
				{
					can.$('<span>')
						.addClass('help-block')
						.html(field.note)
						.appendTo(
							$formGroup
						)
				}

			,	_render_label: function($formGroup,field)
				{
					var	$label
					=	can.$('<label>')
							.appendTo($formGroup)

					if	(this.options.type=='form-horizontal')
						$label
							.addClass('control-label')

					$label
						.attr(
							{
								'for': field.attr('name')	
							}
						)
						.html(
							field.attr('label')
						)
				}

			,	_render_text: function($formGroup,field)
				{
					this._render_input($formGroup,field)
				}

			,	_render_password: function($formGroup,field)
				{
					this._render_input($formGroup,field)
				}

			,	_render_checkbox: function($formGroup,field)
				{
					this._render_input($formGroup,field)

					$formGroup
						.addClass(field['field-col'] || 'col-md-offset-4')

					$formGroup
						.addClass(
							(this.options.type=='form-horizontal')
							?	'checkbox'
							:	'checkbox-inline'
						).prependTo(
							$formGroup
								.parents('.form-group')
						)
					
					$formGroup
						.find('input')
							.removeClass('form-control')
							.prependTo(
								$formGroup
									.parents('.form-group')
										.find('label')
										.removeClass(field['label-col'] || 'col-md-4')
										.appendTo(
											$formGroup
										)
							)

					this._set_default_radio_or_checkbox($formGroup,field)
				}

			,	_render_radio: function($formGroup,field)
				{
					this._render_input($formGroup,field)

					$formGroup
						.find('input')
							.removeClass('form-control')
							.prependTo(
								$formGroup
									.find('label')
							)

					$formGroup
						.addClass(
							(this.options.type=='form-horizontal')
							?	'radio'
							:	'radio-inline'
						)

					this._set_default_radio_or_checkbox($formGroup,field)
				}

			,	_set_default_radio_or_checkbox: function($formGroup,field)
				{
					if	(field.value != undefined)
						$formGroup
							.find('input[value="'+this.getFieldValue(field)+'"]')
								.prop('checked', 'checked')
				}

			,	getFieldValue: function(field)
				{
					return	field.value instanceof can.Observe
							?	field.value.getValue()
							:	field.value
				}

			,	_render_autocomplete: function($formGroup,field)
				{
					this._render_input($formGroup,field)

					new	Sigma.Autocomplete(
						$formGroup
							.find('input')
								.attr(
									{
										type: 'text'
									}
								)
					,	field
					)
				}

			,	_render_email: function($formGroup,field)
				{
					this._render_input($formGroup,field)

					var	$inputAppend
					=	can.$('<div>')
							.addClass('input-group')
							.appendTo($formGroup)

					$formGroup
						.find('input')
							.attr('type','text')
							.appendTo(
								$inputAppend
							)
					
					can.$('<i>')
						.addClass('fa fa-envelope')
						.appendTo(
							can.$('<span>')
								.addClass('input-group-addon')
								.appendTo(
									$inputAppend
								)
						)

					new	Sigma.Email($inputAppend.find('input'))
				}

			,	_render_date: function($formGroup,field)
				{
					this._render_input($formGroup,field)

					var	$inputAppend
					=	can.$('<div>')
							.addClass('input-group')
							.appendTo($formGroup)

					$formGroup
						.find('input')
							.attr('type','text')
							.appendTo(
								$inputAppend
							)
					
					can.$('<i>')
						.addClass('fa fa-calendar')
						.appendTo(
							can.$('<span>')
								.addClass('input-group-addon')
								.appendTo(
									$inputAppend
								)
						)

					// new	Sigma.DatePicker(
					// 	$formGroup
					// 		.find('input')
					// 			.attr(
					// 				{
					// 					type: 'text'
					// 				}
					// 			)
					// ,	{
					// 		format: field.format
					// 	,	weekStart: field.weekStart
					// 	,	viewMode: field.viewMode
					// 	,	minViewMode: field.minViewMode
					// 	}
					// )
				}

			,	_render_input: function($formGroup,field)
				{
					var	$field
					=	can.$('<input>')
							.appendTo($formGroup)

					if	(can.isFunction(field.transform))	
						$field
							.bind(
								'keyup'
							,	function(ev)
								{
									if	(ev.keyCode == 13)
										$field
											.prop(
												'value'
											,	field
													.transform(
														$field.val()
													)
											)
								}
							)

					$field
						.attr(
							{
								name:	field.name
							,	type:	field.type 
							,	'class':	'form-control '+ (field['class'] || '')
							,	id:		field.id || ''
							,	placeholder:	field.placeholder || ''
							,	value: (field.type != 'autocomplete') && this.getFieldValue(field) || ''
							}
						)
				}

			,	_render_select: function($formGroup,field)
				{
					var	$select
					=	can.$('<select>')
							.appendTo($formGroup)

					if	(field.attr('multiple'))
						$select
							.attr('multiple','multiple')

					$select
						.attr(
							{
								name:	field.name
							,	'class':	'form-control ' + (field['class'] || '')
							,	id:		field.id || ''
							}
						)

					if	(field.options instanceof can.Observe.List)
					{
						this._render_select_options($select,field.options)
						this._set_select_default($select,field)
					}
					else
					{
						var	optionsDefferred
						=	can.isDeferred(field.options)
							?	field.options
							:	field.ajax
								?	can.ajax(
										field.ajax
									)
								:	false

						if	(optionsDefferred)
							optionsDefferred
								.pipe(
									function(options)
									{
										return	new	can.Observe.List(options)
														.each(
															function(option)
															{
																option
																	.attr(
																		{
																			getLabel: function()
																			{
																				return	this.attr(field.label_key)
																			}
																		,	getValue: function()
																			{
																				return	this.attr(field.value_key)
																			}
																		}
																	)
															}
														)
									}
								)
								.then(
									can.proxy(
										this._render_select_options
									,	this	
									,	$select
									)
								).then(
									can.proxy(
										this._set_select_default
									,	this
									,	$select
									,	field
									)
								)

					}
				}

			,	_render_select_options: function($select,options)
				{
					var	$option
					=	can.$('<option>')
							.attr('value',-1)
							.text('Seleccione una opción...')
							.data('value',null)
							.appendTo($select)

					options
						.each(
							function(option)
							{
								var	$option
								=	can.$('<option>')
										.data('value',option)
										.appendTo($select)

								$option
									.attr(
										{
											value:	can.isFunction(option.getValue)
													?	option.getValue()
													:	option.attr('value')
										}
									)

								$option
									.text(
										can.isFunction(option.getLabel)
										?	option.getLabel()
										:	option.attr('label')
									)
							}
						)
				}

			,	_set_select_default: function($select,field)
				{
					if	(field.value != undefined)
						$select
							.find('option[value="'+this.getFieldValue(field)+'"]')
								.prop('selected', 'selected')
				}

			,	_render_textarea: function($formGroup,field)
				{
					var	$field
					=	can.$('<textarea>')
							.appendTo($formGroup)

					$field
						.attr(
							{
								name:	field.name
							,	'class':	'form-control ' + (field['class'] || '')
							,	id:		field.id || ''
							,	cols:	field.cols || 0
							,	rows:	field.rows || 0
							,	placeholder:	field.placeholder || ''
							,	maxlength: field.maxlength
							}
						)

					if	(field.value)
						$field.val(field.value)
				}

			,	_render_file: function($formGroup,field)
				{
					this.$form
							.attr('enctype','multipart/form-data')

					this.uploadFile
					=	new	Sigma.Upload(
							$formGroup
						,	{
								data:
								{
									open:	field.open || 'Abrir'
								,	upload:	field.upload || 'Importar'
								,	remove:	field.remove || 'Quitar'
								,	reopen:	field.reopen || 'Cambiar'
								}
							,	ajax:	field.ajax
							,	fileExtensions:	field.fileExtensions
							}
						)

					$formGroup
						.find('input')
							.attr(
								{
									name:	field.name
								,	type:	field.type 
								,	'class':	'form-control '+ (field['class'] || '')
								,	id:		field.id || ''
								,	placeholder:	field.placeholder || ''
								,	value: field.value || ''
								}
							)
				}

			,	'_render_a-button': function($formGroup,field)
				{
					var	$field
					=	can.$('<a>')
							.appendTo($formGroup)

					$field
						.attr(
							{
								name:	field.name
							,	'class':	'btn' + ' ' + (field['class'] || 'btn-default') + ' ' + (field.submit && 'submit-button')
							,	id:		field.id || ''
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

			,	_render_button: function($formGroup,field)
				{
					var	$field
					=	can.$('<button>')
							.appendTo($formGroup)

					$formGroup
						.parent()
						.find('label')
							.remove()

					$formGroup
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

			,	'.submit-button click': function(el,ev)
				{
					if	(
							can.isFunction(this.options.onSubmit)
						&&	this.isReadyToSubmit()
						)
					{
						var	originalText
						=	can.$(el).text()
						,	self
						=	this

						if	(this.options.onSubmitText)
							can.$(el).html(this.options.onSubmitText)
						
						can.$('<i>')
							.addClass('fa fa-spinner fa-spin')
							.css('margin-left','5px')
							.appendTo(can.$(el))

						can.$(el).prop('disabled',true)

						this.options.onSubmit(this.getFormData(),this)
							.done(
								function(data)
								{
									self.submited=true
									self.submitedData=data

									if	(can.isFunction(self.options.onSuccess))
										self.options.onSuccess(data)

									can.trigger(
										self.element
									,	'submited.sigma.form'
									)
								}
							)
							.fail(
								function(result)
								{
									// var	data
									// =	(can.fixture && can.fixture.on)
									// 	?	result.statusText && JSON.parse(result.statusText)
									// 	:	result.responseText && JSON.parse(result.responseText)
									// new Sigma.Modal(
									// 	can.$('<div>')
									// ,	{
									// 		type: 'alert-danger'
									// 	,	data:
									// 		new can.Observe(
									// 			{
									// 				title:		'Error: '+data.error
									// 			,	content:	data.message
									// 			}
									// 		).attr(
									// 			self.options.submitModalData || {}
									// 		)	
									// 	}
									// )
									if	(can.isFunction(self.options.onFail))
										self.options.onFail(data)
								}
							)
							.always(
								function()
								{
									if 	(self.element)
										self.getForm().change()
									can.$(el).html(originalText)
									can.$(el).prop('disabled',false)
								}
							)
					}	else
						this._check_validations()
				}

			,	_render_legend: function($formGroup,field)
				{
					var	$field
					=	can.$('<legend>')
							.appendTo($formGroup)

					$formGroup
						.removeClass('col-md-8')
						.addClass((this.options.type=='form-horizontal') ? 'col-md-12' : '')
						.parent()
						.find('label')
							.remove()

					$field
						.attr(
							{
								'class':	(field['class'] || '')
							,	id:		field.id || ''
							}
						)

					$field
						.html(
							field.label
						)
				}

			,	_render_validate: function($formGroup,$controlGroup,field)
				{
					var self
					=	this
					,	$validation_div
					=	can.$('<div>')
							.addClass('validation')
							.addClass(field['field-col'] || (this.options.type=='form-horizontal') ? 'col-md-offset-4' : '')
							.css(
								(this.options.type=='form-horizontal')
								?	{
										'padding-left':	'15px'
									,	'padding-top': '35px'
									}
								:	{}
							)
							.appendTo(
								$formGroup
							)
							.hide()

					this.toBeValidated
							.attr(field.name,false)
					
					can.bind.call(
						$formGroup
					,	'change'
					,	function(ev)
						{
							self._validate_field(field)
						}
					)

					// if	(field.value != undefined)
					// 	self._validate_field(field)
				}

			,	_check_validations: function()
				{
					var self
					=	this

					self.options.data
							.each(
								function(field_or_col)
								{
									if	(field_or_col instanceof can.Observe.List)
										field_or_col
											.each(
												function(field)
												{
													if	(field.validate)
														self._validate_field(field)
												}
											)
									else
										if	(field_or_col instanceof can.Observe && field_or_col.attr('validate'))
											self._validate_field(field_or_col)
								}
							)
				}


			,	_validate_field: function(field)
				{
					var	$formGroup
					=	this.element.find('[name='+field.name+']').parents('.form-group')
					,	value
					=	this.getValue(field.name)
					
					this.toBeValidated.attr(field.name,true)

					$formGroup
						.find('.validation')
						.empty()
						.show()

					if	(field.validate instanceof can.Observe.List)
						field
							.validate
								.each(
									can.proxy(
										this.validate
									,	this
									,	field
									,	$formGroup
									,	value
									)
								)
					else
						this.validate(field,$formGroup,value,field.validate)
				}

			,	validate: function(field,$formGroup,value,validation)
				{
					var	resolvedValidation
					=	can.isFunction(validation)
						?	validation(value)
						:	_.isString(validation) && can.isFunction(this[validation.split(':')[0]])
							?	this[validation.split(':')[0]](value,validation.split(':')[1])
							: 	_.isString(validation.validate) && can.isFunction(this[validation.validate.split(':')[0]])
								?	{
										validate: this[validation.validate.split(':')[0]](
														value
													,	validation.validate.split(':')[1]
													).validate
									,	msg: 	  validation.msg
									}
								:	{
										validate:	false
									,	msg:	'Tipo de validacion desconocida'
									}
					
					if	(can.isDeferred(resolvedValidation))
						resolvedValidation
							.done(
								can.proxy(this._render_validation,this,field,$formGroup)
							)
					else
						this._render_validation(field,$formGroup,resolvedValidation)
				}

			,	_render_validation: function(field,$formGroup,validation)
				{
					if	(validation.validate == false)
					{
						$formGroup
							.removeClass('has-success')
							.addClass('has-error')

						can.$('<span>')
							.addClass('help-block')
							.html(validation.msg)
							.prepend(
								can.$('<i>')
									.addClass('fa fa-warning')
									.css('margin-right','10px')
							)
							.appendTo(
								$formGroup
									.find('.validation')
							)

						this
							.toBeValidated
								.attr(
									field.name
								,	false
								)
					}

					if	(this.toBeValidated.attr(field.name))
						$formGroup
							.removeClass('has-error')	
							.addClass('has-success')
				}

			,	getValidateForm: function()
				{
					return this.$form.is(':visible') && this.isReadyToSubmit() && this.submited
				}

			,	isReadyToSubmit: function()
				{
					var	bool
					=	true
					,	$form
					=	this.$form
					,	self
					=	this

					// this._check_validations()

					this.toBeValidated
							.each(
								function(val,attr)
								{
									if	(
											$form.find('.'+attr+'-form-group').is(':visible') 
										&&	(val == false)
										)
											{
												bool = false
												return false
											}
								}
							)

					return bool
				}

			,	getForm: function()
				{
					return	this.element.is('form')
							?	this.element
							:	this.element.find('form').length == 0
								?	can.$('<form>')
										.appendTo(
											this.element
										)
								:	this.element.find('form')
				}

			,	getFieldElement: function(field_name)
				{
					return	this.element.find('[name="'+field_name+'"]')
				}

			,	getValue: function(field_name)
				{
					var	$field
					=	this.getFieldElement(field_name)
													
					return	$field.is('select')
							?	$field.find('option:selected').data('value')
							:	$field.is('input') && $field.attr('type') == 'file'
								?	$field.data('file')
									?	$field.data('file').name
									:	""
								:	$field.is('.sigma_autocomplete')
									?	$field.data('value')
									:	can.trim($field.val())
				}

			,	getValueData: function(field_name)
				{
					var	$field
					=	this.getFieldElement(field_name)

					return	$field.is('.sigma_autocomplete')
								?	$field.data('value')
								: 	can.trim($field.val())
				}
				
			,	getFormValues: function()
				{
					var	values
					=	new can.Observe()
					,	self
					=	this

					// this.$form
					// 		.find('.form-group')
					// 			.each(
					// 				function()
					// 				{
					// 					var	$field
					// 					=	can.$(this).find('input, select, textarea')
					// 					values
					// 						.attr(
					// 							$field.attr('name')
					// 						,	$field.is('.sigma_autocomplete')
					// 							?	self.getValueData($field.attr('name'))
					// 							:	self.getValue($field.attr('name'))
					// 						)
					// 				}
					// 			)

					this.options.data
						.each(
							function(val,index)
							{
								if	(val instanceof can.Observe.List)
									val
										.each(
											function(field)
											{
												values
													.attr(
														field.name
													,	self.getValue(field.name)
													)
											}
										)
								else
									values
										.attr(
											val.name
										,	self.getValue(val.name)
										)
							}
						)

					return	values
				}

			,	getFormData: function()
				{
					return	{
								form:	(this.$form.attr('enctype') == 'multipart/form-data')
										?	new FormData(this.$form)
										:	can.deparam(this.$form.serialize())
							,	submited:	this.submitedData
							,	values: this.getFormValues()
							}
				}

			,	setRequired: function(bool,field)
				{
					this.options.data
						.each(
							function()
							{
								if(this.name == field)
								{
									can.extend(
										this
									,	{
											required:true
										}
									)
									if(_.isArray(this.validate))
										this.validate.push('required')
									return false
								}
							}
						)
				}

			,	getAjaxSetup: function()
				{
					return	(this.$form.attr('enctype') == 'multipart/form-data')
							?	this.uploadFile.getAjaxSetup()
							:	{}
				}

			,	'integer': function(n)
				{
					return	{
								validate:	!isNaN(+n) && !(+n % 1)
							,	msg:	'El valor ingresado debe ser un número entero.'
							}
				}

			,	'float': function(n)
				{
					return	{
								validate: !(!/^([0-9])*[.]?[0-9]*$/.test(n))
							,	msg:	'El valor ingresado debe ser un número punto flotante.'
							}
				}

			,	'string': function(str)
				{
					return	{
								validate:	typeof str == "string" || (typeof str == "object" && str["constructor"] === String)
							,	msg:	'El campo debe ser alfabetico.'
							}
				}

			,	required: function(v)
				{
					return	{
								validate: (v+'').length != 0
							,	msg:	'El campo es requerido.'
							}
				}

			,	alphanumeric: function(v)
				{
					return	{
								validate:  /[^a-zA-Z0-9]/.test(v)
							,	msg:	'El valor ingresado debe ser alfanumérico.'	
							}
				}
				
			,	'hour': function(n)
				{
					return	{
								validate: !(!/^([0-9])*[:]?[0-9]*$/.test(n))
							,	msg:	'El valor ingresado debe ser un número punto flotante.'
							}
				}

			,	date: function(d)
				{
					return	{
								validate: can.isValidFullDate(d)
							,	msg: 'La fecha no es válida.'
							}
				}

			,	monthDate: function(d)
				{
					return	{
								validate: can.isValidMonthDate(d)
							,	msg: 'La fecha no es válida.'
							}
				}

			,	futureDate: function(d)
				{
					return	{
								validate: can.isFutureDate(d)
							,	msg: 'La fecha debe de ser en el futuro.'
							}
				}

			,	pastDate: function(d)
				{
					return	{
								validate: can.isPastDate(d)
							,	msg: 'La fecha debe de ser en el pasado.'
							}
				}

			,	today: function(d)
				{
					return	{
								validate: can.isToday(d)
							,	msg: 'La fecha ingresada no es el día de hoy.'
							}
				}

			,	maxLength: function(v,l)
				{
					return	{
								validate: (v+'').length < l
							,	msg: 'El valor ingresado no puede superar los '+l+' caracteres.'
							}
				}

			,	minLength: function(v,l)
				{
					return	{
								validate: (v+'').length > l
							,	msg: 'El valor ingresado debe superar los '+l+' caracteres.'
							}
				}

			,	equal: function(v,ov)
				{
					return	{
								validate:	v == ov
							,	msg:	'El valor ingresado debe ser igual al valor '+ov+'.'
							}
				}

			,	diffFields: function(v,ov)
				{
					var validate
					=	this.getValue(ov) && (this.getValue(ov).length != 0 || v.length != 0) && !_.isEqual(v.attr('nombre'),this.getValue(ov).attr('nombre'))
					,	$formGroup
					=	this.element.find('[name='+ov+']').parents('.form-group')
					,	$validation_div
					=	$formGroup
							.find('.validation')
							.empty()
							.show()
							
					if	(validate && $validation_div.is(':empty') && this.getValue(ov).length != 0)
					{
						$formGroup
							.removeClass('has-error')
							.addClass('has-success')

						$validation_div
							.hide()
					}

					return	{
								validate:	validate
							,	msg:	'El valor ingresado debe ser distinto al valor del campo' + ov + '.'
							}
				}

			,	email: function(v)
				{
					var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

					return	{
								validate:	re.test(v)
							,	msg:	'El valor ingresado debe ser email valido.'
							}
				}
			}
		)
	}
)