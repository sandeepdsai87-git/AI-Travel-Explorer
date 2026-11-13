const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('live-current.js','utf8');
const context = vm.createContext({setTimeout,clearTimeout,console,URL,URLSearchParams,AbortController,DOMException,document:{getElementById:()=>({textContent:'',focus(){}})}});
vm.runInContext(source.slice(0,source.lastIndexOf("$('back').onclick=")),context);
const run = script => vm.runInContext(script,context);
let count = 0;
function check(expression) {
 assert.ok(run(expression),expression);
 count++;
}

(async () => {
 run("render=()=>{};side=()=>{};refreshDiscovery=async()=>{};loadExperiences=async()=>{};");
 run("s.origin='Hyderabad';s.route='Ahmedabad,Dwarka,Unmapped stop';s.start='2026-12-31';s.end='2027-01-01';sync();");
 run("setPriority07(1,'must');s.places=[{name:'Dwarka temple',city:'Dwarka',selected:false,locked:true},{name:'Museum',city:'Ahmedabad',selected:true},{name:'Skip me',city:'Dwarka',selected:false}];");
 run("addJourney(0,'Bus');const selected=s.legs[0].journeys[0].id;editJourney(0,selected,'duration','600');editJourney(0,selected,'transfers','Transfer at terminal');selectJourney(0,selected);addJourney(0,'Flight');");
 await run('build()');
 check("s.days.map(d=>d.date).join() === '2026-12-31,2027-01-01'");
 check("s.days.flatMap(d=>d.stops.map(x=>x.name)).join() === 'Ahmedabad,Dwarka,Unmapped stop'");
 check("s.days[0].stops[0].experiences[0].name==='Museum'");
 check("s.days[1].stops[0].experiences.length===1&&s.days[1].stops[0].experiences[0].locked");
 check("s.days[0].stops[0].travel.includes('Bus · Not booked')&&s.days[0].stops[0].travel.includes('600 min')&&s.days[0].stops[0].travel.includes('Transfer at terminal')&&!s.days[0].stops[0].travel.includes('Flight')");
 check("s.days[1].stops[1].travel.includes('Transport choice unavailable')&&s.days[1].stops[1].travel.includes('Travel duration unknown')");
 check("conflicts().some(x=>x.includes('no coordinates'))&&conflicts().some(x=>x.includes('multiple stops'))");
 check("s.days[1].stops[0].must&&itineraryHTML().includes('Must visit')");
 run("setPriority07(0,'must')");
 check("s.dirty&&s.trip.mustVisitIds.includes(resolveDestination('Ahmedabad').id)");
 check("s.days[0].stops[0].hasCoordinates&&s.selectedDestinations[0].coordinates.latitude===23.02579");
 run("s.days[0].notes='Keep <my> note';s.days[0].activities='Market';s.days[0].schedule='09:00 local';");
 for (const step of [2,3,4,5,4]) {
  run('go('+step+')');
  check('s.step==='+step+'&&s.days[0].notes==="Keep <my> note"&&s.legs[0].selectedJourneyId===selected');
 }
 check("itineraryHTML().includes('Keep &lt;my&gt; note')&&itineraryHTML().includes('09:00 local')");
 check("itineraryDayText(s.days[0]).includes('Traveler activities: Market')");
 run("s.start='2027-01-01';sync();");
 check("conflicts().some(x=>x.includes('Refresh the draft'))");
 await run('build()');
 check("s.days.length===1&&s.days[0].notes===''&&itineraryHTML().includes('Saved edits outside')");
 run("s.start='2026-12-31';sync();");
 await run('build()');
 check("s.days[0].notes==='Keep <my> note'&&s.days[0].activities==='Market'&&s.days[0].schedule==='09:00 local'");
 run("const savedProvider=providers.itinerary;providers.itinerary={create:async()=>({status:'illustrative',days:[]})}");
 await run('build()');
 check("itineraryMessage.includes('unavailable')&&s.days[0].notes==='Keep <my> note'");
 run("providers.itinerary=savedProvider;s.start='2027-02-30';s.end='2027-03-02';");
 await run('build()');
 check("itineraryMessage.includes('valid trip date range')&&s.days[0].date==='2026-12-31'");
 run("s.start='2026-12-31';s.end='2027-01-01';sync();let resolveDraft;providers.itinerary={create:()=>new Promise(resolve=>{resolveDraft=resolve})};const pendingDraft=build();");
 run("set('route','Dwarka,Ahmedabad');resolveDraft({status:'illustrative',days:[]});");
 await run('pendingDraft');
 check("s.dirty&&s.days[0].stops[0].name==='Ahmedabad'&&!itineraryMessage.includes('unavailable')");
 run("providers.itinerary=savedProvider");
 await run('build()');
 check("s.days[0].stops[0].name==='Dwarka'&&s.days[0].notes==='Keep <my> note'");
 console.log(count+' itinerary checks PASS.');
})().catch(error=>{console.error(error);process.exitCode=1});
