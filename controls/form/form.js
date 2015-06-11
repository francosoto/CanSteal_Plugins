steal(
	'lib'
,	'plugin'
,	'can/util/string/deparam'
,	'controls/control'
,	'controls/modal'
,	'controls/form/fields/text'
,	'controls/form/fields/select'
,	'controls/form/fields/checkbox'
,	'controls/form/fields/button'
,	'controls/form/fields/radio'
,	'controls/form/fields/textarea'
,	'controls/form/fields/static'
,	'controls/form/fields/date'
,	'controls/form/fields/autocomplete'
,	'controls/form/fields/file'
,	'controls/form/fields/password'
,	'controls/form/fields/btn-group'
,	'controls/form/fields/legend'
,	'controls/form/fields/colorpicker'
// ,	'controls/form/fields/email'
).then(
	function()
	{
		Sigma.Control(
			'Sigma.Form'
		,	{
				pluginName:	'sigma_form'
			,	defaults:
				{
					submitText:	'Guardando...'
				,	'field-col':'col-md-9'
				,	'label-col':'col-md-3'
				,	autoReset:	true
				}
			}
		,	{
				_render_content: function(data)
				{
					var	$form
					=	this.getForm()

					this.$form
					=	$form

					this.fields
					=	new can.Observe()

					this.fieldControls
					=	new can.Observe()

					this.validations
					=	new can.Observe()

					this.hasRequired
					=	false

					if	(!(this.options.default_data instanceof can.Observe))
						this.options.default_data
						=	new can.Observe(this.options.default_data)

					if	(
							!_.contains(
								['form','form-inline','form-horizontal']
							,	this.options.type
							)
						)
							this.options.type = 'form'

					if	(_.isEmpty(this.options['class']))
						this.options['class'] = ''
					else
						this.options['class'] += ' '

					var	attrs
					=	new can.Observe(
							{
								id:			this.options.id
							,	'class':	this.options['class']+this.options.type
							,	onsubmit:	"return false;"
							}
						)

					attrs
						.each(
							function(val,attr)
							{
								$form
									.attr(
										attr
									,	val
									)
							}
						)

					this.setFields()

					this[
							data instanceof can.Observe.List
							?	'_render_fields'
							:	'_render_columns'
						]($form,data)
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
					if	(_.isBoolean(this.hasRequired) && !this.hasRequired)
						this.hasRequired
						=	_.isBoolean(field.required) &&	field.required

					if	(field.type && !_.isUndefined(Sigma.Fields[can.capitalize(field.type)]))	
					{
						this
							.fieldControls
								.attr(
									field.name
								,	new	Sigma.Fields[can.capitalize(field.type)](
										can.$('<div>')
											.addClass('form-group')
											.appendTo(
												$form
											)
									,	field
											.attr(
												{
													position:	this.options.type
												,	value:		_.isUndefined(this.options.default_data.attr(field.name))
																?	field.value
																:	this.options.default_data.attr(field.name) instanceof can.Observe
																	?	this.options.default_data.attr(field.name+'.data')
																		?	this.options.default_data.attr(field.name+'.data')
																		: 	this.options.default_data.attr(field.name+'.value')
																			?	this.options.default_data.attr(field.name+'.value')
																			: 	this.options.default_data.attr(field.name)
																	: 	this.options.default_data.attr(field.name)
												,	'field-col': field['field-col'] || this.options['field-col']
												,	'label-col': field['label-col'] || this.options['label-col']
												,	model_form: 		this.options.model
												}
											)
									)
								)
						if	(_.isEqual(field.type,'file'))
							$form
								.attr('enctype','multipart/form-data')
					}
					else
						steal.dev.log('Form: Field Type '+field.type+' unknown...')

					if	(_.isBoolean(field.submit) && field.submit)
						this.submitButton = this.fieldControls.attr(field.name)
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

			,	resetForm: function()
				{
					this
						.fieldControls
							.each(
								function(fieldControl)
								{
									fieldControl
										.resetField()
								}
							)
				}

			,	setFields: function()
				{
					var	self
					=	this

					this.options.data
							.each(
								function(col_or_field)
								{
									if	(col_or_field instanceof can.Observe.List)
										col_or_field
											.each(
												can.proxy(self.setField,self)
											)
									else
										self.setField(col_or_field)
								}
							)
				}

			,	setField: function(field)
				{
					this.fields
						.attr(
							field.name
						,	false
						)
						
					if(!_.isEqual(field.type,'legend'))
					{
						this.validations
							.attr(
								field.name
							,	field.required ? false : true
							)
					}
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

			,	'shown.sigma.field': function(el,ev,name)
				{
					this	
						.fields
							.attr(
								name
							,	true
							)

					this.triggerReady()
				}

			,	triggerReady:function()
				{
					var	i
					=	0
					
					this
						.fields
							.each(
								function(val,attr)
								{
									if	(!val)
										return false
									i++
								}
							)

					if	(_.isEqual(i,_.keys(this.fields.attr()).length))
						can.trigger(
							this.element
						,	'ready.sigma.form'
						)
				}

			,	getFormData: function()
				{
					var	formData
					=	new can.Observe()

					this
						.fieldControls
							.each(
								function(control,name)
								{
									if(control.options.attr('type')!='legend')
										formData
											.attr(
												name
											,	{
													value:	!_.isUndefined(control.getValue) && control.getValue()
												,	data:	!_.isUndefined(control.getData) && control.getData()
												}
											)
								}
							)

					return	formData
				}

			,	submitForm: function()
				{
					var	self
					=	this

					this.submitStart()

					this
						.options
							.onSubmit(
								this.getFormData()
							,	this
							).then(
								can.proxy(this.submitSuccess,this)
							,	can.proxy(this.submitFail,this)
							).always(
								can.proxy(this.submitEnd,this)
							)
				}

			,	submitStart: function()
				{
					this
						.submitButton
							.toggleButton(
								true
							,	can.$('<span>')
									.append(
										can.$('<i>')
											.addClass('fa fa-spinner fa-spin')
									)
									.append(
										this.options.submitText
									)
							)
				}

			,	submitSuccess: function(data)
				{
					if	(can.isFunction(this.options.onSuccess))
						this.options.onSuccess(data)

					if	(this.options.autoReset)
						this.resetForm()

					can.trigger(
						this.element
					,	'submited.sigma.form'
					,	data
					)
				}

			,	submitFail: function(deferred)
				{
					if	(can.isFunction(this.options.onFail))
						this.options.onFail(deferred)

					can.trigger(
						this.element
					,	'failed.sigma.form'
					,	deferred
					)
				}

			,	submitEnd: function()
				{
					this
						.submitButton
							.toggleButton(
								false
							,	this
									.submitButton
										.options
											.label
							)
				}

			,	check: function()
				{
					var	bool
					=	!_.isEmpty(this.fieldControls.attr())
					,	self
					=	this
					,	fieldControls
					=	this.fieldControls

					this
						.validations
							.each(
								function(val,name)
								{
									if	(!_.isUndefined(fieldControls.attr(name)) && fieldControls.attr(name).element.is(':visible') && (_.isBoolean(val) && !val))	
									{
										bool = false
										return	false;
									}	
								}
							)

					if	(this.element.is(':visible') && bool)
						can.trigger(
							this.element
						,	'validated.sigma.form'
						,	this.shouldISubmit
						)
					else
						can.trigger(
							this.element
						,	'invalidated.sigma.form'
						,	this.shouldISubmit
						)
				}

			,	validateFields: function()
				{
					var	fieldControls
					=	this.fieldControls

					this
						.validations
							.each(
								function(val,name)
								{
									fieldControls
										.attr(name)
											.validateField()
								}
							)
				}

			,	getValue: function(fieldName)
				{
					return	this
								.fieldControls
									.attr(fieldName)
										.getValue()
				}

			,	getData: function(fieldName)
				{
					return	this
								.fieldControls
									.attr(fieldName)
										.getData()
				}

			,	'validated.sigma.validate': function(el,ev,data)
				{
					if(!data)
						this.shouldISubmit = false
					/*else
						this._validated_submit(this.shouldISubmit)*/
				}

			,	'ready.sigma.form': function()
				{
					if	(this.options.type == 'form-inline')
						this
							.$form
								.children(':not(:first)')
									.css('margin-left',5)

					if	(_.isBoolean(this.hasRequired) && this.hasRequired)
						this._render_required_advice()

					if	(!_.isUndefined(this.options.default_data))
						this.check()
				}

			,	'validated.sigma.field': function(el,ev,validation)
				{
					this
						.validations
							.attr(
								validation.field
							,	validation.isValidated
							)
				}

			,	'submit.sigma.form': function(el,ev)
				{
					this.shouldISubmit = true
					
					this.validateFields()
					
					this.check()
				}

			,	'submited.sigma.form': function(el,ev)
				{
					this._shouldISubmitFalse()
				}

			,	'failed.sigma.form': function(el,ev)
				{
					this._shouldISubmitFalse()
				}

			,	'validated.sigma.form': function(el,ev,submit)
				{
					this._validated_submit(submit)
				}

			,	_validated_submit: function(submit)
				{
					if	(!_.isUndefined(this.options.onSubmit) && submit)
						this.submitForm()
				}

			,	'invalidated.sigma.form': function(el,ev)
				{
					this._shouldISubmitFalse()
				}

			,	_shouldISubmitFalse: function()
				{
					this.shouldISubmit = false
				}

			,	' change': function()
				{
					this.check()
				}

			,	'selected.sigma.typeahead': function()
				{
					this.check()
				}

			,	_check_validate_form: function(field)
				{
					return 	_.filter(
								this.options.validate
							,	function(el)
								{
									return	_.contains(el.split(':'),field)
								}
							)
				}

			,	_validations_form: function(field)
				{
					var self
					=	this

					_.forEach(
						this._check_validate_form(field)
					,	function(item,index)
						{
							self[item.split(':')[0]](item.split(':')[1],item.split(':')[2])
						}
					)
				}

			,	diffFields: function(v,ov)
				{
					var completed_fields
					=	this.getValue(ov) && (this.getValue(ov).length != 0 || this.getValue(v).length != 0)
					,	validate
					=	completed_fields && !_.isEqual(this.getValue(v),this.getValue(ov))
					
					if(this.getValue(ov).length != 0 && this.getValue(v).length != 0)
					{
						this._set_validate_field(ov,validate)
						this._set_validate_field(v,validate)
					}

					if(!validate 
					&& this.fieldControls.attr(ov).validateControl.element.find('.help-block').length == 0
					&& completed_fields)
						can.append(
							this.fieldControls.attr(ov)
								.validateControl
									.element
						,	this.fieldControls.attr(ov)
								.validateControl
									.$validateTemplate
										.clone()
											.append(
												'Los valores ingresados en los campos ' + ov + ' y ' + v + ' deben ser distintos.'
											)
						)

					if(this.fieldControls.attr(v).validateControl.element.find('.help-block').length != 0)
					{
						this.fieldControls
							.attr(v)
								.showValidations(false)
					}

					if(this.fieldControls.attr(ov).validateControl.element.find('.help-block').length != 0)
					{
						this.fieldControls
							.attr(ov)
								.showValidations(false)
					}
				}

			,	_set_validate_field: function(field,validate)
				{

					this.fieldControls
						.attr(field)
							.showValidations(validate)

					this.validations
						.attr(
							field
						,	validate
						)
				}

			,	_select_field: function(name)
				{
					return _.find(this.options.data,function(i,e){return i.name == name})
				}
			}
		)
	}
)