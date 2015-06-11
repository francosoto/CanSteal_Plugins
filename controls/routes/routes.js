steal(
	'lib'
,	'can/control'
,	'can/control/route'
).then(
	function()
	{
		can.Control(
			'Sigma.Routes'
		,	{
				defaults:
				{
					modules:	{}
				,	base:		''
				,	default_module:	'default'
				,	user:	undefined
				}
			}
		,	{
				init: function(element,options)
				{
					steal.dev.log(this.constructor.fullName)
				}

			,	":username route" : function(data)
				{
					steal.dev.log("Ruta :user",data)

					this.new_route(this.options.user)
				}

			,	' navegate': function(el,ev,user)
				{
					this.options.user
					=	user

					can.route
							.attr(
								{
									route: 'username'
								,	username:	user.getUsername()
								}
							)
				}

			,	"route" : function(data)
				{
					steal.dev.log("Ruta Vacia")
					
					this.new_route(this.options.user)
				}

			,	new_route: function(user)
				{
					var	modules
					=	this.options.modules
					,	base
					=	this.options.base

					steal(base+modules[this.getModule(user)])
				}

			,	getModule: function(user)
				{
					return	user
							?	user.getProfile()
							:	this.options.default_module
				}
			}
		)
	}
)