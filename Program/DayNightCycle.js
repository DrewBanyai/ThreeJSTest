//  The current state, which other systems can access after a call to update
var DayNightCurrentState = {
	currentTimer: 15.0,
	lightLevel: 0,
	skyLevel: 0,
	nightTime: false,
}

//  Constant values we'll use to determine current light and color values for the world
const DayNightCycle = {
	intervalsPerSecond: 4,
	dayNightIntervalCount: 24,
	dayLightLevels: [ 99, 85, 99, 113, 127, 142, 157, 171, 185, 199, 213, 227, 241, 255, 241, 227, 213, 199, 185, 171, 157, 142, 127, 113 ],
	skyColorLevels: [ 69, 55, 69, 83, 97, 112, 127, 141, 155, 169, 183, 197, 211, 225, 211, 197, 183, 169, 155, 141, 127, 112, 97, 83 ],
};

if (DayNightCycle.dayLightLevels.length != DayNightCycle.dayNightIntervalCount) { console.log("dayLightLevels is not the correct length!"); }
if (DayNightCycle.skyColorLevels.length != DayNightCycle.dayNightIntervalCount) { console.log("skyColorLevels is not the correct length!"); }

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
	DayNightCurrentState.lightLevel = parseInt(currentLightLevel + (intervalDiff * lightLevelDiff));

	//  Find the current sky level
	let currentSkyLevel = DayNightCycle.skyColorLevels[currentIndex];
	let nextSkyLevel = DayNightCycle.skyColorLevels[nextIndex];
	let skyLevelDiff = nextSkyLevel - currentSkyLevel;
	DayNightCurrentState.skyLevel = parseInt(currentSkyLevel + (intervalDiff * skyLevelDiff));

	//  Determine if it is currently night-time
	let beforeDawn = (DayNightCurrentState.currentTimer < 6);
	let afterDusk = (DayNightCurrentState.currentTimer > 18);
	DayNightCurrentState.nightTime = (beforeDawn || afterDusk);
}
