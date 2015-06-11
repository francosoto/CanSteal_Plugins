steal(
	'can/util'
).then(
	function()
	{
		/*
			Serializa un array para ser enviado a un servicio rest

		*/

		can.arraySerializer
		=	function(array,key)
			{
				return	can.map(
							array
						,	function(value)
							{
								return	_.isPlainObject(value)	&&	_.has(value,'id')
										?	_.object(
												['id'+can.capitalize(key)]
											,	[value.id]
											)
										:	_.isPlainObject(value)
											?	can.objectSerializer(value)
											:	_.isDate(value)
												?	value.toLocalJSON()
												:	value
							}
						)
			}


		/*
			Serializa un objeto para ser enviado a un servicio rest

		*/

		can.objectSerializer
		=	function(data)
			{
				return	_.transform(
							data instanceof can.Observe
							?	data.attr()
							:	data
						,	function(result,value,key)
							{
								result[
									_.isPlainObject(value)	&&	_.has(value,'id')
									?	'id'+can.capitalize(key)
									:	key
								]	=	_.isDate(value)
										?	value.toLocalJSON()
										:	_.isPlainObject(value)	&&	_.has(value,'id')
											?	value.id
											:	_.isArray(value)
												?	can.arraySerializer(value,key)
												:	value
							}
						)
			}


		/*
			Unifica un array de numeros, strings y booleanos.

			can.uniq(Array) -> Array
		*/

		can.uniq
		=	function(arr)
			{
				return	arr
							.filter(
								function (e, i, arr)
								{
									return arr.lastIndexOf(e) === i;
								}
							)
			}
		/*
			Valida utilizando una query

			can.isValid(Value,Query) -> bool

			Value (String | Observe | Constructor)
			Query (String | Object)
			
			Query: (as String)
			> field == value
			> field.attr(value) == true
			> field.value() == true
			
			Query: (as Observe | Constructor)
			>	eval(generateQueryString(value,query))
		*/

		can.isValid
		=	function(value,query)
			{
				return	(typeof query == "string")
						?	(query.split('.')[0] == '!')
							?	!(can.isValid(value,query.split('.')[1]))
							:	(typeof value == "string")
								?	value == query
								:	(typeof value == "object")
									?	(value.attr &&	value.attr(query))	||	value[query]
									:	false
						:	can.isFunction(query)
							?	query(value)
							:	eval(can.generateQueryString(value,query))
			}

		/*
			Genera un string en base a una query

			can.generateQueryString(value,query)

			* {and:  Value} - Value (String)
				> field && field == Value
			* {or:  Value} - Value (String)
				> field || field == Value
			* {and: {val: Value, criteria: Criteria}} - Value (String) Criteria (String)
				> field && field Criteria Value
			* {or: {val: Value, criteria: Criteria}} - Value (String) Criteria (String)
				> field || field Criteria Value
			* {and: {val: Value, or: {val: Value2}}, and: {val: Value3}}
				> field && (field == Value || field == Value2) ) && field == Value3
			* {or: {val: Value, and: {val: Value2}}, or: {val: Value3}}
				> field || (field == Value && field == Value2) ) || field == Value3

		*/

		can.generateQueryString
		=	function(value,query)
			{
				var	buildString
				=	function(value,query)
					{
						return	'('
							+	(
									(typeof value == "string")
									?	'"'+value+'"'+(query.criteria||'==')+'"'+query.val+'"'
									:	(value.attr && value.attr(query.key || query.val))
										?	value.attr(query.key || query.val) == (query.key ? query.val : true)
										:	can.isFunction(value[query.key || query.val])
											?	value[query.key || query.val]() == (query.key ? query.val : true)
											:	'"'+value[query.key]+'"'+(query.criteria||'==')+'"'+query.val+'"'
								)
							+	')'
					}
				,	joinArguments
				=	function(value,query)
					{
						var	string
						=	''

						if	(query.val)
							if	(query.val.split('.')[0]=='!')
								string += '!('+buildString(value,query)+')'
							else
								string+=buildString(value,query)

						string+=joinValidations(value,query)

						return 	string
					}
				,	joinValidations
				=	function(value,query)
					{
						var	string
						=	''

						for (var attr in query)
						{
							if	(attr == 'and' || attr == 'or')
							{
								string += (attr == 'and') ? '&&' : '||'
								string += '('+can.isValid(value,query[attr])+')'
							}	
						}

						return	string
					}

				return	joinArguments(value,query)
			}

		/*
			Verifica que un string sea una fecha segun el formato d(d)/m(m)/aa(aa)
			Ejemplo
				'1-1-20' 	->	True 
				'1-1-2020'	->	True
				'1-13-20'	->	False
				'1-20'		->	False
				'01-12-20'	->	True	
		*/

		can.isValidFullDate
		=	function(s){
				// Formato D(D)/M(M)/(YY)YY
				var	dateFormat
				=	/^\d{1,4}[\.|\/|-]\d{1,2}[\.|\/|-]\d{1,4}$/

				if	(dateFormat.test(s))
				{
					//	Removemos los ceros...
					s	=	s.replace(/0*(\d*)/gi,"$1")
					
					var	dateArray
					=	s.split(/[\.|\/|-]/)

					//	Coregimos el valor del mes
					dateArray[1] = dateArray[1]-1;

					//	Coregimos el valor del año
					if	(dateArray[2].length<4) {
						// correct year value
						dateArray[2] = (parseInt(dateArray[2]) < 50) ? 2000 + parseInt(dateArray[2]) : 1900 + parseInt(dateArray[2]);
					}

					var	testDate
					=	new Date(dateArray[2], dateArray[1], dateArray[0]);
					
					if	(testDate.getDate()!=dateArray[0] || testDate.getMonth()!=dateArray[1] || testDate.getFullYear()!=dateArray[2])
						return false
					else
						return true
				} else
					return false
			}

		/*
			Extiende can.isValidFullDate

			Verifica si es valida una fecha segun el formato m(m)/aa(aa). Si se pasa un dia tambien se verifica.
			
			Ejemplo:
				'05-20'		->	True
				'1-20'		->	True
				'1-2020'	->	True
				'5-6-20'	->	True
				'0-6-20'	->	False
				'0-20'		->	False
		*/

		can.isValidMonthDate
		=	function(s)
			{
				var	dateArray
				=	s.split(/[\.|\/|-]/)

				if	(dateArray.length == 2)
				{
					var	fullDateArray
					=	dateArray.reverse()
					
					fullDateArray.push('01')
					
					return	can.isValidFullDate(fullDateArray.reverse().join('-'))
				}
				else
					return	can.isValidFullDate(s)
			}

		can.fixYearDate
		=	function(y)
			{
				return	(parseInt(y) < 99) ? 2000 + parseInt(y) : parseInt(y)
			}

		can.fixMonthDate
		=	function(m)
			{
				return	m-1;
			}

		can.createDate
		=	function(s)
			{
				var t_day

				if	(s)
				{
					s	=	(s+'').replace(/0*(\d*)/gi,"$1")
					var	dateArray
					=	s.split(/[\.|\/|-]/)
					,	today
					=	can.createDate()

					switch(dateArray.length)
					{
						case 1:
							t_day	=	new Date(can.fixYearDate(dateArray[0]),today.getMonth(),today.getDate())
							break;
						case 2:
							t_day	=	new Date(can.fixYearDate(dateArray[1]),can.fixMonthDate(dateArray[0]),today.getDate())
							break;
						case 3:
							t_day	=	new Date(can.fixYearDate(dateArray[2]),can.fixMonthDate(dateArray[1]),dateArray[0])
							break;
					}
				}
				else
					t_day = new Date()

				t_day.setHours(0)
				t_day.setMilliseconds(0)
				t_day.setMinutes(0)
			
				return	t_day
			}

		can.isFutureDate
		=	function(s)
			{
				var	date
				=	can.createDate(s)
				,	today
				=	can.createDate()

				return	date > today
			}

		can.isPastDate
		=	function(s)
			{
				var	date
				=	can.createDate(s)
				,	today
				=	can.createDate()
				
				return	date < today
			}

		can.isToday
		=	function(s)
			{
				var	date
				=	can.createDate(s)
				,	today
				=	can.createDate()

				return	date.toDateString() == today.toDateString()
			}

		can.show
		=	function(element)
			{
				var $element
				=	can.$(element)

				if	($element.hasClass('hidden'))
					$element.removeClass('hidden')
				
				if	($element.is(':hidden'))
					$element.show()
			}

		can.hide
		=	function(element)
			{
				var $element
				=	can.$(element)

				if	(!$element.hasClass('hidden'))
					$element.addClass('hidden')
				
				if	($element.is(':hidden'))
					$element.show()
			}

		can.toggle
		=	function(element)
			{
				if	(can.$(element).is(':visible'))
					can.hide(element)
				else
					can.show(element)
			}
	}
)