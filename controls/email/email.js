steal(
	'controls/typeahead'
).then(
	function()
	{
		Sigma.Autocomplete(
			'Sigma.Email'
		,	{
				defaults:
				{
					email:
					[
						'gmail.com'
					,	'hotmail.com'
					,	'hoyts.com'
					,	'google.com'
					,	'gaogle.com'
					,	'gugle.com'
					]
				,	min_length: 1
				}
			}
		,	{
				_keyup: function(ev)
				{
					var	value
					=	this.$input.val()
					
					if	(
							value.indexOf('@') == -1
						||	value.split('@').length != 2
						)
						{
							this.options.source
							=	undefined
							this.hide()
						}
					else
						{
							if	(ev.keyCode == 50)
							{
								this.options.source
								=	can.map(
										this.options.email
									,	function(mail)
										{
											return	{ name : value+mail }
										}
									)
							}
							this._super(ev)
						}
				}
			}
		)
	}
)