Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

var MetronomeParser = function(today) {

	this.today = (typeof(today) === "string")
		? new Date(today)
		: new Date();
	
	this.parse = function(text) {
		
		var convertToDayOfWeek = function(dayAbbr) {
			switch (dayAbbr.trim().toUpperCase()) {
				case "SU": return 0;
				case "M": return 1;
				case "T": return 2;
				case "W": return 3;
				case "R": return 4;
				case "F": return 5;
				case "SA": return 6;
				default: throw "'" + dayAbbr + "' is not a recognized Day Of Week abbreviation";
			}
		};
		
		var m = null;
		
		// Time given as range with no date. Use today's date.
		// Ex: 9-915 
		m = text.match(/^(SU|Su|su|SA|Sa|sa|[M|m|T|t|W|d|R|r|F|f]){0,1} ?([0-9]{1,4}[A|a|AM|am|P|p|PM|pm]{0,1})-([0-9]{1,4}[A|a|AM|am|P|p|PM|pm]{0,1})$/);
		if (m) {
			var dayOfWeek = m[1];
			var startTime = this.getTimeComponents(m[2]);
			var endTime = this.getTimeComponents(m[3]);
			
			var targetDate = (dayOfWeek == null)
				? this.today
				: this.today.addDays(convertToDayOfWeek(dayOfWeek) - this.today.getDay());
			
			return new TimeEntry({
				date: (targetDate.getMonth() + 1) + "/" + targetDate.getDate() + "/" + targetDate.getFullYear(),
				startHour: startTime.hour,
				startMin: startTime.minutes,
				endHour: endTime.hour,
				endMin: endTime.minutes
			});
		}

		// M 9-915
		m = text.match(/^([M|m|T|t|W|d|R|r|F|f) ([0-9]{1,4})-([0-9]{1,4})$/);
		
		throw "Could not parse: " + text;
	};
	
	this.getTimeComponents = function(s) {
		var m = null;
		
		var isPM = function(s) {
			return (s != null) && (s.indexOf("p") >= 0 || s.indexOf("P") >= 0);
		};
		
		// If we have a 1 or 2 digit number like "1" or "11", with optional am/pm designation, 
		// assume it's the hour and minutes weren't specified
		if (m = s.match(/^([0-9]{1,2})(A|a|AM|am|P|p|PM|pm){0,1}$/)) {
			var isPM = isPM(m[2]);
			
			var hour = isPM 
				? parseInt(m[1]) + 12
				: parseInt(m[1]);
			
			return { hour: hour.toString(), minutes: "00" };
		}
			
		// If we have 3 or 4 digits then assume its a 1 or 2 digit hour and 2 digit minutes.
		// "105" makes more sense as 1:05 than 10:5.
		if (m = s.match(/^([0-9]{3,4})(A|a|AM|am|P|p|PM|pm){0,1}$/)) {
			var hour = (m[1].length == 3)
				? m[1].substr(0, 1)
				: m[1].substr(0, 2);
				
			var minutes = (m[1].length == 3)
				? m[1].substr(1)
				: m[1].substr(2);
				
			var isPM = isPM(m[2]);
			
			if (isPM)
				hour = parseInt(hour) + 12;
			
			return { hour: hour.toString(), minutes: minutes };
		}

		throw "Could not parse time components from: " + s;
	}
}

var TimeEntry = function(hash) {
	this.date = hash.date || getDate();
	this.startHour = hash.startHour;
	this.startMin = hash.startMin;
	this.endHour = hash.endHour;
	this.endMin = hash.endMin;
	this.description = hash.description;
	this.ticketNum = hash.ticketNum || "";
}