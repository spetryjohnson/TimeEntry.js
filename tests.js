/********************************************************
	MetronomeParser.parse
*********************************************************/

//-----------------------------------------------------------------
// When given as a range, and no date is specified, uses TODAY
//-----------------------------------------------------------------
var cases = [
	{ today: "1/1/2014", input: "9-10", expectedDate: "1/1/2014", expectedStart: "9:00", expectedEnd: "10:00" },
	{ today: "1/1/2014", input: "9p-10p", expectedDate: "1/1/2014", expectedStart: "21:00", expectedEnd: "22:00" }
];

for(var i=0; i < cases.length; i++) {
	var thisCase = cases[i];
	
	// to get around closure scoping in loop
	var assertFunc = function(testCase) {
		return function( assert ) {
			var parser = new MetronomeParser(testCase.today);
			var result = parser.parse(testCase.input);
		
			assert.equal(result.date, testCase.expectedDate, "Date: " + testCase.expectedDate);
			assert.equal(result.startHour + ":" + result.startMin, testCase.expectedStart, "Start Time: " + testCase.expectedStart);
			assert.equal(result.endHour + ":" + result.endMin, testCase.expectedEnd, "End Time: " + testCase.expectedEnd);
		};
	}(thisCase);
	
	QUnit.test("Given a date of " + thisCase.today + ", parses entry: " + thisCase.input, assertFunc);
}

//-----------------------------------------------------------------
// When given as a range, and a date is specified, calculate the date according to day of week
// The selected date for "today" is a Wednesday
//-----------------------------------------------------------------
var cases = [
	{ today: "1/1/2014", input: "Su 9-10", expectedDate: "12/29/2013", expectedStart: "9:00", expectedEnd: "10:00" },
	{ today: "1/1/2014", input: "M 9-10", expectedDate: "12/30/2013", expectedStart: "9:00", expectedEnd: "10:00" },
	{ today: "1/1/2014", input: "T 9-10", expectedDate: "12/31/2013", expectedStart: "9:00", expectedEnd: "10:00" },
	{ today: "1/1/2014", input: "W 9-10", expectedDate: "1/1/2014", expectedStart: "9:00", expectedEnd: "10:00" },
	{ today: "1/1/2014", input: "R 9-10", expectedDate: "1/2/2014", expectedStart: "9:00", expectedEnd: "10:00" },
	{ today: "1/1/2014", input: "F 9-10", expectedDate: "1/3/2014", expectedStart: "9:00", expectedEnd: "10:00" },
	{ today: "1/1/2014", input: "Sa 9p-10p", expectedDate: "1/4/2014", expectedStart: "21:00", expectedEnd: "22:00" }
];

for(var i=0; i < cases.length; i++) {
	var thisCase = cases[i];
	
	// to get around closure scoping in loop
	var assertFunc = function(testCase) {
		return function( assert ) {
			var parser = new MetronomeParser(testCase.today);
			var result = parser.parse(testCase.input);
		
			assert.equal(result.date, testCase.expectedDate, "Date: " + testCase.expectedDate);
			assert.equal(result.startHour + ":" + result.startMin, testCase.expectedStart, "Start Time: " + testCase.expectedStart);
			assert.equal(result.endHour + ":" + result.endMin, testCase.expectedEnd, "End Time: " + testCase.expectedEnd);
		};
	}(thisCase);
	
	QUnit.test("Given a date of " + thisCase.today + ", parses entry: " + thisCase.input, assertFunc);
}

/********************************************************
	MetronomeParser.getTimeComponents
*********************************************************/

//-----------------------------------------------------------------
// One or two digit time with optional AM/PM designation
//-----------------------------------------------------------------
var cases = [
	{ input: "9", expectedHour: "9", expectedMin: "00" },
	{ input: "9a", expectedHour: "9", expectedMin: "00" },
	{ input: "9am", expectedHour: "9", expectedMin: "00" },
	{ input: "9A", expectedHour: "9", expectedMin: "00" },
	{ input: "9AM", expectedHour: "9", expectedMin: "00" },
	{ input: "9p", expectedHour: "21", expectedMin: "00" },
	{ input: "9pm", expectedHour: "21", expectedMin: "00" },
	{ input: "9P", expectedHour: "21", expectedMin: "00" },
	{ input: "9PM", expectedHour: "21", expectedMin: "00" },

	{ input: "10", expectedHour: "10", expectedMin: "00" },
	{ input: "10a", expectedHour: "10", expectedMin: "00" },
	{ input: "10am", expectedHour: "10", expectedMin: "00" },
	{ input: "10A", expectedHour: "10", expectedMin: "00" },
	{ input: "10AM", expectedHour: "10", expectedMin: "00" },
	{ input: "10p", expectedHour: "22", expectedMin: "00" },
	{ input: "10pm", expectedHour: "22", expectedMin: "00" },
	{ input: "10P", expectedHour: "22", expectedMin: "00" },
	{ input: "10PM", expectedHour: "22", expectedMin: "00" }
];

for(var i=0; i < cases.length; i++) {
	var thisCase = cases[i];
	
	// to get around closure scoping in loop
	var assertFunc = function(testCase) {
		return function( assert ) {
			var parser = new MetronomeParser();
			var result = parser.getTimeComponents(testCase.input);
		
			assert.equal(result.hour, testCase.expectedHour, "Hour: " + testCase.expectedHour);
			assert.equal(result.minutes, testCase.expectedMin, "Minutes: " + testCase.expectedMin);
		};
	}(thisCase);
	
	QUnit.test("Parses time: " + thisCase.input, assertFunc);
}

//-----------------------------------------------------------------
// One or two digit hour, with minutes, and optional AM/PM designation
//-----------------------------------------------------------------
var cases = [
	{ input: "915", expectedHour: "9", expectedMin: "15" },
	{ input: "915a", expectedHour: "9", expectedMin: "15" },
	{ input: "915am", expectedHour: "9", expectedMin: "15" },
	{ input: "915A", expectedHour: "9", expectedMin: "15" },
	{ input: "915AM", expectedHour: "9", expectedMin: "15" },
	{ input: "915p", expectedHour: "21", expectedMin: "15" },
	{ input: "915pm", expectedHour: "21", expectedMin: "15" },
	{ input: "915P", expectedHour: "21", expectedMin: "15" },
	{ input: "915PM", expectedHour: "21", expectedMin: "15" },

	{ input: "1015", expectedHour: "10", expectedMin: "15" },
	{ input: "1015a", expectedHour: "10", expectedMin: "15" },
	{ input: "1015am", expectedHour: "10", expectedMin: "15" },
	{ input: "1015A", expectedHour: "10", expectedMin: "15" },
	{ input: "1015AM", expectedHour: "10", expectedMin: "15" },
	{ input: "1015p", expectedHour: "22", expectedMin: "15" },
	{ input: "1015pm", expectedHour: "22", expectedMin: "15" },
	{ input: "1015P", expectedHour: "22", expectedMin: "15" },
	{ input: "1015PM", expectedHour: "22", expectedMin: "15" }
];

for(var i=0; i < cases.length; i++) {
	var thisCase = cases[i];
	
	// to get around closure scoping in loop
	var assertFunc = function(testCase) {
		return function( assert ) {
			var parser = new MetronomeParser();
			var result = parser.getTimeComponents(testCase.input);
		
			assert.equal(result.hour, testCase.expectedHour, "Hour: " + testCase.expectedHour);
			assert.equal(result.minutes, testCase.expectedMin, "Minutes: " + testCase.expectedMin);
		};
	}(thisCase);
	
	QUnit.test("Parses time: " + thisCase.input, assertFunc);
}
