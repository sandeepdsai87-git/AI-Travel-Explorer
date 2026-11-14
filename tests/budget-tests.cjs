const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('live-current.js','utf8');
const context = vm.createContext({setTimeout,clearTimeout,console,URL,URLSearchParams,AbortController,DOMException,
 document:{getElementById:()=>({textContent:'',focus(){}})}});
vm.runInContext(source.slice(0,source.lastIndexOf("$('back').onclick=")),context);
const run = script => vm.runInContext(script,context);
let count = 0;
function check(expression) {
 assert.ok(run(expression),expression);
 count++;
}
(async () => {
 run("render=()=>{};side=()=>{};refreshDiscovery=async()=>{};total=()=>{}");
 run("s.origin='Hyderabad';s.route='Ahmedabad,Dwarka';s.start='2026-12-17';s.end='2026-12-19';s.people=3;sync();");
 check("budgetEstimate().total===null&&budgetEstimate().known===null");
 check("budgetEstimate().days===3&&budgetEstimate().nights===2&&budgetEstimate().people===3");
 check("[null,undefined,'',' ','-1','12.345','1e3',false,Infinity].every(v=>budgetCents(v)===null)");
 check("budgetCents(0)===0&&budgetCents('.05')===5&&budgetCents('1.09')===109");
 check("budgetCount('1.5')===null&&budgetCount('2')===2");
 run("addJourney(0,'Train');const train=s.legs[0].journeys[0].id;editJourney(0,train,'cost','3000');selectJourney(0,train);addJourney(0,'Bus');const bus=s.legs[0].journeys[1].id;editJourney(0,bus,'cost','2000');");
 check("budgetEstimate().amounts[0]===null&&budgetEstimate().known===300000");
 run("s.budget.limit='2500'");
 check("budgetComparison(budgetEstimate()).includes('Known costs alone')&&budgetEstimate().perPerson===null");
 run("addJourney(1,'Road');const road=s.legs[1].journeys[0].id;editJourney(1,road,'cost','0');selectJourney(1,road);");
 check("budgetEstimate().amounts[0]===300000&&budgetEstimate().knownLegs===2");
 run("Object.assign(s.budget,{rooms:'2',nightly:'1000',foodDaily:'200',limit:'9000'});s.costs[3]='500';s.costs[4]='0';reviewBudget();");
 check("budgetEstimate().amounts.join() === '300000,400000,180000,50000,0'");
 check("budgetEstimate().total===930000&&budgetEstimate().perPerson===310000&&budgetEstimate().perDay===310000");
 check("budgetComparison(budgetEstimate()).includes('₹300 over budget')");
 run("s.budget.limit='10000'");
 check("budgetComparison(budgetEstimate()).includes('₹700 remaining')");
 run("s.costs[0]='0';s.costs[1]='2500';s.costs[2]='1000';");
 check("budgetEstimate().amounts.slice(0,3).join()==='0,250000,100000'");
 run("s.costs[0]='';s.costs[1]='';s.costs[2]='';selectJourney(0,bus);");
 check("budgetEstimate().amounts[0]===200000&&budgetEstimate().stale");
 run("reviewBudget();set('people',4);");
 check("budgetEstimate().amounts[2]===240000&&budgetEstimate().stale&&s.budget.foodDaily==='200'");
 run("set('end','2026-12-20')");
 check("budgetEstimate().nights===3&&budgetEstimate().amounts[1]===600000&&budgetEstimate().amounts[2]===320000&&budgetEstimate().transportReview");
 run("s.budget.nights='1'");
 check("budgetEstimate().amounts[1]===200000");
 run("s.places=[{id:'protected',name:'Temple',city:'Dwarka',selected:true,locked:true}];s.step=4;");
 await run('build()');
 run("s.days[0].notes='Keep this note';reviewBudget()");
 for (const step of [3,4,5,6,5]) {
  run('go('+step+')');
  check('s.step==='+step+'&&s.costs[3]==="500"&&s.budget.nights==="1"&&s.days[0].notes==="Keep this note"&&s.places[0].locked&&s.legs[0].selectedJourneyId===bus');
 }
 run("set('route','Ahmedabad,Dwarka,New stop')");
 check("budgetEstimate().stale&&budgetEstimate().amounts[0]===null&&budgetEstimate().transportKnown===200000");
 check("budgetHTML().includes('Miscellaneous')&&budgetHTML().includes('Whole-trip budget limit')&&budgetText().includes('total unknown')");
 run("const input={value:'-10',dataset:{budget:'3'},validity:{badInput:false},setCustomValidity(v){this.validationMessage=v},setAttribute(k,v){this[k]=v}};editBudget(input)");
 check("s.costs[3]==='500'&&input['aria-invalid']==='true'");
 run("input.value='0';editBudget(input)");
 check("s.costs[3]==='0'&&input['aria-invalid']==='false'");
 run("input.value='';editBudget(input)");
 check("budgetEstimate().amounts[3]===null");
 console.log(count+' budget checks PASS.');
})().catch(error=>{console.error(error);process.exitCode=1});
