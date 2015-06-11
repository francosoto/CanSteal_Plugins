function Tooltip(element,options)
{
    this.element
    =   element

    this.options
    =   options

    this.setTooltip
    =   function()
        {
            this.element.tooltip(this.options)

            return this
        }

    this.changeTooltip
    =   function(opts)
        {
            this.element.tooltip('destroy')
            this.element.tooltip($.extend(this.options,opts))

            return this
        }
}

function Modal(element,options)
{
    this.element
    =   element

    this.options
    =   options

    this.setModal
    =   function()
        {
            var self
            =   this
            var modal
            =    this.appendView()
                    .modal(
                        {
                            show: false
                        }
                    )

            this.element.bind(
                'click'
            ,   function()
                {
                    modal
                        .modal('show')
                }
            )

            return this
        }

    this.appendView
    =   function()
        {
            var modal
            =   $('<div class="modal fade" role="dialog"></div>')

            modal.attr('id','Modal'+(Math.random()*1000000).toFixed(0))

            modal
                .append(
                    '<div class="modal-dialog"><div class="modal-content"></div></div>'
                )

            if(this.options.title)
            {
                var header
                =   $('<div class="modal-header"></div>')

                header
                    .append(
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                    )

                header
                    .append(
                        '<h4 class="modal-title">'+this.options.title+'</h4>'
                    )

                modal
                    .find('.modal-content')
                        .append(
                            header
                        )
            }

            modal
                .find('.modal-content')
                    .append(
                        '<div class="modal-body"></div>'
                    )

            modal
                .find('.modal-body')
                    .append(
                        this.options.body
                    )

            if(this.options.buttons && this.options.buttons.length > 0)
            {
                var footer
                =   $('<div class="modal-footer"></div>')

                _.forEach(
                    this.options.buttons
                ,   function(item)
                    {
                        var data_dismiss
                        =   item.close
                            ?   'data-dismiss="modal"'
                            :   ''

                        footer
                            .append(
                                '<button type="button" class="btn btn-'+item.type+'" '+data_dismiss+'>'+item.name+'</button>'
                            )
                    }
                )

                modal
                    .find('.modal-content')
                        .append(
                            footer
                        )
            }

            return modal
        }
}

function RealTime(widget,options)
{
    this.options
    =   options

    this.setRealTime
    =   function()
        {
            var self
            =   this

            this._setTimeOut()

            /*this.element
                .bind(
                    'updateValue'
                ,   function(data)
                    {
                        self.element
                            .find('h3')
                                .html(data)
                    }
                )*/

            return this
        }

    this.updateRealTime
    =   function()
        {   
            widget.appendView()
            this._setTimeOut()
        }

    this._setTimeOut
    =   function()
        {
            setTimeout(
                $.proxy(this.updateRealTime,this)
            ,   this.options.time
            )
        }
}

function Menu(element,options)
{
    this.element 
    =   element

    this.options
    =   options

    this.setMenu
    =   function()
        {
            var self
            =   this
            ,   base
            =   $('<div class="row"></div>')

            base
                .append(
                    '<div class="list-group menu '+this.options.class+'"></div>'
                )

            _.forEach(
                this.options.options
            ,   function(item)
                {
                    base
                        .find('.menu')
                            .append(
                                '<a href="'+item.link+'" data-route="'+item.name.replace(' ','').toLowerCase()+'" data-toggle="tooltip" data-placement="right" title="Toggle menu" class="list-group-item navegable"><span class="glyphicon glyphicon-'+item.icon+'"></span> '+item.name+'</a>'
                            )

                    if(item.suboptions && item.suboptions.length > 0)
                    {
                        base
                            .find('.menu')
                                .append(
                                    '<div class="submenu" data-parent="'+item.name.replace(' ','').toLowerCase()+'"></div>'
                                )

                        _.forEach(
                            item.suboptions
                        ,   function(sitem)
                            {
                                base
                                    .find('.submenu[data-parent="'+item.name.replace(' ','').toLowerCase()+'"]')
                                        .append(
                                            '<a href="'+sitem.link+'" data-toggle="tab" class="list-group-item navegable"><span class="glyphicon glyphicon-'+sitem.icon+'"></span> '+sitem.name+'</a>'
                                        )
                            }
                        )
                    }
                }
            )

            if(this.options.slideMenu)
            {
                base
                    .append(
                        '<div class="slide-menu '+this.options.slideMenu.class+'"><button type="button" class="btn btn-link"><span class="glyphicon glyphicon-'+this.options.slideMenu.icon+'"></span></button></div>'
                    )
            }

            this.element
                .append(
                    base
                )

            if(this.options.slideMenu)
                this.slideMenu()

            this.element
                .find('.slide-menu')
                    .bind(
                        "click"
                    ,    function() 
                        {
                            $(self.options.element_toggle).toggleClass("active");
                        }
                    )
        }

    this.slideMenu
    =   function()
        {
            var self
            =   this

            this.element
                .find('.list-group > .navegable')
                    .bind(
                        'click'
                    ,   function(ev)
                        {
                            self.element
                                .find('.submenu[data-parent="'+$(ev.currentTarget).attr('data-route')+'"]')
                                    .slideToggle('slow')
                                        .find('.active')
                                            .removeClass('active')
                        }
                    )
        }
}

