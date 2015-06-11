steal(
	'lib'
,	'controls/form'
,	'controls/modal'
,	'controls/table'
,	'controls/control'
,	'can/control/route'
).then(
	'controls/form/modal.js'
).then(
	function()
	{
		Sigma.Control(
			'Sigma.Abm'
		,	{
				pluginName:	'sigma_abm'
			,	defaults:
				{

					name: undefined
				,	genero: false //false si es masculino y true si es femenino el name
				,	view: 'views/abm/abm_default.mustache'
				,	view_table:  'views/abm/table.mustache'
				,	view_details:false
				,	details_width: '80%'
				,	titles:
					{
						create: 	'Crear un{} []'
					,	update: 	'Modificar un{} []'
					,	details:	'Detalles de un{} []'
					}
				,	messages:
					{
						created: 	"() cread[] satisfactoriamiente."
					,	updated: 	"() modificad[] satisfactoriamiente."
					,	deleted: 	"() removid[] satisfactoriamiente."
					,	failed: 	undefined
					,	modal_delete: "Si elimina est-- no podrá volver a utilizarl[]..."
					}
				,	table_data:
					{
						paginable: 	{
										limit:		5
									,	maxIndex:	7
									,	offset:		0
									} //query con datos de paginación
					,	searcheable:false //key de búsqueda, por ejemplo: 'nombre'
					,	sorteable: 	false //por ejemplo {by:'id'}
					}
				,	model: undefined //debe contener filter
				,	default_data: undefined
				,	data:
					{
						title:  'ABM genérico'
					}
				,	form_data:
					[
						{
							type:	'legend'
						,	label:	'Alta o Modificar'
						,	name:	'register'
						}
					]
				,	form_edit_extend: []
				,	form_new_extend: 
					[
						{
							type:	'legend'
						,	label:	'Registrar un{} []'
						,	name:	'register'
						}
					]
				,	route:
					{
						route:	((Milkrun && Milkrun.User && Milkrun.User.getUsername()) || '' ) +'/:option/:suboption/:abm'
					,	abm:	'list'
					}
				,	routeKey:	'abm'
				,	allowed_options: ['option','suboption','abm']
				,	ready: new can.Observe.List([false,false])
				,	update_with_wizard_enabled: false
				,	message_exit_wizard: false
				}
			}
		,	{
				_render_content: function(data)
				{
					this._super(data)

					this._set_options()

					this.newRoute(this.options.route[this.options.routeKey])

					if(this.options.update_with_wizard_enabled)
						this._set_update_tag()

					this.element
						.find('li[data-toggle="tooltip"]')
							.tooltip()
				}

			,	_set_options: function()
				{
					if(this.options.name)
					{
						var self
						=	this
						,	name
						=	this.options.name
						,	mayus
						=	can.capitalize(name[0]) + name.slice(1,name.length)
						,	genero
						=	this.options.genero
							?	'a'
							: 	''
						,	plural
						=	this.options.plural
							?	's'
							: 	''


						_.forEach(
							this.options.titles
						,	function(item,index)
							{
								self.options.titles[index]
								=	self.options.titles[index]
									.replace(
										'{}'
									,	genero
									)

								self.options.titles[index]
								=	self.options.titles[index]
									.replace(
										'[]'
									,	name
									)
							}
						)

						_.forEach(
							this.options.messages
						,	function(item,index)
							{
								self.options.messages[index] 
								=	item
									? 	index == 'modal_delete'
										?	item
												.replace(
														'--'
													,	genero==''
														?	self.options.plural
															?	'os ' + name
															: 	'e ' + name
														: 	'a' + plural + ' ' + name
													)
										: 	item
												.replace(
														'()'
													,	mayus
													)
									: 	undefined

								self.options.messages[index] 
								= 	self.options.messages[index]
										.replace(
												'[]'
											,	genero==''
												?	'o' + plural
												: 	'a' + plural
											)
							}
						)

						if(this.options.form_new_extend[0])
						{
							this.options.form_new_extend[0].label 
							=	this.options.form_new_extend[0].label 
									.replace(
										'{}'
									,	genero
									)

							this.options.form_new_extend[0].label 
							= 	this.options.form_new_extend[0].label 
									.replace(
										'[]'
									,	name
									)
						}
					}
				}

			,	_render_list:function($element)
				{
					var queries
					=	this.options.table_data.paginable
						?	{pagination: this.options.table_data.paginable}
						: 	{}

					if(_.isObject(this.options.table_data.sorteable))
						queries
						=	_.merge(
								queries
							, 	{sort: this.options.table_data.sorteable}
							)

					if(this.options.table_data.query)
						queries
						=	_.merge(
								queries
							,	{query: this.options.table_data.query}
							)

					this.Table
					=	new	Sigma.Table(
						can.$('<div>')
								.addClass('list-table')
								.appendTo(
									$element
								)
					,	{
							data:		can.proxy(this.options.model.filter,this.options.model)
						,	view:		this.options.view_table
						,	paginable:	this.options.table_data.paginable?true:false
						,	queries:    queries
						,	sorteable:	this.options.table_data.sorteable
						,	searcheable:this.options.table_data.searcheable?true:false
						,	searchKey:	this.options.table_data.searcheable?this.options.table_data.searcheable:undefined
						,	onBeforeQuick: can.proxy(this.quickSearch,this)
						,	onFail: can.proxy(this._fail_search,this)
						}
					)
				}

			,	quickSearch: function(query)
				{
					return	_.isEmpty(query.value)
							?	{}
							:	{
									operator: 'and'
								,	filters:
									[
										{
											field: query.key
										,	value: query.value.toUpperCase()
										,	criteria: '%'
										}
									]
								}
				}

			,	_fail_search: function()
				{
					this.Table
						._remove_loading_tr()

					this._mensaje(
						'Error en la búsqueda, intente ingresando otros datos de búsqueda.'
					,	"error"
					)
				}

			,	_render_new: function($element)
				{
					this.newForm
					=	new	Sigma.Form(
							can.$('<form>')
								.addClass('new-form')
								.appendTo(
									$element
								)	
						,	{
								data:
								_.union( //mergear la data adicional
									this.options.form_new_extend
								,	this.options.form_data
								)
							,	default_data:	this.options.default_data
							,	onSubmit: can.proxy(this.submitForm,this,undefined)
							,	type: 'form-horizontal'
							,	'class': 'col-md-8 col-md-offset-1'
							,	model: this.options.model
							}
						)
				}

			,	_render_details: function(data)
				{
					this.detailsModal
					=	new Sigma.Modal(
							can.$('<div>')
								.appendTo(
									this.element
								)
						,	{
								type:	'confirm'
							,	view:	this.options.view_details
							,	data:	data
							,	width:	this.options.details_width
							}
						)
				}

			,	submitForm: function(instance,formData)
				{
					var formatedData 
					= 	{}

					this.old_instance
					=	undefined
					
					formData.each(
						function(i,d)
						{
							if(d != 'submit')
							{
								if(i.attr('data'))
									if	(i.attr('data') instanceof Date)
										formatedData[d] = i.attr('data').toLocalJSON()
									else
										if	(i.attr('data') instanceof can.Observe.List)
											formatedData[d]
											=	can.map(
													i.attr('data')
												,	function(iD)
													{
														return	_.object(
																	[iD.attr('id') ? ('id'+can.capitalize(d)) : d]
																,	[iD.attr('id') || iD]
																)
													}
												)
										else
											if(i.attr('data.id'))
												formatedData['id'+can.capitalize(d)] = i.attr('data.id')
											else
												formatedData[d] = i.attr('data.value')
								else
									formatedData[d] = can.trim(i.attr('value'))
							}
						}
					)

					if 	(_.isUndefined(instance))
						return	new this.options.model(formatedData).save()
					else	{
						this.old_instance
						=	_.clone(instance.attr())

						this.instance
						=	instance

						for	(var attribute in formatedData)
							instance
								.attr(
									attribute
								,	formatedData[attribute]
								)
								
						return	instance.save()
					}
				}

			,	'ul.abm a click': function(el,ev)
				{
					if(	_.isEqual(can.$(el).attr('data-route'),'list') 
						&& 	this.options.message_exit_wizard
						&&	!_.isEqual(this.currentRoute,'list')
					)
					{
						new Sigma.Modal(
							can.$('<div>')
						,	{
								type: 'confirm'
							,	onConfirm: can.proxy(this._change_sec,this,el,ev)
							,	data:
								{
									title: 		'¿Está seguro que desea realizar esta acción?'
								,	content: 	'Sí sale del wizard, los datos cargados o modificados se perderán.'
								}
							}
						)

						ev.stopPropagation()
					}
					else
						this._change_sec(el)

					if 	(	_.contains(['update','new'],can.$(el).attr('data-route')) 
						&& 	this.options.message_exit_wizard
						)
						can.trigger(
							this.element
						,	'enable_modal.sigma.menu'
						)
					else
						can.trigger(
							this.element
						,	'disable_modal.sigma.menu'
						)
				}

			,	_change_sec: function(el,ev)
				{
					if(ev)
						this._change_tab('list')

					this.newRoute(
						can.$(el).attr('data-route')
					)

					this._hide_update_tag()
				}

			,	_change_tab: function(name)
				{
					this
						.element
							.find('li[data-toggle="tooltip"] a.'+name)
								.tab('show')
				}

			,	'#list table tbody tr:not(".danger,.active") click': function(el,ev)
				{
					if	(this.options.view_details)
						this._render_details(can.$(el).data('value'),el)
				}

			,	'#list table tbody tr td.action .fa-pencil click': function(el,ev)
				{
					ev.stopPropagation()
					ev.preventDefault()

					this.update_data
					= 	can.$(el).parents('tr').data('value')

					if(this.options.update_with_wizard_enabled)
					{
						this.newRoute(
							'update'
						)

						can.trigger(
							this.element
						,	'enable_modal.sigma.menu'
						)
					}
					else
					{
						can.$(el).parents('tr').addClass('active')
						this._modal_update(
							can.$(el).parents('tr').data('value')
						,	can.$(el).parents('tr')
						)
					}
				}

			,	_modal_update: function(data,el)
				{
					this.updateForm
					=	new	Sigma.Form.Modal(
							can.$('<div>')
								.appendTo(
									this.element
								)
						,	{
								data: _.union( //mergear la data adicional
										this.options.form_edit_extend
									,	this.options.form_data
									)
							,	default_data:	data
							,	onSubmit: can.proxy(this.submitForm,this,data)
							,	onHide: function()
								{
									can.$(el).removeClass('active')
								}
							,	type: 'form-horizontal'
							,	onSubmitText: 'Modificando...'
							,	title: this.options.titles.update //Setear títulos
							,	model: this.options.model
							}
						)


					if(_.isFunction(this.aditional_update_function))
					{
						this.aditional_update_function()
					}
				}

			,	_set_update_tag: function()
				{
					this
						.element
							.find('ul.nav-tabs.abm')
								.append(
									'<li data-toggle="tooltip" data-placement="right" title="Modificar" class="update_tag">'
									+	'<a href="#update" data-toggle="tab" class="update" data-route="update">'
									+		'<i class="fa fa-pencil-square-o fa-lg"></i>'
									+	'</a>'
									+'</li>'
								)


					this
						.element
							.find('li.update_tag')
								.hide()

					this
						.element
							.find('div.tab-content')
								.append(
									'<div class="tab-pane" id="update">'
									+	'<div class="panel panel-default">'
									+		'<div class="panel-heading">'
									+			this.options.data.title
									+		'</div>'
									+		'<div class="panel-body"></div>'
									+	'</div>'
									+'</div>'
								)
				}

			,	_hide_update_tag: function()
				{
					this
						.element
							.find('ul.nav-tabs.abm li.update_tag')
								.hide()
				}

			,	_show_update_tag: function()
				{
					this
						.element
							.find('li.update_tag')
								.show()

					this._change_tab('update')
				}

			,	_render_update: function($element)
				{
					this._show_update_tag()

					/*this.updateForm
					=	new	Sigma.Form(
							can.$('<form>')
								.addClass('update-form')
								.appendTo(
									$element
								)	
						,	{
								data:
								_.union( //mergear la data adicional
									this.options.form_new_extend
								,	this.options.form_data
								)
							,	default_data:	this.options.default_data
							,	onSubmit: can.proxy(this.submitForm,this,undefined)
							,	type: 'form-horizontal'
							,	'class': 'col-md-8 col-md-offset-1'
							,	model: this.options.model
							}
						)*/
				}

			,	'#list table tbody tr td.action .fa-times click': function(el,ev)
				{
					ev.stopPropagation()
					ev.preventDefault()

					this._modal_delete(
						can.$(el).parents('tr').data('value')
					,	can.$(el).parents('tr')
					)
				}

			,	_modal_delete: function(data,el)
				{
					var self
					=	this

					this.modalDelete
					=	new Sigma.Modal(
							can.$('<div>')
						,	{
								type: 'confirm'
							,	onConfirm: function()
								{
									data
										.destroy()
											.done(
												function()
												{
													el.remove()
													
													can.trigger(
														self.element.find('table')
													,	'delete_row'
													)
												}
											)
								}
							,	data:
								{
									title: '¿Está seguro que desea realizar esta acción?'
								,	content: this.options.messages.modal_delete //Content de eliminar
								}
							}
					)
				}

			,	'{ready} change': function()
				{
					console.log(arguments)
				}

			,	'{model} created': function(model,ev,instance)
				{
					this._mensaje(
						this.options.messages.created //Setear mensajes satisfactorios y de error
					,	"success"
					)
					this.Table._refresh_data()
				}

			,	'{model} updated': function(model,ev,instance)
				{
					this._mensaje(
						this.options.messages.updated
					,	"success"
					)

					if(this.options.update_with_wizard_enabled)
					{
						can.trigger(
							this.element
						,	'reset.sigma.abm'
						)
					}
				}

			,	'{model} destroyed': function(model,ev,instance)
				{
					instance.unbind()
					this._mensaje(
						this.options.messages.deleted
					,	"success"
					)
					this.Table._refresh_data()
				}

			,	'{model} failed': function(model,ev,fail)
				{
					if(!_.isUndefined(this.old_instance))
						this.instance.attr(this.old_instance)

					this._mensaje(
						this.options.messages.failed
						?	this.options.messages.failed
						: 	fail.errorMessage
					,	"error"
					)
				}

			,	'invalidated.sigma.form': function(el,ev,submit)
				{
					if(submit)
						this._mensaje(
							'Debe completar correctamente todos los campos para poder realizar dicha operación'
						,	"error"
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

			,	getContent: function(toRender)
				{
					if(this.element)
						return	this.element.find('div.tab-pane#'+toRender+' .panel-body').length > 0
								?	this.element.find('div.tab-pane#'+toRender+' .panel-body')
								: 	this.element.find('div.tab-pane#'+toRender)
				}

			,	getRoute: function(routeValue)
				{
					var	routeObj
					=	new Object()

					routeObj[this.options.routeKey]
					=	routeValue

					return	routeObj
				}

			,	newRoute: function(route_name)
				{
					var	allowed
					=	this.options.allowed_options

					can.each(
						can.route.attr()
					,	function(val,key)
						{
							if	(key != 'route' && allowed.indexOf(key) == -1)
								can.route.removeAttr(key)
						}
					)

					can.route
							.attr(
								can.extend(
									can.route.attr()
								,	this.options.route
								,	this.getRoute(route_name)
								)
							,	true
							)
				}

			,	'{route.route} route': function (data)
				{ 	
					var	toRender
					=	data[this.options.routeKey]
					
					if	(toRender && this.currentRoute != toRender)
					{
						this.currentRoute = toRender

						if	(can.isFunction(this['_render_'+toRender]))
							{
								this._clean(this.getContent(toRender))
								this['_render_'+toRender](
									can.$('<div>')
										.appendTo(
											this.getContent(toRender)
										)
								)
							}
						else
							steal.dev.log('Funcion '+'_render_'+toRender+' no encontrada...')
					}
				}
				
			,	get_field: function(name)
				{
					return 	_.find(
								this.newForm
								?	this.newForm.options.data
								: 	this.updateForm.options.data
							,	function(i,e)
								{
									return i.name == name
								}
							)
				}

			, 	'reset.sigma.abm': function()
				{
					this.newRoute(
						'list'
					)

					this._hide_update_tag()

					this._change_tab('list')
				}
			}
		)
	}
)