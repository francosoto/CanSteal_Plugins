steal(
	'lib'
,	'controls/control'
,	'can/control/route'
).then(
	function(){
		Sigma.Control(
			'Sigma.Topbar'
		,	{
				defaults:
				{
					view:		'views/topbar/init.mustache'
				// ,	route:
				// 	{
				// 		route: 'topbar/:option'
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

					this.$content
					=	this.element.find(this.options.content)
					
					this.setRoute()
				}

			,	'.brand > .navegable, .menu > li:not(".active") .navegable click': function(el,ev)
				{
					ev.preventDefault()
					ev.stopPropagation()
					
					this.newRoute(
						can.$(el).attr('data-route')
					)
				}

			,	'.menu.dropdown-menu > li:not(".active") .navegable click': function(el,ev)
				{
					can.$(el)
						.parents('.menu.dropdown-menu')
							.parent('li')
								.removeClass('open')
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
						this.element
								.find('.menu > li.active')
									.removeClass('active')

						$element
							.parent()
							.addClass('active')
					}
				}

			,	setRoute: function()
				{
					can.route
							.attr(
								this.options.route
							,	true
							)
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
								this.getRoute(route_name)
							,	true
							)
				}
			}
		)
	}
)