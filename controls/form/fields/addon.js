steal(
	'lib'
,	'plugin'
,	'can/control'
,	'can/observe'
,	'can/view'
,	'can/view/mustache'
,	'can/construct/super'
,	'can/construct/proxy'
,	'can/control/plugin'
).then(
	function()
	{
		Sigma.Control(
			'Sigma.Addon'
		,	{
				defaults:
				{

				}
			}
		,	{
				init: function(element,options)
				{
					this.$addon
					=	can.$('<span>')

					this
						.element
							.addClass('input-group')


					this.element[_.contains(['prepend','append'],options.where) ? options.where : 'append'](
						this.$addon
					)

					this['_render_'+(_.contains(['text','icon','button'],options.type) ? options.type : 'text')](options)
				}

			,	_render_icon: function(data)
				{
					this
						.$addon
							.addClass('input-group-addon')

					this
						.$addon
							.append(
								can.$('<i>')
									.addClass('fa')
									.addClass(data.icon)
							)
				}

			,	_render_button: function(data)
				{
					var	$addon
					=	this.$addon

					$addon
						.addClass('input-group-btn')

					can.each(
						data.button instanceof can.Observe.List
						?	data.button
						:	new can.Observe.List(data.button)
					,	function(button)
						{
							$addon
								.append(
									can.$('<button>')
										.html(
											button.label
										)
										.attr(
											{
												name:	button.name
											,	'class':	'btn' + ' ' + (button['class'] || 'btn-default')
											,	id:	button.id || ''
											,	type: 'button'
											}
										)
								)
						}
					)

				}

			,	_render_text: function(data)
				{
					this
						.$addon
							.addClass('input-group-addon')

					this
						.$addon
							.html(
								data.text
							)
				}

			,	'button click': function()
				{
					if	(!_.isUndefined(this.options.onClick))
						this.options.onClick()
				}			
			}
		)
	}
)