function Chart(element,options)
{
    this.element 
    =   element

    this.chart
    =   undefined

    this.m_chart
    =   undefined

    this._getMCContainer // Obtiene el Container donde está concentrado el minimal chart/graph
    =   options.plugin_options.minimal_chart
        &&  options.plugin_options.minimal_chart.container_to_hidden
        ?   $(options.plugin_options.minimal_chart.container_to_hidden)
        :   $(options.plugin_options.minimal_chart.container_to).parent()

    this.default_options
    =   {
            graphic:
            {
                credits: 
                {
                    enabled: false
                }
            }
        }

    this.options 
    =   _.merge(
            options
        ,   this.default_options   
        )

    this.options_minimal_to_remove
    =   ['legend','subtitle']

    this.options_minimal_to_update // Establece opciones mínimas por defecto al instalar el widget
    =   {
            tooltip:
            {
                enabled: false
            }
        ,   exporting:
            {
                enabled: false
            }
        ,   chart:
            {
                height: 250
            }
        }

    this.set_minimal_options // Realiza un merge de opciones particulares con las que están por default para la visualización mínima del gráfico
    =   function(new_min_opts)
        {
            this.options_minimal_to_update
            =   _.merge(this.options_minimal_to_update,new_min_opts)
        }

    this.setChart // Instala el gráfico a gran escala
    =   function(element)
        {
            var self
            =   this
            ,   el
            =   element && element.length > 0?element:this.element

            this.chart
            =   el.highcharts(this.options.graphic)

            this._setResizer(this.chart,el)

            el.trigger('chart-complete')

            return this
        }

    this.removeOptionsMinimal // Actualiza las opciones para el gráfico mínimo (de acuerdo a las opciones establecidas como por defecto)
    =   function()
        {
            var auxOpt
            =   _.clone(this.options.graphic,true)
            ,   self
            =   this
            ,   opt
            =   this.options.plugin_options

            $.each(
                auxOpt
            ,   function(index,item)
                {
                    if(_.contains(self.options_minimal_to_remove,index))
                    {
                        delete auxOpt[index]
                    }
                    if(_.isEqual(index,'xAxis'))
                    {
                        if(_.isArray(auxOpt.xAxis))
                            _.forEach(
                                auxOpt.xAxis
                            ,   function(item)
                                {
                                    if(item.labels && item.labels.step)
                                        item.labels.step = 5
                                }
                            )   
                        else
                            auxOpt.xAxis.categories
                            =   _.map(
                                    auxOpt.xAxis.categories
                                ,   function(item)
                                    {
                                        return  _.isString(item)
                                            ?   item.charAt(0)
                                            :   item
                                    }
                                )
                    }
                    if(opt
                        && opt.minimal_chart
                        && opt.minimal_chart.view_details_enabled
                    )
                    {
                        auxOpt.chart
                        =   {
                                events:
                                {
                                    click:function()
                                    {
                                        if( self.options.graphic.chart.events
                                            &&  _.isFunction(self.options.graphic.chart.events.click)
                                            )
                                            self.options.graphic.chart.events.click()

                                        if(_.isEqual(self._getMCContainer.css('display'),'none'))
                                            self.setChart(
                                                $(opt.minimal_chart.container_to)
                                            )

                                        self._setFooLegend()

                                        self._getMCContainer.slideToggle(
                                            'slow'
                                        ,   function()
                                            {
                                                if(_.isEqual(self._getMCContainer.css('display'),'none'))
                                                {
                                                    self.setChart(
                                                        $(opt.minimal_chart.container_to)
                                                    )
                                                    self._getMCContainer.slideToggle('show')
                                                }
                                            }
                                        )
                                    }
                                }
                            }
                    }
                }
            )

            return _.merge(auxOpt,this.options_minimal_to_update)
        }

    this.setMinimalChart // Instala el gráfico mínimo
    =   function()
        {
            this._setButton()
            
            if(this.element.length > 0)
            {
                this.m_chart 
                =   this.element
                        .highcharts(
                            this.removeOptionsMinimal()
                        )
                
                this._setResizer(this.m_chart,this.element)

                return this.m_chart
            }
        }

    this._setResizer // al haber transiciones por parte de algún elemento, el gráfico se actualiza
    =   function(chart,container)
        {
            var self
            =   this

            if(this.options.plugin_options
                &&  this.options.plugin_options.container_chart_resize
                &&  this.options.plugin_options.container_chart_resize.length > 0
               )
            {
                this.options.plugin_options.container_chart_resize
                    .bind(
                        'transitionend webKitTransitionEnd oTransitionEnd mozTransitionEnd'
                    ,   function(ev)
                        {
                            ev.preventDefault()
                            ev.stopPropagation()

                            chart.highcharts().setSize(container.width())
                        }
                    )
            }
        }

    this._setButton // Instala botón de Cerrar gráfico por defecto
    =   function()
        {
            var self
            =   this
            ,   opt
            =   this.options.plugin_options.minimal_chart

            if( opt.button_close_enabled 
                && this._getMCContainer.find(".close-button").length > 0 
                && this._getMCContainer.find("#goback").length == 0
            )
            {
                this._getMCContainer
                    .find(".close-button")
                        .html(
                            '<button id="goback" type="button" class="btn btn-default">Cerrar gráfico</button>'
                        )
                        .bind(
                            "click"
                        ,   function()
                            {
                                self._getMCContainer.slideToggle('slow')
                            }
                        )
            }
        }

    this._setFooLegend // Instala diálogo (comentarios) en la parte inferior del gráfico por defecto
    =   function()
        {
            var opt
            =   this.options.plugin_options.minimal_chart

            if(opt.footer_data.length > 0 
                && this._getMCContainer.find("#infochart").length > 0
            )
            {
                this._getMCContainer
                    .find('#infochart')
                        .html($(opt.footer_data).html())
            }
        }
}

