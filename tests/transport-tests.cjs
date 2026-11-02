const fs=require('fs'),vm=require('vm'),assert=require('assert');let code=fs.readFileSync('live-current.js','utf8');code=code.slice(0,code.lastIndexOf("$('back').onclick="));const ctx=vm.createContext({setTimeout,clearTimeout,console,URL,URLSearchParams,AbortController,DOMException,document:{getElementById:()=>({textContent:'',focus(){}})}});vm.runInContext(code,ctx);const run=x=>vm.runInContext(x,ctx);run('render=()=>{};side=()=>{};refreshDiscovery=async()=>{}');let n=0;function check(x){assert(run(x),x);n++;}
run("s.origin='Hyderabad';s.route='Manali,Mata no Madh,Kyoto';sync();s.days=[{date:s.start,notes:'Keep my edit'}];s.places=[{name:'Protected',city:'Manali',locked:true,selected:true}];addJourney(0);editJourney(0,s.legs[0].journeys[0].id,'transfers','Delhi; allow buffer');editJourney(0,s.legs[0].journeys[0].id,'duration','0');selectJourney(0,s.legs[0].journeys[0].id);const firstId=s.legs[0].id");
check('s.legs.length===3');check("s.legs[0].fromId===resolveDestination('Hyderabad').id");check("s.legs[0].notes.includes('Delhi; allow buffer')");check("s.legs[0].notes.includes('0 minutes')");check("s.legs[0].notes.includes('Cost unknown')");check('s.dirty');check("s.days[0].notes==='Keep my edit'");check('s.places[0].locked&&s.places[0].selected');
run('sync()');check('s.legs[0].id===firstId&&s.legs[0].selectedJourneyId===s.legs[0].journeys[0].id');check('!s.legs[0].journeys[0].needsReview');
run("s.start='2026-12-18';sync()");check('s.legs[0].journeys[0].needsReview');check("conflicts().some(x=>x.includes('Transport review required'))");run('reviewJourney(0,s.legs[0].journeys[0].id)');check('!s.legs[0].journeys[0].needsReview');
run("addJourney(0);editJourney(0,s.legs[0].journeys[1].id,'cost','-1')");check("s.legs[0].journeys[1].cost===''");check('s.legs[0].selectedJourneyId===s.legs[0].journeys[0].id');run('removeJourney(0,s.legs[0].selectedJourneyId)');check("s.legs[0].mode==='Choose mode'&&s.legs[0].selectedJourneyId===null");
run("s.route='Kyoto,Manali';sync()");check('s.places[0].locked');check('s.legs.every(l=>l.selectedJourneyId===null)');check("s.days[0].notes==='Keep my edit'");check("transportHTML().includes('Not booked')&&transportHTML().includes('provider unavailable')");
run("s.route='Manali,Mata no Madh,Kyoto';sync();addJourney(1);selectJourney(1,s.legs[1].journeys[0].id);const retainedId=s.legs[1].selectedJourneyId;s.route='Kyoto,Manali,Mata no Madh';sync()");check('s.legs[2].selectedJourneyId===retainedId');check('s.legs[2].journeys[0].needsReview');
run("s.route='Manali,Mata no Madh,Manali,Mata no Madh';sync()");check('new Set(s.legs.map(l=>l.id)).size===s.legs.length');
// Exercise route UI handlers, not just direct route assignment.
run("s.origin='Hyderabad';s.route='';sync();add07('Ahmedabad');addJourney(0);addJourney(0);const trainId=s.legs[0].journeys[0].id,busId=s.legs[0].journeys[1].id;editJourney(0,busId,'mode','Bus');editJourney(0,busId,'duration','600');editJourney(0,busId,'cost','900');selectJourney(0,busId);s.days=[{date:s.start,notes:'Retain itinerary edit'}];s.places=[{name:'Protected Ahmedabad stop',city:'Ahmedabad',selected:true,locked:true}];go(4);go(3)");
check('s.legs[0].journeys.length===2&&s.legs[0].selectedJourneyId===busId');
run("go(0);add07('Dwarka');go(3)");
check('s.legs[0].journeys.length===2&&s.legs[0].selectedJourneyId===busId');
check("s.legs[0].journeys[0].duration===''&&s.legs[0].journeys[0].cost===''");
check("s.legs[0].journeys[1].duration==='600'&&s.legs[0].journeys[1].cost==='900'");
check('s.legs[1].journeys.length===0&&s.legs[1].selectedJourneyId===null');
run('remove07(1);go(3)');check('s.legs.length===1&&s.legs[0].selectedJourneyId===busId&&s.legs[0].journeys.length===2');
// A temporarily absent leg must not be irreversibly discarded between input events.
run("set('route','');set('route','Ahmedabad, Dwarka')");
check('s.legs[0].selectedJourneyId===busId&&s.legs[0].journeys.length===2');
check('s.legs[0].journeys.every(j=>j.needsReview)');
check("conflicts().some(x=>x.includes('Transport review required'))");
run('move07(1,-1)');check('s.legs.every(l=>l.selectedJourneyId!==busId)');
run('move07(0,1)');check('s.legs[0].selectedJourneyId===busId&&s.legs[0].journeys.length===2');
run("set('origin','Delhi')");check('s.legs[0].journeys.length===0&&s.legs[0].selectedJourneyId===null');
run("set('origin','Hyderabad');reviewJourney(0,busId);editJourney(0,busId,'cost','950');remove07(1);add07('Dwarka')");
check("s.legs[0].journeys.find(j=>j.id===busId).cost==='950'");
check('s.places[0].locked&&s.places[0].selected');check("s.days[0].notes==='Retain itinerary edit'&&s.dirty");
run("removeJourney(0,trainId);set('route','');set('route','Ahmedabad')");
check('s.legs[0].journeys.length===1&&s.legs[0].journeys[0].id===busId');
run("removeJourney(0,busId);set('route','');set('route','Ahmedabad')");
check('s.legs[0].journeys.length===0&&s.legs[0].selectedJourneyId===null');
run("addJourney(0);selectJourney(0,s.legs[0].journeys[0].id);set('route','Ahmedabad,Dwarka,Ahmedabad,Dwarka')");
check('s.legs[1].journeys!==s.legs[3].journeys');
run('addJourney(1)');check('s.legs[1].journeys.length===1&&s.legs[3].journeys.length===0');
run("set('route','Dwarka')");check('s.legs.length===1&&s.legs[0].selectedJourneyId===null');
console.log(n+' transport state checks PASS (manual/unavailable; no live claims).');
