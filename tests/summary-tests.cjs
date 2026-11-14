const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('live-current.js','utf8');
const context = vm.createContext({setTimeout,clearTimeout,console,URL,URLSearchParams,AbortController,DOMException,
 document:{getElementById:()=>({textContent:'',style:{},focus(){}})}});
vm.runInContext(source.slice(0,source.lastIndexOf("$('back').onclick=")),context);
const run = code => vm.runInContext(code,context);
let count = 0;
function check(expression) {
 assert.ok(run(expression),expression);
 count++;
}
(async () => {
 run("render=()=>{};side=()=>{};refreshDiscovery=async()=>{};loadExperiences=async()=>{}");
 check("summaryHTML().includes('Choose destinations')&&summaryHTML().includes('No draft generated')&&summaryHTML().includes('Budget estimate incomplete')");
 run("s.origin='Hyderabad';s.route='Ahmedabad,Dwarka';s.start='2026-12-17';s.end='2026-12-19';s.people=3;s.pace='Relaxed';sync();setPriority07(1,'must')");
 check("summaryHTML().includes('2026-12-17 to 2026-12-19 · 3 days · 3 traveler(s) · Relaxed pace')");
 check("summaryHTML().indexOf('Ahmedabad · Optional')<summaryHTML().indexOf('Dwarka · Must visit')&&summaryHTML().includes('Coordinates 23.02579')&&summaryHTML().includes('Coordinates unavailable')");
 check("summaryHTML().includes('0 of 2 transport alternatives selected')&&summaryHTML().includes('Cost and duration unknown')");
 run("s.places=[{name:'Temple <visit>',city:'Dwarka',locked:true,selected:true},{name:'Old stop',city:'Elsewhere',locked:true,orphaned:true},{name:'Skip me',city:'Dwarka',selected:false}]");
 check("summaryHTML().includes('Temple &lt;visit&gt; · Dwarka · Protected')&&summaryHTML().includes('Old stop · Elsewhere · Protected · Outside current route')&&!summaryHTML().includes('Skip me')");
 run("addJourney(0,'Train');const train=s.legs[0].journeys[0].id;editJourney(0,train,'cost','900');editJourney(0,train,'duration','0');editJourney(0,train,'transfers','At terminal');selectJourney(0,train);addJourney(0,'Bus')");
 check("summaryHTML().includes('Train · Not booked · Traveler cost estimate ₹900 · Traveler duration estimate 0 min · Transfers: At terminal')&&!summaryHTML().includes('Bus · Not booked')");
 check("summaryHTML().includes('₹900 known costs · total unknown')&&summaryHTML().includes('Accommodation amounts are estimates. Booking status is unconfirmed.')");
 await run('build()');
 run("s.days[0].schedule='09:00';s.days[0].activities='Market';s.days[0].notes='Keep <note>';");
 check("summaryHTML().includes('Traveler schedule: 09:00')&&summaryHTML().includes('Traveler activities: Market')&&summaryHTML().includes('Notes: Keep &lt;note&gt;')&&summaryHTML().includes('Protected experience: Temple &lt;visit&gt;')");
 run("s.costs=['900','2000','600','0','100'];s.budget.limit='3500';reviewBudget()");
 check("summaryHTML().includes('₹3,600 estimated total')&&summaryHTML().includes('<dt>Per traveler</dt><dd>₹1,200</dd>')&&summaryHTML().includes('₹100 over budget')");
 run("set('people',4);set('start','2026-12-18')");
 check("summaryHTML().includes('2 days · 4 traveler(s)')&&summaryHTML().includes('<dt>Per traveler</dt><dd>₹900</dd>')&&summaryHTML().includes('Budget estimates need review')");
 check("summaryHTML().includes('Itinerary needs refresh')&&summaryHTML().includes('Outside current trip dates')&&summaryHTML().includes('Keep &lt;note&gt;')&&!summaryHTML().includes('Protected experience: Temple &lt;visit&gt;')");
 run("set('route','Ahmedabad,New stop')");
 check("summaryHTML().includes('New stop · Optional')&&!summaryHTML().includes('Dwarka · Must visit')&&summaryHTML().includes('Temple &lt;visit&gt; · Dwarka · Protected · Outside current route')");
 run("const bus=s.legs[0].journeys[1].id;selectJourney(0,bus);s.costs[0]=''");
 check("summaryHTML().includes('Bus · Not booked')&&!summaryHTML().includes('Train · Not booked')&&summaryHTML().includes('Some estimates are missing')&&summaryHTML().includes('Review required for current trip')");
 for (const step of [0,1,2,3,4,5]) check("summaryHTML().includes('onclick=\"go("+step+")\"')");
 for (const step of [6,3,4,5,6]) {
  run('go('+step+')');
  check('s.step==='+step+'&&s.days[0].notes==="Keep <note>"&&s.legs[0].selectedJourneyId===bus&&s.costs[1]==="2000"');
 }
 console.log(count+' summary checks PASS.');
})().catch(error=>{console.error(error);process.exitCode=1});
