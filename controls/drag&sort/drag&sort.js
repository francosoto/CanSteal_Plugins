steal(
	'lib'
,	'controls/control'
,	'plugin/plugin.js'
).then(
	'controls/drag&sort/dragger.css'
).then(
	function()
	{
		can.Control(
			'Sigma.Dragger'
		,	{
				defaults:
				{
					view:		false
				,	view_box:	false
				,	container_view: false
				,	view_item:	false
				,	editable:	false
				,	new:		false
				,	available:	false
				,	removable:	false
				,	box_action:	false 
				,	dragBetween:false
				,	box_name:	"Nuevo Box"
				,	reset_btn:	can.$('<button type="button" class="close">&times;</button>')
				,	minus_btn:	can.$('<button type="button" class="min"><i class="icon-minus"></button>')
				,	plus_btn:	can.$('<button type="button" class="max"><i class="icon-plus"></i></button>')
				,	remove_btn:	can.$('<button type="button" class="remove"><i class="icon-remove"></i></i></button>')
				,	data: 		undefined
				,	dragTo: 	false
				,	dragFrom: 	false
				,	second_view: false
				,	container_second_view: false
				,	duplicate: 	false
				,	second_data: false
				}
			}
		,	{
				init: function(element,options)
				{
					this._render_content(options.data)
				}
			,	_render_content: function(data)
				{
					// TODO: SALVAR - VER METODO this.DRAGEND
					can.append(
						this.options.container_view
						? 	this.element.find(this.options.container_view) 
						: 	this.element
					,	can.view(
							steal.idToUri(this.options.view).path
						,	data
						)
					)

					if 	(this.options.second_view)
						can.append(
							this.options.container_second_view
							?	$(this.options.container_second_view)
							: 	this.element
						,	can.view(
								steal.idToUri(this.options.second_view).path
							,	this.options.second_data
								?	this.options.second_data
								: 	new can.Observe({})
							)
						)

					if	(this.options.editable)
						_.each(
							this.element.find('.dragger-box .title')
						,	this.setEditable
						)

					if	(this.options.available)
						this.setDragAvailable()

					if	(this.options.removable)	{
						this.element
								.find('.dragger-item')
									.prepend(
										this.options.reset_btn.clone()
									)
						this.element
								.find('.available .dragger-item button.close')
									.hide()
					}

					if	(this.options.box_action)
						this.element
								.find('.sorteable .dragger-box')
									.prepend(
										this.options.minus_btn.clone()
									)
									.prepend(
										this.options.remove_btn.clone()
									)
					
					this.setDragSort()
				}
			,	setDragSort: function()
				{
					this.element
							.find('.dragger-box ul.drag_ul,	ul.drag-dest')
								.dragsort(
									{
										dragBetween: this.options.dragBetween
									,	dragEnd: 	can.proxy(this.dragEnd, this)
									,	dragRemove:	this.options.reset_btn.clone()
									,	placeHolderTemplate: "<li class='list-group-item' style='border:dashed 1px gray !important; width:100% !important;'><div></div></li>"
									}
								)
				}
			,	setMore: function()
				{
					this.element
							.find('.dragger-box ul.drag_ul,	ul.drag-dest')
								.dragsort('destroy')
					this.setDragSort()
				}

			,	setDragAvailable: function()
				{
					can.append(
							this.element.find('.available')
						,	can.view(
								steal.idToUri(this.options.view_available).path
							,	this.options.available
							)
						)
				}

			,	setEditable: function(title)
				{
					can.$(title)
							.tooltip(
								{
									title: 'Presione para editar'	
								}
							)

					can.$(title)
							.editable(
								{
									type:			'text'
								,	title:			'Nombre del Grupo'
								,	highlight:		false
								,	showbuttons:	false
								,	mode:			'inline'
								,	inputclass:		'input-xlarge'
								}
							)
							.removeClass('editable-click')
				}

			,	getNewBoxName: function()
				{
					var	news
					=	this.element.find('div.dragger-box h4.title:contains("'+this.options.box_name+'")')
					
					return	this.options.box_name
						+	(
								news.length
								?	" "+(news.length+1)
								:	""
							)
				}

			,	'button.drag-new-box click': function()
				{
					can.append(
						this.element.find('.sorteable')
					,	can.view(
							steal.idToUri(this.options.view_box).path
						,	new can.Observe(
								{
									title:	this.getNewBoxName()
								}
							)
						)
					)

					this.setEditable(
							this.element.find('.sorteable .dragger-box:last .title')
						)

					this.element
							.find('.dragger-box ul')
								.dragsort('destroy')

					if	(this.options.box_action)
						this.element
								.find('.sorteable .dragger-box:last')
									.prepend(
										this.options.minus_btn.clone()
									)
									.prepend(
										this.options.remove_btn.clone()
									)

					this.setDragSort()
				}

			,	'button.close click': function(el)
				{
					var	item
					=	el.parent('.dragger-item')
							.parent('li')

					this.insertIntoAvailable(item.clone())

					item
						.remove()
				}

			,	insertIntoAvailable: function(item)
				{
					console.log("insert av",item)
					item
						.find('button.close')
							.hide()

					can.append(
						this.element.find('.available .dragger-box ul')
					,	item
							.appendTo(
								can.$('<li>')
							)
					)				
				}

			,	'button.remove click': function(el)
				{
					var	item
					=	can.$(el)
							.parent('.dragger-box')
								.find('ul li .dragger-item')
					
					this.insertIntoAvailable(item)

					el
						.parent('.dragger-box')
							.remove()
				}

			,	'button.min click': function(el)
				{
					el
						.parent('.dragger-box')
							.find('ul')
								.toggle()

					el.unbind()

					el
						.replaceWith(this.options.plus_btn.clone())
				}

			,	'button.max click': function(el)
				{
					el
						.parent('.dragger-box')
							.find('ul')
								.toggle()

					el.unbind()

					el
						.replaceWith(this.options.minus_btn.clone())
				}

			,	'li mouseup': function(el)
				{
					this.desde = el.parent('ul')
				}

			,	dragEnd: function(dragged)
				{
					if	(can.$(dragged).parents('.sorteable').length)	{
						can.$(dragged)
								.find('div.dragger-item')
									.find('button.close')
											.show()
					}	else	{
						can.$(dragged)
								.find('div.dragger-item')
										.find('button.close')
											.hide()
					}
					if 	(this.options.duplicate && $(dragged).parent('ul:not(.list-group)').length > 0)
					{
						can.append(
							this.desde
						,	$(dragged).clone()
						)
					}
					if 	(this.options.dragTo)
					{
						var dat = $(dragged).data('data')
						var newData = can.append(
							$(dragged).parents('div.'+this.options.dragTo).data('data',dat)
						,	$(dragged).parent('ul').removeClass(this.options.dragTo).clone()
						)
						can.trigger(
							this.element
						,	'dragged-element'
						,	{data:newData}
						)
						$(dragged).parent('ul:not(.list-group)').remove()
					}
					// TODO: SALVAR EN ALGUN LADO
				}
			}
		)
	}
)
