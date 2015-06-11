steal(
	'controls/control'
,	'controls/wizard/wizard.css'
,	'controls/form'
,	'controls/modal'
,	'controls/wizard/step_wizard.js'
).then(
	function()
	{
		Sigma.Control(
			'Sigma.Wizard'
		,	{
				defaults:
				{
					wizard_data: new can.Observe()
				,	type: 'inline'
				,	texts:
					{
						finalizar: 'Finalizar'
					,	siguiente: 'Siguiente'
					,	anterior: 'Anterior'
					}
				,	preventReset: false
				}
			}
		,	{
				_render_content: function(data)
				{
					this._super(data)

					var self
					=	this

					this.steps_list
					=	new can.Observe.List([])

					this.$content
					=	can.$('<div>')
							.appendTo(
								this.element.find('.step-content')
							)

					this.$buttons
					=	can.$('<div>')
							.addClass('step-actions')
							.appendTo(
								this.element.find('.step-content')
							)

					this.$steps
					=	this.element.find('ul.steps')

					this.$prev_button
					=	can.$('<button>')
							.addClass('btn btn-default disabled prev-step col-md-2 col-md-offset-1')
							.text(this.options.texts.anterior)
							.appendTo(
								this.$buttons
							)

					this.$next_button
					=	can.$('<button>')
							.addClass('btn btn-primary disabled next-step col-md-2 col-md-offset-6')
							.text(this.options.texts.siguiente)
							.appendTo(
								this.$buttons
							)

					this.available_steps
					=	this.$steps.clone()

					this.wizard_data
					=	this.options.wizard_data && _.isEqual(this.options.wizard_data.attr('type'),'update')
						?	this.options.wizard_data
						: 	new can.Observe(_.clone(this.options.wizard_data.attr()))

					this.$steps.empty()

					this.next_step
					=	undefined

					this.current_step
					=	_.find(
							this.options.data.steps
						,	function(step)
							{
								return	step.attr('initial')
							}
						)	||	this.options.data.steps.attr('0')

					this._render_step()

				}

			,	_render_step: function()
				{
					var	step
					=	this.current_step
					,	$step
					=	this.available_steps
								.find('[data-route="'+step.key+'"]')
									.parents('li')

					this.insertStep($step)

					this._disable_next()

					if	(this.steps_list.length > 0)
						this._enable_prev()
					else
						this._disable_prev()

					if	(can.isFunction(this['_render_'+step.key]))
					{
						this._clean(this.$content)
						this['_render_'+step.key](this.getContent(),this.getStepData())
						if	(step.attr('final'))
							this._set_final()
					}
					else
						steal.dev.log('Funcion '+'_render_'+step.key+' no encontrada...')

				}

			,	getContent: function()
				{
					return	can.$('<div>')
								.addClass('current-content')
									.prependTo(
										this.$content
									)
				}

			,	getStepData: function()
				{
					return	this.wizard_data.attr(this.current_step.key) || new can.Observe()
				}

			,	resetWizard: function()
				{
					this
						._clean(
							this
								.element
						)

					this
						._render_content(this.options.data)
				}

			,	insertStep: function($step)
				{
					var	$current
					=	$step
							.css(
								'z-index'
							,	this.$steps.find('li').last().css('z-index')
								?	(this.$steps.find('li').last().css('z-index') - 1)
								: 	100
							).clone()
								.appendTo(
									this.$steps
								)

					$current
						.find('.label')
							.text(
								this.$steps.find('li').index($current) + 1
							)

					this.setActive($current)
				}

			,	setActive: function($step)
				{
					$step
						.addClass('active')
						.find('.label')
							.removeClass('label-default')
							.addClass('label-primary')

					this.setReady($step.prev())
				}
			
			,	setReady: function($step)
				{
					$step
						.removeClass('active')
						.addClass('ready')
						.find('.label')
							.removeClass('label-primary')
							.addClass('label-success')
				}

			,	_enable_next: function()
				{
					steal.dev.log("Enabling Next ",this.next_step.key)
					this.$next_button
							.removeClass('disabled')
				}

			,	_disable_next: function()
				{
					steal.dev.log("Disabling Next")
					this.$next_button
							.addClass('disabled')
				}

			,	_enable_prev: function()
				{
					steal.dev.log("Enabling Prev",_.last(this.steps_list).key)
					this.$prev_button
							.removeClass('disabled')
				}

			,	_disable_prev: function()
				{
					steal.dev.log("Disabling Prev")
					this.$prev_button
							.addClass('disabled')
				}

			,	_enable_final: function()
				{
					steal.dev.log("Enabling Final")
					this.$next_button
							.text(this.options.texts.finalizar)
							.removeClass('disabled')					
				}

			,	_disable_final: function()
				{
					steal.dev.log("Disabling Final")
					this.$next_button
							.addClass('disabled')
				}

			,	_set_final: function()
				{
					this.$next_button
							.addClass('final')
							.text(this.options.texts.finalizar)
				}

			,	_reset_final: function()
				{
					this.$next_button
							.removeClass('final')
							.text(this.options.texts.siguiente)
				}

			,	'.next-step.final:not(".disabled") click':function()
				{
					can.trigger(
						this.$content.find('.current-content')
					,	'done.sigma.wizard'
					,	this.wizard_data
					)
				}

			,	'.next-step:not(".disabled"):not(".final") click':function()
				{
					this
						.wizard_data
							.attr(
								this.current_step.key
							,	this.current_step_data
							)

					this
						.wizard_data
							.attr(
								this.next_step.key
							,	this.current_step_data
							)

					this
						.steps_list
							.push(
								this.current_step
							)

					this.current_step
					=	this.next_step

					this.next_step
					=	undefined

					this._render_step()
				}

			,	'.prev-step:not(".disabled") click':function()
				{
					new Sigma.Modal(
						can.$('<div>')
					,	{
							type: 'confirm'
						,	onConfirm: can.proxy(this._render_prev_step,this)
						,	data:
							{
								title: '¿Está seguro que desea volver?'
							,	content: 'Si regresa al paso anterior, las modificaciones del paso actual se pueden perder. ¿Está seguro que desea continuar?'
							}
						}
					)
				}

			,	_render_prev_step: function()
				{					
					var self
					=	this
					,	$step
					=	this.$steps
							.find('a[data-route="'+this.current_step.key+'"]')
								.parents('li')
									.prev()
					,	prev_step_index
					=	0

					$step
						.nextAll()
							.remove()
					
					$step
						.remove()

					if	(this.current_step.attr('final'))
						this._reset_final()

					this.current_step
					=	this.steps_list.pop()

					this.next_step
					=	undefined

					this._render_step()
				}

			,	'next.sigma.wizard': function(el,ev,data)
				{
					this.next_step
					=	_.find(
							this.options.data.steps
						,	function(step)
							{
								return	_.isEqual(step.key,data.step)
							}
						)

					if	(_.isUndefined(this.next_step))
						steal.dev.log('Step desconocido...')
					else
					{
						this.current_step_data
						=	data.data
						this._enable_next()
					}
				}

			,	'disable_next.sigma.wizard': function(el,ev,data)
				{
					if	(_.isUndefined(this.next_step))
						steal.dev.log("Step desconocido...")
					else
						this._disable_next()
				}

			,	'final.sigma.wizard': function(el,ev,data)
				{
					if	(this.current_step.attr('final'))
					{
						this.current_step_data
						=	data.data
						this._enable_final()
					}	
					else
						steal.dev.log("El Step actual no es final")
				}

			,	'disable_final.sigma.wizard': function(el,ev,data)
				{
					if	(this.current_step.attr('final'))
						this._disable_final()
					else
						steal.dev.log("El Step actual no es final")
				}

			,	'done.sigma.wizard': function()
				{
					if	(!this.options.preventReset)
						this
							.resetWizard()
				}

			,	'reset.sigma.wizard': function()
				{
					this
						.resetWizard()
				}
			}
		)
	}
)