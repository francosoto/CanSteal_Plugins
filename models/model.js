steal(
	'can/model'
,	'can/construct/super'
).then(
	function()
	{
		can.Model(
			'Sigma.Model'
		,	{
				findAll: function()
				{
					return	this.request('GET',this.getURL())
				}
			,	findOne: function(data)
				{
					return	this.request('GET',this.getURL(data.id),data)
				}
			,	create: function(data)
				{
					return	this.request('POST',this.getURL(),data)
				}
			,	update: function(id,data)
				{
					return	this.request('PUT',this.getURL(id),data)
				}
			,	destroy: function(id)
				{
					return	this.request('DELETE',this.getURL(id))
				}
			,	request: function(method,url,data)
				{
					var Model
					=	this

					return can.ajax(
								{
									method:	method
								,	url:	url
								,	data:	this.beforeSend(data)
								}
							).fail(
								function(fail)
								{
									Model.error_handler(fail)
								}
							)
				}
			,	error_handler: function(fail)
				{
					try
					{
						fail.errorMessage
						=	!_.isEmpty(fail.responseText)
							?	JSON.parse(fail.responseText).message
							:	'Ocurrió un error, inténtelo mas tarde.'
					}
					catch(e)
					{
						fail.errorMessage
						=	'Ocurrió un error el procesar la petición del lado del servidor, inténtelo mas tarde.'
					}
					
					can.trigger(
						this
					,	'failed'
					,	fail
					)
				}
			,	url:	'sigma/model'
			,	getURL: function(id)
				{
					return	this.url + ((_.isUndefined(id)) ? '' : ('/'+id)) 
				}
			,	beforeSend: function(data)
				{
					return	data
				}
			}
		,	{	}
		)		
	}
)