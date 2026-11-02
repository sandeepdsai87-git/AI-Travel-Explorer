const fs=require('fs'),vm=require('vm'),assert=require('assert');
let code=fs.readFileSync('geo-current.js','utf8');code=code.slice(0,code.lastIndexOf("$('back').onclick="));
const ctx=vm.createContext({setTimeout,clearTimeout,console,URL,URLSearchParams,AbortController,DOMException,document:{getElementById:()=>({textContent:''})}});vm.runInContext(code,ctx);vm.runInContext('render=()=>{};side=()=>{};',ctx);const run=x=>vm.runInContext(x,ctx);let n=0;
(async()=>{
for(const q of ['Bengaluru','Bhopal','Bikaner','Ahmedabad','Mata no Madh','London','Tokyo']){await assert.rejects(run(`geoAdapter.search(${JSON.stringify(q)})`),/PENDING/);n++;}
await assert.rejects(run("createGeoNamesProvider({username:'demo'}).search('London')"),/not permitted/);n++;
run(`let calls=[],time=100000;const mock=createGeoNamesProvider({username:'local-contract-test',clock:()=>time,fetcher:async(u,o)=>{calls.push([u,o]);return {ok:true,json:async()=>({geonames:[{geonameId:123,name:'Contract test town',adminName1:'Region',countryName:'Country',countryCode:'ZZ',lat:'12.3',lng:'45.6'},{geonameId:123,name:'Duplicate'}]})}}});`);
const result=await run("mock.search('Bengaluru')");assert.equal(result.data.length,1);n++;assert.equal(result.data[0].id,'geonames:123');n++;assert.equal(result.data[0].coordinates.latitude,12.3);n++;
assert(run("new URL(calls[0][0]).searchParams.get('countryBias')==='IN'&&!new URL(calls[0][0]).searchParams.has('country')"));n++;
assert(run("new URL(calls[0][0]).protocol==='https:'&&!new URL(calls[0][0]).searchParams.has('cities')"));n++;
await run("mock.search('Bengaluru')");assert(run('calls.length===1'));n++;
await run("mock.search('Tokyo')");assert(run('calls.length===2'));n++;
await assert.rejects(run("createGeoNamesProvider({username:'test',fetcher:async()=>({ok:true,json:async()=>({status:{value:10,message:'Authorization failed'}})})}).search('Tokyo')"),/Authorization/);n++;
await assert.rejects(run("createGeoNamesProvider({username:'test',fetcher:async()=>({ok:true,json:async()=>({unexpected:true})})}).search('Tokyo')"),/Invalid/);n++;
const empty=await run("createGeoNamesProvider({username:'test',fetcher:async()=>({ok:true,json:async()=>({geonames:[]})})}).search('Tokyo')");assert.equal(empty.data.length,0);n++;
await assert.rejects(run("(()=>{const c=new AbortController();c.abort();return mock.search('Tokyo',{signal:c.signal})})()"),{name:'AbortError'});n++;
run("s.origin='Hyderabad';geoAliases.set('contract test town · region · country','geonames:123');records.set('geonames:123',{id:'geonames:123',name:'Contract test town · Region · Country',coordinates:{latitude:12.3,longitude:45.6},relatedIds:[],provenance:{kind:'live',provider:'Mock contract test only'}});s.route='Contract test town · Region · Country';sync()");assert(run("s.trip.stopIds[0]==='geonames:123'"));n++;
console.log(n+' adapter checks PASS: 7 credential-blocked query checks plus mocked contract tests; ZERO live geographic results claimed.');
})().catch(e=>{console.error(e);process.exitCode=1});
