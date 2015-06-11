steal(
	'lib'
,	'controls/control'
,	'plugin/plugin.js'
).then(
	function()
	{
		Sigma.Control(
			'Sigma.ControlPanel'
		,	{
				defaults:
				{
					
				}
			}
		,	{
				init: function(element,options)
				{
				}
			}
		)
	}
)
