steal(
	'lib/util.js'
).then(
	function()
	{
		var Sigma
		=	new Object()

		Date.prototype.getFullHours = function () {
			return	(this.getHours() < 9)
					?	'0'+this.getHours()
					:	this.getHours()
		}

		Date.prototype.getFullMinutes = function () {
		  	return	(this.getMinutes() < 9)
		  			?	'0'+this.getMinutes()
		  			:	this.getMinutes()
		}

		Date.prototype.getTotalMinutes= function()
		{
			return	this.getHours()*60 + this.getMinutes()
		}

		Array.prototype.clone = function() {
			return this.slice(0);
		}
	}
)