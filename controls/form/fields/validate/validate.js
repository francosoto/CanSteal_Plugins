steal(
	'lib'
,	'plugin'
,	'can/control'
,	'can/observe'
,	'can/view'
,	'can/view/mustache'
,	'can/construct/super'
,	'can/construct/proxy'
,	'can/control/plugin'
).then(
	function()
	{
		can.Control(
			'Sigma.Fields.Validate'
		,	{
				defaults:
				{
					icon: 'fa-exclamation-triangle'
				,	validations: []
				,	model: undefined
				}
			}
		,	{
				init: function(element,options)
				{
					this.$validateTemplate
					=	can.$('<span>')
							.addClass('help-block')
							.prepend(
								can.$('<i>')
									.addClass('fa')
									.addClass(this.options.icon)
									.css('margin-right','10px')
							)

					this.validations
					=	new can.Observe.List(
							_.map(
								_.range(
									this.options.validations.length
								)
							,	function()
								{
									return	false
								}
							)
						)

					this.unique_validated = false
				}

			,	resetValidations: function()
				{
					this
						.element
							.empty()

					can.trigger(
						this.element
					,	'validated.sigma.validate'
					,	false
					)
				}

			,	validateField: function(val,data,original_value)
				{
					var	$element
					=	this.element
					,	self
					=	this

					$element
						.empty()

					this
						.options
							.validations
								.each(
									function(pos_validation,index)
									{
										self
											.validating(
												can.isFunction(pos_validation)
												?	pos_validation(val,data,original_value)
												:	can.isDeferred(pos_validation)
													?	pos_validation
													:	can.isFunction(self[pos_validation.split(':')[0]])
														?	self[pos_validation.split(':')[0]](val,data,pos_validation.split(':')[1],original_value)
														:	undefined
											,	index
											)
									}
								)
				}

			,	validate: function(index,result)
				{
					if	(_.isBoolean(result.validate) && !result.validate)
						can.append(
							this.element
						,	this
								.$validateTemplate
									.clone()
									.append(
										result.msg
									)
						)

					this.validations.attr(index,_.isBoolean(result.validate) && result.validate)

					this.check()
				}

			,	validating: function(validationResult,index)
				{
					if	(can.isDeferred(validationResult))
						validationResult
							.then(
								can.proxy(this.validate,this,index)
							)
					else
						this.validate(index,validationResult)
				}

			,	check: function()
				{
					var	bool
					=	true

					_.each(
						this.validations
					,	function(val)
						{
							if	(_.isBoolean(val) && !val){
								bool = false
								return	false
							}
						}
					)

					if(this.element)
						can.trigger(
							this.element
						,	'validated.sigma.validate'
						,	bool
						)
				}

			//	Validations

			,	'integer': function(v,d)
				{
					return	{
								validate:	!isNaN(+v) && !(+v % 1)
							,	msg:	'El valor ingresado debe ser un número entero.'
							}
				}

			,	positive: function(v,d)
				{
					return	{
								validate:	(this['integer'](v,d).validate || this['float'](v,d).validate) && v > 0
							,	msg:	'El valor ingresado debe ser un número positivo.'
							}
				}

			,	'select_required': function(v,d)
				{
					return	{
								validate:	!(v < 0)
							,	msg:	'Debe elegir uno de los valores.'
							}
				}

			,	'multi_select_required': function(v,d)
				{
					return	{
								validate:	v && _.isArray(v) && v.length > 0
							,	msg:	'Debe elegir al menos uno de los valores.'
							}
				}

			,	'float': function(v,d)
				{
					return	{
								validate: !(!/^([0-9])*[.]?[0-9]*$/.test(v))
							,	msg:	'El valor ingresado debe ser un número punto flotante.'
							}
				}

			,	'string': function(v,d)
				{
					return	{
								validate:	(_.isNaN(parseFloat(v)) || parseFloat(v).toString().length < v.length) 
										&& ( typeof v == "string" || (typeof v == "object" && v["constructor"] === String))
							,	msg:	'El campo debe ser alfabético.'
							}
				}

			,	required: function(v,d)
				{
					return	{
								validate: (v+'').length != 0
							,	msg:	'El campo es requerido.'
							}
				}

			,	alphanumeric: function(v,d)
				{
					return	{
								validate:  /[^a-zA-Z0-9]/.test(v)
							,	msg:	'El valor ingresado debe ser alfanumérico.'	
							}
				}
				
			,	'hour': function(n,d)
				{
					return	{
								validate: !(!/^([0-9])*[:]?[0-9]*$/.test(n)) 
										? 	parseInt(n.split(':')[0]) < 24
											&& 	parseInt(n.split(':')[1]) < 60
										: 	false
							,	msg:	'El valor ingresado debe ser un número punto flotante.'
							}
				}

			,	date: function(v,d)
				{
					return	{
								validate: d instanceof Date || this.isAValidStringDate(v)
							,	msg: 'La fecha no es válida.'
							}
				}

			,	fullDate: function()
				{
					return	{
								validate: can.isValidDate(v)
							,	msg: 'La fecha no es válida.'
							}
				}

			,	monthDate: function(v,d,d)
				{
					return	{
								validate: can.isValidMonthDate(v)
							,	msg: 'La fecha no es válida.'
							}
				}

			,	futureDate: function(v,d)
				{
					return	{
								validate: can.isFutureDate(v)
							,	msg: 'La fecha debe de ser en el futuro.'
							}
				}

			,	pastDate: function(v,d)
				{
					return	{
								validate: can.isPastDate(v)
							,	msg: 'La fecha debe de ser en el pasado.'
							}
				}

			,	today: function(v,d)
				{
					return	{
								validate: can.isToday(v)
							,	msg: 'La fecha ingresada no es el día de hoy.'
							}
				}

			,	maxLength: function(v,d,l)
				{
					return	{
								validate: (v+'').length <= l
							,	msg: 'El valor ingresado debe tener menos de '+l+' caracteres.'
							}
				}

			,	minLength: function(v,d,l)
				{
					return	{
								validate: (v+'').length >= l || !this.required(v,d).validate
							,	msg: 'El valor ingresado debe tener mas de '+l+' caracteres.'
							}
				}

			,	equal: function(v,d,ov)
				{
					return	{
								validate:	v == ov
							,	msg:	'El valor ingresado debe ser igual al valor '+ov+'.'
							}
				}

			 ,	autocompleted: function(v,d)
			 	{
			 		return	{
			 					validate: !this.required(v).validate || d instanceof can.Observe
			 				,	msg:	'El valor ingresado no es válido.'
			 				}
			 	}

			,	email: function(v,d)
				{
					var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

					return	{
								validate:	!this.required(v).validate || re.test(v)
							,	msg:	'El valor ingresado debe ser email válido.'
							}
				}

			,	unique: function(v,d,l,ov)
				{
					if(!_.isUndefined(this.options.model) 
						&& (!_.isEqual(v,ov+'') || _.isUndefined(ov)) 
						&& this.unique_validated
					)
					{
						return	this.options.model
									.validateUnique(
											l?l:this.options.name
										,	v
										)
					}
					else
					{
						this.unique_validated = _.isEqual(v,ov+'')?false:true

						if(this.unique_validated)
							return	this.options.model
									.validateUnique(
											l?l:this.options.name
										,	v
										)
						else
							return	{
										validate: true
									}
					}
				}

			,	isAValidStringDate: function(string) {
					dateFormat = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
					return dateFormat.test(string) && new Date(string) !== 'Invalid Date';
				}
			}
		)
	}
)