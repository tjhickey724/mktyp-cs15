function calc_age(){
	console.log("pushed the button!!");
	console.log("Your age in years is "+ $("#ageInYears").val())
	var inputVal = $("#ageInYears").val();
	var ageInYears = parseFloat(inputVal);
	var ageInSeconds = ageInYears*365.25*24*60*60;
	var ageInMegaSeconds = ageInSeconds/1000000;
	$("#ageInSeconds").val(ageInMegaSeconds);
}