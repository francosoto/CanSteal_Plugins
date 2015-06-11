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
,	'controls/form/fields/validate'
,	'controls/form/fields/addon.js'
).then(
	function()
	{
		can.Control(
			'Sigma.Form.Fields'
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
				,	validate: undefined
				,	value: undefined
				,	model_form: undefined
				}
			}
		,	{
				init: function(element,options)
				{
					var self
					=	this
					
					this.element.addClass(options.name+'-form-group')

					this.setupContent()

					this.$element
					=	can.$('<div>')
							.appendTo(
								this.element
							)

					this.options.validate
					=	this.options.validate instanceof can.Observe.List
						?	this.options.validate
						:	new can.Observe.List(this.options.validate)

					this.options.value 
					= 	this.options.value instanceof can.Observe
						?	this.options.value.attr(this.options.name) && this.options.type != 'autocomplete'
							? 	this.options.value.attr(this.options.name)
							: 	this.options.value
						: 	this.options.value

					if	(this.isRequired())
						this.options.validate.push('required')

					this.options.validate = new can.Observe.List(_.uniq(this.options.validate))

					this._render_validations()

					this._render_content()

					if	(!_.isUndefined(this.options.note))
						this._render_note()

					if	(!_.isUndefined(this.options.help))
						this._render_help()

					if	(!_.isUndefined(this.options.addon) && this.options.type != 'select')
						this._setup_addon()

					if	(this.options.validate.length != 0)
						this._init_validations()

					options
						.bind(
							'change'
						,	function(ev,attr,how,newVal,oldVal)
							{
								if	(attr == 'required' && newVal && !oldVal)
									self._render_required()
								else if (attr == 'required' && !newVal && oldVal)
									self._remove_required()
							}

						)
				}

			, 	_setup_addon: function()
				{
					new	Sigma.Addon(
						this.$field.parent()
					,	this.options.addon
					)
				}

			,	setupContent: function()
				{
					this.done
					=	new can.Observe({label: false, field: false})

					this.$label
					=	can.$()

					this.$field
					=	can.$()

					this.$validations
					=	can.$()
				}

			,	_render_validations: function()
				{
					if	(this.options.validate.length != 0)
						this.validateControl
						=	new	Sigma.Fields.Validate(
								this.$validations
								=	$('<div>')
							,	{
									validations:	this.options.validate
								,	model: 			this.options.model_form
								,	name: 			this.options.name
								}
							)
					else if(this.options.type != 'legend')
						can.trigger(
							this.element
						,	'validated.sigma.field'
						,	{
								field:	this.options.name
							,	isValidated: true
							}
						)
				}

			,	_init_validations: function()
				{
					this
						.$validations
							.appendTo(
								this
									.$element
							)

					if	(!_.isUndefined(this.options.value))
						this
							.validateControl
								.validateField(
									this.getValue()
								,	this.getData()
								,	this.options.value && this.options.type == 'autocomplete'
									? 	_.isFunction(this.options.value[this.options.display])
										? 	this.options.value[this.options.display]()
										: 	this.options.value[this.options.display]
									: 	this.options.value
								)
				}

			,	_render_content: function()
				{
					this._render_label()

					this._render_field()
				}

			,	_render_label: function()
				{
					this.$label
					=	can.$('<label>')
							.html(
								this.options.label
							)
							.attr(
								'for'
							,	this.options.name
							)
							.appendTo(
								this.$element
							)

					if	(_.isBoolean(this.options.required) && this.options.required)
						this._render_required()

					can.trigger(
						this.element
					,	'label.sigma.field'
					)
				}

			,	_render_note: function()
				{
					var	$note
					=	can.$('<span>')
							.addClass('help-block')
							.html(this.options.note)
							.appendTo(
								this
									.element
							)

					if	(_.isEqual(this.options.position,'form-horizontal'))
						$note
							.css('margin-bottom',0)
							.wrap(
								can.$('<div>')
									.addClass(this.options['field-col'])
									.addClass(
										this.getWrapClass()
									)
							)
				}

			,	_render_help: function()
				{
					var	helpPosition
					=	_.isEqual(this.options.position,'form')
						?	{
								left: this.element.width() + 20
							,	'margin-top': -28
							,	position: 'absolute'	
							}
						:	_.isEqual(this.options.position,'form-horizontal')
							?	{
									/*left: this.$label.width() + this.$field.width() + 80
								,*/	'margin-top': 4
								,	position: 'absolute'
								}
							:	{}

					can.$('<i>')
						.addClass('fa fa-question-circle fa-2x text-info')
						.css(
							helpPosition
						)
						.tooltip(
							{
								title:	this.options.help
							,	html: true
							,	container: 'body'
							}
						)
						.appendTo(
							this
								.$element
							)
				}

			,	_render_required: function()
				{
					this.$label
							.append(
								can.$('<span>')
									.addClass('text-danger required')
									.text('*')
							)
				}

			,	_remove_required: function()
				{
					this.$label
							.find('.required')
								.remove()
				}

			,	_render_field: function()
				{
					can.trigger(
						this.element
					,	'field.sigma.field'
					)
				}

			,	_render_position: function()
				{
					var	i
					=	0
					
					this
						.done
							.each(
								function(val,attr)
								{
									if	(!val)
										return false
									i++
								}
							)

					if	(_.isEqual(i,_.keys(this.done.attr()).length))
						this['_render_'+_.last(this.options.position.split('-'))]()					
				}

			,	_render_form: function()
				{
					this
						.$field
							.addClass('form-control')

					var label
					=	this
							.$field
								.parent()
									.find('label')

					this.element.prepend(
						label.clone()
					)

					label.remove()

					can.trigger(
						this.element
					,	'shown.sigma.field'
					,	this.options.name
					)
				}

			,	_render_inline: function()
				{
					this
						.$label
							.addClass('sr-only')

					this
						.$field
							.addClass('form-control')
							.attr(
								'placeholder'
							,	this.options.label
							)

					can.trigger(
						this.element
					,	'shown.sigma.field'
					,	this.options.name
					)
				}

			,	_render_horizontal: function()
				{
					this
						.$label
							.addClass('control-label')
							.addClass(this.options['label-col'])

					this
						.$field
							.addClass('form-control')
								.wrap(
									can.$('<div>')
										.addClass(this.options['field-col'])
								)

					this
						.$validations
							.addClass(this.options['field-col'])
							.addClass(this.getWrapClass())

					can.trigger(
						this.element
					,	'shown.sigma.field'
					,	this.options.name
					)
				}

			,	resetValidations: function()
				{
					if	(!this.isRequired() || _.isUndefined(this.validateControl))
						can.trigger(
							this.element
						,	'validated.sigma.validate'
						,	true
						)
					else
						this
							.validateControl
								.resetValidations()

					this
						.$element
							.removeClass('has-error')
							.removeClass('has-success')
				}

			,	resetData: function()
				{
					this.$field.val('')

					this.$field.data('value',undefined)
				}

			,	resetField: function()
				{
					this.resetData()

					this.resetValidations()

					can.trigger(
						this.element
					,	'reseted.form.field'
					,	this.options.name
					)
				}

			,	isRequired: function()
				{
					return	_.isBoolean(this.options.required) && this.options.required 
				}

			,	getWrapClass: function()
				{
					return	_.first(
								this.options['label-col'].split('-')
							,	2
							).concat(
								[
									'offset'
								,	_.last(this.options['label-col'].split('-'))
								]
							).join('-')
				}

			,	getValue: function()
				{
					return	this.$field.val()
				}

			,	getData: function()
				{
					return	this.$field.data('value')
				}

			,	'label.sigma.field': function()
				{
					this.done.attr('label',true)
					this._render_position()
				}

			,	'field.sigma.field': function()
				{
					this.done.attr('field',true)
					
					this._render_position()

					if	(!_.isUndefined(this.options.value))
						this.validateField()
				}

			,	validateField: function()
				{
					if	((!this.isRequired() && _.isEmpty(this.getValue())) || _.isUndefined(this.validateControl))
						can.trigger(
							this.element
						,	'validated.sigma.validate'
						,	true
						)
					else
						this
							.validateControl
								.validateField(
									this.getValue()
								,	this.getData()
								,	this.options.value && this.options.type == 'autocomplete'
									? 	_.isFunction(this.options.value[this.options.display])
										? 	this.options.value[this.options.display]()
										: 	this.options.value[this.options.display]
									: 	this.options.value
								)
				}

			,	showValidations: function(isValidated)	
				{
					this
						.$element
							.removeClass(isValidated ? 'has-error' : 'has-success')
							.addClass(isValidated ? 'has-success' : 'has-error')
				}

			,	'validated.sigma.validate': function(el,ev,isValidated)
				{
					this.showValidations(isValidated)

					can.trigger(
						this.element
					,	'validated.sigma.field'
					,	{
							field:	this.options.name
						,	isValidated: isValidated
						}
					)
				}

			,	' change': function(el,ev)
				{
					if	(this.validateControl)
						this
							.validateControl
								.validateField(
									this.getValue()
								,	this.getData()
								,	this.options.value
								)

					if	(can.isFunction(this.options.onChange))
						this
							.options
								.onChange(
									this.element.parents('form')
								,	ev
								,	el
								,	this.getValue()
								,	this.getData()
								)
				}

			,	destroy: function()
				{
					steal.dev.log("Destroying "+this.constructor.fullName)
					var	$element
					=	this.element
					can.Control.prototype.destroy.call( this )
					$element.remove()
				}
			}
		)
	}
)