steal(
	'lib'
,	'controls/control'
,	'can/control/route'
).then(
	function(){
		Sigma.Control(
			'Sigma.Menu'
		,	{
				defaults:
				{
					view:		'views/menu/init.mustache'
				// ,	route:
				// 	{
				// 		route: 'menu/:option'
				// 	,	option:	'opcion_1'
				// 	}
				// ,	routeKey:	'option'
				// ,	allowed_options: ['option']
				}
			}
		,	{
				_render_content: function(data)
				{
					this._super(data)

					this.menu
					=	new can.Observe({})

					this.$content
					=	this.element.find(this.options.content)

					this.element.find('.submenu').hide()
					
					this.newRoute(this.options.route[this.options.routeKey])
				}

			,	'.menu > .navegable:not(".active") click': function(el,ev)
				{
					ev.preventDefault()
					ev.stopPropagation()

					this.change_link(el,ev)
					
					/*this.newRoute(
						can.$(el).attr('data-route')
					)*/
				}

			,	'.menu > .navegable.active click': function(el,ev)
				{
					ev.preventDefault()
					ev.stopPropagation()

					this.toggleSubmenu(can.$(el).attr('data-route'))

					this.newRoute(
						can.$(el).attr('data-route')
					)
				}

			,	change_link: function(el,ev)
				{
					if(this.disable_modal)
					{
						new Sigma.Modal(
							can.$('<div>')
						,	{
								type: 'confirm'
							,	onConfirm: can.proxy(this.newRoute,this,can.$(el).attr('data-route'))
							,	data:
								{
									title: 		'¿Está seguro que desea realizar esta acción?'
								,	content: 	'Si sale del wizard, los datos cargados, seleccionados o modificados se perderán.'
								}
							}
						)
						
						this.disable_modal
						=	false
					}
					else
						this.newRoute(
							can.$(el).attr('data-route')
						)
				}

			,	'enable_modal.sigma.menu': function(el,ev)
				{
					this.disable_modal
					=	true
				}

			,	'disable_modal.sigma.menu': function(el,ev)
				{
					this.disable_modal
					=	false
				}

			,	'.submenu > .navegable:not(".active") click': function(el,ev)
				{
					ev.preventDefault()
					ev.stopPropagation()

					this.newRoute(
						can.$(el).attr('data-route')
					)
				}

			,	toggleSubmenu: function(route)
				{
					this.element
						.find('.submenu[data-parent="'+route+'"]')
							.slideToggle('slow')
							.find('.active')
								.removeClass('active')
				}

			,	'{route.route} route': function (data)
				{ 	
					var	toRender
					=	data[this.options.routeKey]

					if	(toRender)
					{
						this.setActive(toRender)

						if	(can.isFunction(this['_render_'+toRender]))
							{
								this._clean(this.$content)
								this['_render_'+toRender](can.$('<div>').appendTo(this.$content))
							}
						else
							steal.dev.log('Funcion '+'_render_'+toRender+' no encontrada...')
					}
				}

			,	setActive: function(element_route)
				{
					var	$element
					=	this.element
							.find('.navegable[data-route="'+element_route+'"]')

					if	(!$element.hasClass('active'))
					{
						if	($element.parent().hasClass('menu'))	{
							this.element
									.find('.menu > .navegable.active')
										.removeClass('active')

							this.element
									.find('.menu > .submenu')
										.slideUp()

							this.toggleSubmenu(element_route)
						}	else	{
							this.element
									.find('.submenu > .navegable.active')
										.removeClass('active')
						}

						$element
							.addClass('active')
					}
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
			}
		)
	}
)