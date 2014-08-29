Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

Date.prototype.addMinutes = function(minutes) {
	return new Date(this.getTime() + (minutes * 60000));
};

var MetronomeParser = function(now) {

	this.now = (typeof(now) === "string")
		? new Date(now)
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
		
		var formatMMDDYYYY = function(date) {
			return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
		};
		
		var padWithLeadingZeros = function(num, size) {
			var s = num+"";
			
			while (s.length < size) 
				s = "0" + s;
			
			return s;		
		};
		
		var m = null;
		
		// Time given as a range with an optional day identifier. Uses TODAY if date not given
		// Ex: 9-915 or M 900-1000
		m = text.match(/^(SU|Su|su|SA|Sa|sa|[M|m|T|t|W|d|R|r|F|f]){0,1} ?([0-9]{1,4}[A|a|AM|am|P|p|PM|pm]{0,1})-([0-9]{1,4}[A|a|AM|am|P|p|PM|pm]{0,1})$/);
		if (m) {
			var dayOfWeek = m[1];
			var startTime = this.getTimeComponents(m[2]);
			var endTime = this.getTimeComponents(m[3]);
			
			var targetDate = (dayOfWeek == null)
				? this.now
				: this.now.addDays(convertToDayOfWeek(dayOfWeek) - this.now.getDay());
			
			return new TimeEntry({
				date: formatMMDDYYYY(targetDate),
				startHour: startTime.hour,
				startMin: startTime.minutes,
				endHour: endTime.hour,
				endMin: endTime.minutes
			});
		}

		// Time given as a duration only. Use NOW as the ending time, then work backwards.
		// Ex: 90m or 1.5h
		m = text.match(/^([0-9]+(\.[0-9]+){0,1}) ?([m|M|h|H|hr|Hr|HR])$/);
		if (m) {
			var number = parseFloat(m[1]);
			var durationType = m[3];
			
			var minutes = null;
			
			switch (durationType.toUpperCase()) {
				case "M": 
					minutes = number;
					break;
					
				case "H":
				case "HR":
					minutes = number * 60;
					break;
					
				default:
					throw "Duration type '" + durationType + "' is not recognized";
			}
			
			var endTime = this.now;
			var startTime = endTime.addMinutes(minutes * -1);

			return new TimeEntry({
				date: formatMMDDYYYY(startTime),
				startHour: startTime.getHours(),
				startMin: padWithLeadingZeros(startTime.getMinutes(), 2),
				endHour: endTime.getHours(),
				endMin: padWithLeadingZeros(endTime.getMinutes(), 2)
			});
		}
		
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