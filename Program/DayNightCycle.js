//  The current state, which other systems can access after a call to update
var DayNightCurrentState = {
	currentTimer: 15.0,
	lightLevel: 0,
	skyColor: "rgb(0, 0, 0)",
	nightTime: false,
}

//  Constant values we'll use to determine current light and color values for the world
const DayNightCycle = {
	intervalsPerSecond: 0.0667,
	dayNightIntervalCount: 4,
	dayLightLevels: [ 0.333, 0.670, 1.000, 0.670, ],
	skyColorLevels: [
		{ r: 7, 	g: 11, 		b: 35 },		//  Nightsky Blue
		{ r: 71, 	g: 92, 		b: 108 },		//  Morning Blue
		{ r: 135, 	g: 196, 	b: 235 },		//  Mid-day Blue
		{ r: 71, 	g: 92, 		b: 108 },		//  Evening Blue
	],
	skyColorRGB: () => { return `rgb(${DayNightCurrentState.skyColor.r}, ${DayNightCurrentState.skyColor.g}, ${DayNightCurrentState.skyColor.b})` },
	morning: 0.7,
	evening: 2.7,
};

if (DayNightCycle.dayLightLevels.length != DayNightCycle.dayNightIntervalCount) { console.log("dayLightLevels is not the correct length!"); }
if (DayNightCycle.skyColorLevels.length != DayNightCycle.dayNightIntervalCount) { console.log("skyColorLevels is not the correct length!"); }

var rgbAdd = (rgb1, rgb2) => {
	return { r: rgb2.r + rgb1.r, g: rgb2.g + rgb1.g, b: rgb2.b + rgb1.b };
}

var rgbDiff = (rgb1, rgb2) => {
	return { r: rgb2.r - rgb1.r, g: rgb2.g - rgb1.g, b: rgb2.b - rgb1.b };
}

var rgbMultiply = (rgb, multiple) => {
	return { r: rgb.r * multiple, g: rgb.g * multiple, b: rgb.b * multiple };
}

var rgbInt = (rgb, multiple) => {
	return { r: parseInt(rgb.r), g: parseInt(rgb.g), b: parseInt(rgb.b) };
}

var updateDayTimeCycle = (timeDelta) => {
	//  Update the current timer, then ensure we stay within the time range we've defined
	DayNightCurrentState.currentTimer += timeDelta * DayNightCycle.intervalsPerSecond;
	while (DayNightCurrentState.currentTimer >= DayNightCycle.dayNightIntervalCount) { DayNightCurrentState.currentTimer -= DayNightCycle.dayNightIntervalCount; }

	//  Find the current and next interval index, and the diff between them
	let currentIndex = parseInt(DayNightCurrentState.currentTimer);
	let nextIndex = (currentIndex < DayNightCycle.dayLightLevels.length - 1) ? (currentIndex + 1) : 0;
	let intervalDiff = DayNightCurrentState.currentTimer - currentIndex;

	//  Find the current light level
	let currentLightLevel = DayNightCycle.dayLightLevels[currentIndex];
	let nextLightLevel = DayNightCycle.dayLightLevels[nextIndex];
	let lightLevelDiff = nextLightLevel - currentLightLevel;
	DayNightCurrentState.lightLevel = currentLightLevel + (intervalDiff * lightLevelDiff);

	//  Find the current sky level
	let currentSkyLevel = DayNightCycle.skyColorLevels[currentIndex];
	let nextSkyLevel = DayNightCycle.skyColorLevels[nextIndex];
	let skyLevelDiff = rgbDiff(currentSkyLevel, nextSkyLevel);
	let adjustment = rgbMultiply(skyLevelDiff, intervalDiff);
	DayNightCurrentState.skyColor = rgbInt(rgbAdd(currentSkyLevel, adjustment));

	//  Determine if it is currently night-time
	let beforeDawn = (DayNightCurrentState.currentTimer < DayNightCycle.morning);
	let afterDusk = (DayNightCurrentState.currentTimer >= DayNightCycle.evening);
	DayNightCurrentState.nightTime = (beforeDawn || afterDusk);
}