function Indicador(element,options)
{
    this.element 
    =   element

    this.options
    =   options

    this.setIndec
    =   function()
        {
            var iopts
            =   this.options.graphic
            ,   prev_value
            =   _.isArray(iopts.rang_values) && iopts.rang_values[0].to
                ?   iopts.rang_values[0].to
                :   -9999999999

            this.appendView()

            if(this.options.plugin_options.tooltip && this.options.plugin_options.tooltip.enabled)
                this.tooltip 
                =   new Tooltip(
                        this.element
                    ,   this.options.plugin_options.tooltip
                    ).setTooltip()

            if(this.options.plugin_options.real_time)
                this.realTime
                =   new RealTime(this,this.options.plugin_options.real_time).setRealTime()

            if(_.isObject(this.options.plugin_options.modal))
                this._setModal()

            return this
        }

    this.appendView
    =   function()
        {
            var iopts
            =   this.options.graphic
            ,   self
            =   this

            if(_.isFunction(iopts.data))
            {
                var d
                =   iopts.data()

                this.renewView(this.getValueRange(d).type,iopts.name,d)
            }
            else
            {
                iopts.data
                    .then(
                        function(data)
                        {
                            self.renewView(self.getValueRange(data),iopts.name,data)
                        }
                    )
            }
        }

    this.renewView
    =   function(type,name,data)
        {
            this.element
                .find('*').remove()

            var form
            =   data
            ,   self
            =   this

            if(this.options.plugin_options.format)
            {
                form
                =   _.clone(this.options.plugin_options.format)

                _.forEach(
                    _.uniq(form.match(/<[a-z._-]*>/gi))
                ,   function(item)
                    {
                        a = new RegExp(/[a-z._-]+/gi).exec(item)
                        form = form.replace(item,a[0]=="data"?data:self.options[a[0]])
                    }
                )
            }

            this.element
                .append(
                    '<div class="alert alert-'+type+' text-center"><p>'+name+'</p><h3>'+form+'</h3></div>'
                )
        }

    this.getValueRange
    =   function(data)
        {
            var iopts
            =   this.options.graphic

            return  iopts.rang_values
                    ?   _.filter(
                            iopts.rang_values
                        ,   function(item)
                            {
                                var result
                                =   !_.isUndefined(item.until) && !_.isUndefined(item.to)
                                    ?   data <= item.until
                                        &&  item.to <= data 
                                    :   !_.isUndefined(item.until)
                                        ?   prev_value <= data 
                                            &&  data <= item.until
                                        :   prev_value <= data

                                prev_value 
                                =   item.until
                                    ?   item.until
                                    :   item.to

                                return  result
                            }
                        )[0]
                    :   {
                            type: this.options.plugin_options.range_default
                                ?   this.options.plugin_options.range_default
                                :   ''
                        }
        }

    this._setModal
    =   function()
        {
            var plopts
            =   this.options.plugin_options

            this.modal
            =   new Modal(this.element,plopts.modal).setModal()

            if(plopts.tooltip && plopts.tooltip.enabled)
                this.tooltip.changeTooltip(
                    {
                        title: plopts.tooltip.title + ' - Haga click para ver más información -'
                    }
                )
            else
                this.tooltip 
                =   new Tooltip(
                        this.element
                    ,   {
                            title: 'Haga click para ver más información'
                        }  
                    ).setTooltip()
        }
}

