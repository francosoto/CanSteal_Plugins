steal(
	'sigma/controls/form'
).then(
	function()
	{
		Sigma.Control(
			'Sigma.StepWizard'
		,	{
				defaults:
				{
					default_data: 	undefined
				,	step: 			'name'
				}
			}
		,	{
				validate_form: function(element,options)
				{
					if(this.options.default_data.attr(this.options.step) && this.Form && this.validate_form_values())
						this._next_step()
				}

			,	validate_list: function(element,options)
				{
					if(this.options.default_data.attr(this.options.step).length > 0)
						this._next_step()
				}

			,	create_or_update: function()
				{
					if(!this.options.default_data.attr('type'))
						this.options.default_data.attr('type','create')
				}

			,	get_step_data: function()
				{
					return 	this
								.options
									.default_data
										.attr(
											this.options.step
										)
				}

			,	set_step_data: function(data_to_set)
				{
					return 	this
								.options
									.default_data
										.attr(
											this.options.step
										,	data_to_set
										)
				}

			,	set_final_legend: function(name)
				{
					this
						.element
							.find('legend.title')
								.text(
									_.isEqual(this.options.default_data.attr('type'),'create')
									? 	'Resumen del alta de '+name
									: 	'Resumen de la modificación de '+name
								)
				}

			,	validate_form_values: function()
				{
					var self
					=	this
					,	array
					=	_.map(
							this.Form.options.data
						,	function(item, index)
							{
								if(!_.isEqual(item.name,'button'))
									return 	item.name
							}
						)

					return 	_.filter(
								array
							,	function(item,index)
								{
									if(self.options.default_data[self.options.step])
										return 	_.has(
													self.options.default_data[self.options.step].attr()
												,	item
												)	
												&& 	(
														_.contains(
															[false,true]
														,	self.options.default_data[self.options.step].attr(item)
														)
														||	self.options.default_data[self.options.step].attr(item)
													)
								}
							).length == array.length
				}

			,	getData: function(formData)
				{
					var data
					=	{
							
						}

					this
						.options
							.default_data
								.attr(
									this.options.step	
								,	!_.isEmpty(data)
									?	data
									: 	formData
								)

					return	this
								.options
									.default_data
				}

			,	'validated.sigma.form': function()
				{
					this._next_step()
				}

			,	_next_step: function()
				{
					var controlData
					=	{}
					if	(!_.isUndefined(this.Form))	
						controlData
						=	this.Form.getFormData()
					else
						controlData
						=	this.get_step_data()

					can.trigger(
						this.element
					,	'next.sigma.wizard'
					,	{
							step: 	_.isFunction(this.getNextStep)
									? 	this.getNextStep(controlData)
									: 	'finalizar'
						,	data: 	this.getData(controlData)
						}
					)
				}

			,	'invalidated.sigma.form': function()
				{
					if	(!_.isUndefined(this.Form))
						can.trigger(
							this.element
						,	'disable_next.sigma.wizard'
						)
				}

			,	duplicate_default_data: function()
				{
					return new can.Observe(
								_.clone(
									this.options.default_data.attr()
								)
							)
				}

			,	set_final: function()
				{
					can.trigger(
						this.element
					,	'final.sigma.wizard'
					,	{
							data: this.options.default_data
						}
					)
				}

			,	_mensaje: function(msg,tipo)
				{
					Messenger().post(
						{
							message: msg
						,	type: tipo
						,	showCloseButton: true
						,	hideAfter: 10
						,	hideOnNavigate: true
						}
					)
				}
			}
		)
	}
)