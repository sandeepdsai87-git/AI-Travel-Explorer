const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('live-current.js','utf8');
const context=vm.createContext({setTimeout,clearTimeout,console,URL,URLSearchParams,AbortController,DOMException,
 document:{getElementById:()=>({style:{},focus(){}})},
 fetch:async()=>({ok:true,json:async()=>({schema_version:1,destinations:[
  {destination_id:'106',display_name:'Dwarka',district:'Devbhumi Dwarka',latitude:22.2424747,longitude:68.9671448}
 ]})})});
vm.runInContext(source.slice(0,source.lastIndexOf("$('back').onclick=")),context);
const run=code=>vm.runInContext(code,context);
let count=0;
function check(expression){assert.ok(run(expression),expression);count++;}
(async()=>{
 run("render=()=>{};side=()=>{};refreshDiscovery=async()=>{};loadExperiences=async()=>{};s.origin='Hyderabad';s.step=4;");
 await run("searchPublishedGujarat('Dwarka').then(result=>{globalThis.catalogue=result;chooseGeo(result.data[0])})");
 check("catalogue.provenance.kind==='catalogue'&&catalogue.provenance.checkedAt===null");
 check("sourceText(catalogue.provenance)==='Local catalogue data · Gujarat local catalogue'");
 check("sourceText({kind:'live',provider:'GeoNames',checkedAt:'2026-11-15'}).includes('Live provider result · GeoNames · Retrieved 2026-11-15')");
 check("validRecord(catalogue.data[0])&&checkedResult(catalogue)===catalogue");
 check("s.selectedDestinations[0].id==='gujarat:106'&&s.selectedDestinations[0].coordinates.latitude===22.2424747&&cities().length===1");
 check("planningReviewHTML()===''&&s.budget.reviewed===null");
 run("s.places=[{name:'Protected temple',city:cities()[0],destinationId:'gujarat:106',locked:true,selected:true}];addJourney(0,'Train');const id=s.legs[0].journeys[0].id;selectJourney(0,id)");
 await run("build()");
 run("s.costs[1]='500';reviewBudget();sync();sync()");
 check("planningReviewHTML()===''&&!s.dirty&&!s.legs[0].journeys[0].needsReview");
 run("set('end','2026-12-24')");
 check("planningReviewHTML().includes('Review selected transport')&&planningReviewHTML().includes('Refresh the itinerary')&&planningReviewHTML().includes('Review retained budget')");
 check("!planningReviewHTML().includes('Flexible-mode')&&summaryHTML().includes('Itinerary needs refresh')");
 run("reviewJourney(0,id)");
 check("!planningReviewHTML().includes('Review selected transport')&&s.dirty&&budgetEstimate().stale");
 await run("build()");
 check("!planningReviewHTML().includes('Refresh the itinerary')&&budgetEstimate().stale");
 run("s.step=5;reviewBudget();sync();go(6)");
 check("planningReviewHTML()===''&&summaryHTML().includes('Itinerary draft available')");
 run("set('people','2')");
 check("s.dirty&&budgetEstimate().stale&&s.legs[0].selectedJourneyId===id");
 await run("build()");
 run("reviewBudget();set('people',2);sync()");
 check("planningReviewHTML()===''&&s.places[0].locked&&s.places[0].selected");
 run("switch07('duration','flexible')");
 check("planningReviewHTML().includes('Flexible-mode dates are provisional')&&budgetEstimate().stale");
 run("switch07('duration','fixed');add07('New stop')");
 check("!planningReviewHTML().includes('Flexible-mode')&&s.dirty&&s.legs[0].journeys[0].needsReview");
 console.log(count+' acceptance correction checks PASS.');
})().catch(error=>{console.error(error);process.exitCode=1});