function Ranking(element,options)
{
    this.element 
    =   element

    this.options
    =   options

    this.setRank
    =   function()
        {
            this.appendView()

            if(this.options.plugin_options.real_time)
                this.realTime
                =   new RealTime(this,this.options.plugin_options.real_time).setRealTime()

            return this
        }

    this.appendView
    =   function()
        {
            var iopts
            =   this.options.graphic
            ,   self
            =   this

            this.element
                .append(
                    $(this.options.plugin_options.view).clone().html()
                )

            if(_.isFunction(iopts.data))
            {
               this.renewView(iopts.data())
            }
            else
            {
                iopts.data
                    .then(
                        function(data)
                        {
                            self.renewView(data)
                        }
                    )
            }
        }

    this.renewView
    =   function(data)
        {
            var self
            =   this
            ,   template
            =   $(this.options.plugin_options.view)
                    .find(this.options.plugin_options.template)
                        .clone()
                            .html()

            if(template)
            {
                this.element
                    .find(this.options.plugin_options.template)
                        .find('*')
                            .remove()

                _.forEach(
                    data
                ,   function(item,index)
                    {  
                        tmp = template

                        _.forEach(
                            _.uniq(template.match(/@[a-z._-]*@/gi)) //devuelve un array de los valores que matchean con el patrón dado
                        ,   function(it)
                            {
                                a = new RegExp(/[a-z._-]+/gi).exec(it) //ver función exec, reemplazo de valores en el template
                                tmp = tmp.replace(it,a[0]=="count"?index:item[a[0]])
                            }
                        )

                        self.element
                            .find(self.options.plugin_options.template)
                                .append(
                                    tmp
                                )
                    }
                )
                if(_.isString(self.options.plugin_options.to_evaluate_range))
                    this._setValuesRange()
            }

        }

    this._setValuesRange
    =   function()
        {
            var self
            =   this

            _.forEach(
                self.element
                    .find(self.options.plugin_options.template)
                        .children()
            ,   function(item,index)
                {
                    $(item)
                        .addClass(
                            self.getValueRange(
                                self.options.graphic.data()
                                    [index]
                                        [self.options.plugin_options.to_evaluate_range]
                            ).type
                        )
                }
            )
        }

    this.getValueRange
    =   function(data)
        {
            var iopts
            =   this.options.graphic

            return  iopts.rang_values
                    ?   _.filter(
                            iopts.rang_values
                        ,   function(item)
                            {
                                var result
                                =   !_.isUndefined(item.until) && !_.isUndefined(item.to)
                                    ?   data <= item.until
                                        &&  item.to <= data 
                                    :   !_.isUndefined(item.until)
                                        ?   prev_value <= data 
                                            &&  data <= item.until
                                        :   prev_value <= data

                                prev_value 
                                =   item.until
                                    ?   item.until
                                    :   item.to

                                return  result
                            }
                        )[0]
                    :   {
                            type: 'info'
                        }
        }
}

