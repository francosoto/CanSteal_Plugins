steal(
	'controls/control'
).then(
	function()
	{
		can.Construct(
			'Sigma.Validate'
		,	{ }
		,	{
				IsIntegerToString: function(val)
				{
					if(this.Requerido(val))
					{
						var string 
						=	new String(val)
						,	longitud
						=	val.length

						if(longitud > 0)
						{
							return (
									_.filter(
										val
									,	function(item,index)
										{	
											return	(item <= "9") && (item >= "0")
										}
									).length == longitud
								)
						}
						else
							return false
					}
					else
					{
						return false
					}
				}
			,	IsFloatToString: function(val)
				{
					if(this.Requerido(val))
					{
						var string 
						=	new String(val)
						,	separation
						=	val.split('.')
						,	longitud
						=	separation.length
						,	self
						=	this

						if(longitud > 0 && separation.length <= 2)
						{
							return (
									_.filter(
										separation
									,	function(item,index)
										{	
											return	self.IsIntegerToString(item)
										}
									).length == longitud
								)
						}
						else
							return false
					}
					else
					{
						return false
					}
				}
			,	Requerido: function(val)
				{
					return !_.isEmpty(val)
				}
			,	Min_length: function(val,min)
				{
					return val.length >= min
				}
			,	Max_length: function(val,max)
				{
					return val.length <= max
				}
			,	Time: function(val)
				{
					return !(!/^([0-9])*[:]?[0-9]*$/.test(val))
				}
			}
		)
	}
)