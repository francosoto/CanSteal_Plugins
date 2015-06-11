steal(
	'lib'
,	'controls/control'
).then(
	function()
	{
		Sigma.Control(
			'Sigma.Modal'
		,	{
				defaults:
				{
					type: 'alert'
				,	onConfirm: undefined
				,	destroyOnHide: true
				,	width: false
				,	onHide: undefined
				,	onHidden: undefined
				,	onShow: undefined
				,	onShown: undefined
				,	validateConfirm: false
				}
			}
		,	{
				_render_content: function(data)
				{
					this
						.element
							.addClass('modal')

					if	(this.options.view)
						this._super(data)
					else
						this._render_manually(data)

					var	modalToRender
					=	this.options.type.split('-')[1]

					if	(modalToRender && can.isFunction(this['_render_'+modalToRender]))
						this['_render_'+modalToRender]()

					this.element.modal(data)

					if	(this.options.width)
						this.element.find('.modal-dialog')
								.css('width',this.options.width)
				}

			,	_render_manually: function(data)
				{					
					var	$dialog
					=	can.$('<div>')
							.addClass('modal-dialog')
							.appendTo(this.element)
					,	$content
					=	can.$('<div>')
							.addClass('modal-content')
							.appendTo($dialog)
					,	$header
					=	can.$('<div>')
							.addClass('modal-header')
							.appendTo($content)
					,	$body
					=	can.$('<div>')
							.addClass('modal-body')
							.appendTo($content)
					,	$footer
					=	can.$('<div>')
							.addClass('modal-footer')
							.appendTo($content)

					can.$('<button>')
						.addClass('close')
						.attr('data-dismiss','modal')
						.html('&times;')
						.appendTo($header)

					can.$('<h4>')
						.addClass('modal-title')
						.html(data.attr('title'))
						.appendTo($header)

					$body.html(data.attr('content'))

					can.$('<button>')
						.addClass('btn btn-default')
						.attr('data-dismiss','modal')
						.text(data.attr('close') || 'Cerrar')
						.appendTo($footer)

					if	(this.options.type == 'confirm')
						can.$('<button>')
							.addClass('btn btn-primary confirm')
							.text(data.attr('confirm') || 'Aceptar')
							.appendTo($footer)
				}

			,	_render_info: function()
				{
					this._render_modal_type('text-info','fa-info-circle')
				}

			,	_render_warning: function()
				{
					this._render_modal_type('text-warning','fa-question-circle')
				}

			,	_render_danger: function()
				{
					this._render_modal_type('text-danger','fa-exclamation-triangle')
				}

			,	_render_modal_type: function(headerClass,iconClass)
				{
					this.element
							.find('.modal-header')
								.addClass(headerClass)

					var	$body
					=	this.element
								.find('.modal-body')
									.addClass('row')
										.html()

					this.element
							.find('.modal-body')
								.empty()

					can.$('<div>')
							.addClass('col-md-2')
								.addClass('text-center')
								.addClass(headerClass)
								.append(
									can.$('<i>')
										.addClass('fa ' + iconClass)
										.addClass('fa-3x')
								)
								.appendTo(
									this.element
										.find('.modal-body')
								)

					can.$('<div>')
							.addClass('col-md-10')
							.append($body)
							.appendTo(
									this.element
										.find('.modal-body')
								)
				}

			,	'.confirm click': function()
				{
					if	(can.isFunction(this.options.onConfirm))
					{
						if(this.options.validateConfirm)
						{
							if(this.options.onConfirm())
								this.element.modal('hide')
						}
						else
						{
							this.options.onConfirm()
							this.element.modal('hide')
						}
					}
					else
						this.element.modal('hide')

				}

				//	Mientras se oculta
			,	'hide.bs.modal': function(el,ev)
				{
					if	(can.isFunction(this.options.onHide))
						this.options.onHide()
				}
				
				//	Al terminar de ocultarse
			,	'hidden.bs.modal': function(el,ev)
				{					
					if	(can.isFunction(this.options.onHidden))
						this.options.onHidden()
					
					if	(this.options.destroyOnHide)
						this.destroy(el,ev)
				}

				//	Mientras se muestra
			,	'show.bs.modal': function(el,ev)
				{
					if	(can.isFunction(this.options.onShow))
						this.options.onShow()
				}

				//	Al terminar de mostrarse
			,	'shown.bs.modal': function(el,ev)
				{
					if	(can.isFunction(this.options.onShown))
						this.options.onShown()
				}
			}
		)
	}
)