function ViewInfo(element,options)
{
    this.element 
    =   element

    this.options
    =   options

    this.count
    =   0

    this.setView
    =   function()
        {
            this.appendView()

            if(this.options.plugin_options.real_time)
                this.realTime
                =   new RealTime(this,this.options.plugin_options.real_time).setRealTime()

            return this
        }

    this.appendView
    =   function()
        {
            var iopts
            =   this.options.graphic
            ,   self
            =   this

            /*this.element
                .append(
                    $(this.options.plugin_options.view).clone().html()
                )*/

            if(this.options.plugin_options.class)
                this.element.addClass(this.options.plugin_options.class)

            if(_.isFunction(iopts.data))
            {
               this.renewView(iopts.data())
            }
            else
            {
                iopts.data
                    .then(
                        function(data)
                        {
                            self.renewView(data)
                        }
                    )
            }
        }

    this.renewView
    =   function(data)
        {
            var self
            =   this
            ,   array_templates
            =   []
            ,   template
            =   $(this.options.plugin_options.template)
                    .clone()
                        .html()

            if(template)
            {
                this.element
                    .find(this.options.plugin_options.template)
                        .find('*')
                            .remove()

                _.forEach(
                    data
                ,   function(item,index)
                    {
                        tmp = template

                        _.forEach(
                            _.uniq(template.match(/@[a-z._-]*@/gi)) //devuelve un array de los valores que matchean con el patrón dado
                        ,   function(it)
                            {
                                a = new RegExp(/[a-z._-]+/gi).exec(it) //ver función exec, reemplazo de valores en el template
                                tmp = tmp.replace(it,a[0]=="count"?index:item[a[0]])
                            }
                        )

                        self.count++

                        array_templates.push(tmp)
                    }
                )
                if(this.options.plugin_options.limit < this.count)
                {
                    _.forEach(
                        _.range(this.count - this.options.plugin_options.limit)
                    ,   function(item)
                        {
                            $(_.first(self.element.children())).remove()
                        }
                    )
                    this.count = this.options.plugin_options.limit
                }

                this.element
                    .append(
                        array_templates
                    )

                if(_.isString(self.options.plugin_options.to_evaluate_range))
                    this._setValuesRange()
            }

        }

    this._setValuesRange
    =   function()
        {
            var self
            =   this

            _.forEach(
                self.element
                    .find(self.options.plugin_options.template)
                        .children()
            ,   function(item,index)
                {
                    $(item)
                        .addClass(
                            self.getValueRange(
                                self.options.graphic.data()
                                    [index]
                                        [self.options.plugin_options.to_evaluate_range]
                            ).type
                        )
                }
            )
        }

    this.getValueRange
    =   function(data)
        {
            var iopts
            =   this.options.graphic

            return  iopts.rang_values
                    ?   _.filter(
                            iopts.rang_values
                        ,   function(item)
                            {
                                var result
                                =   !_.isUndefined(item.until) && !_.isUndefined(item.to)
                                    ?   data <= item.until
                                        &&  item.to <= data 
                                    :   !_.isUndefined(item.until)
                                        ?   prev_value <= data 
                                            &&  data <= item.until
                                        :   prev_value <= data

                                prev_value 
                                =   item.until
                                    ?   item.until
                                    :   item.to

                                return  result
                            }
                        )[0]
                    :   {
                            type: 'info'
                        }
        }
}

function PanelConstructor(element,options)
{
    this.element
    =   element

    this.options
    =   options

    this.setPanel
    =   function()
        {
            var base
            =   $('<div class="panel panel-default"></div>')

            if(this.options.title)
            {
                base
                    .append(
                        '<div class="panel-heading navegable"><button type="button" class="btn btn-link"><h3 class="panel-title"></h3></button></div>'
                    )
                
                base
                    .find('h3')
                        .append(
                            this.options.title
                        )
            }

            base
                .append(
                    '<div class="panel-body"></div>'
                )

            this.element
                .append(
                    base
                )

            if(this.options.slideBody)
                this.slideBody()

            return this
        }

    this.slideBody
    =   function()
        {
            var self
            =   this

            this.element
                .find('.navegable')
                    .bind(
                        'click'
                    ,   function(ev)
                        {
                            self.element
                                .find('.panel-body')
                                    .slideToggle('slow')
                                        .find('.active')
                                            .removeClass('active')
                        }
                    )
        }
}