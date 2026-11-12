const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('live-current.js','utf8');
const start=source.indexOf('let gujaratCataloguePromise=null;');
const end=source.indexOf("\nlet geoMode='gujarat'",start);
assert(start>=0&&end>start,'Gujarat search implementation missing');
const sample=[
 {destination_id:'106',display_name:'Dwarka',district:'Devbhumi Dwarka',latitude:22.2442,longitude:68.9685,search_names:['Dwarka']},
 {destination_id:'107',display_name:'Missing',district:'Test',latitude:null,longitude:null,search_names:['Missing']},
 {destination_id:'108',display_name:'Partial',district:'Test',latitude:23,longitude:null,search_names:['Partial']},
 {destination_id:'109',display_name:'Empty',district:'Test',latitude:'',longitude:'',search_names:['Empty']},
 {destination_id:'110',display_name:'Zero',district:'Test',latitude:0,longitude:0,search_names:['Zero']}
];
let fetchCount=0;
const context=vm.createContext({fetch:async()=>{fetchCount++;return {ok:true,json:async()=>({schema_version:1,destinations:sample})}},Date,Number,String,DOMException});
vm.runInContext(source.slice(start,end),context);
const search=q=>vm.runInContext('searchPublishedGujarat('+JSON.stringify(q)+')',context);
(async()=>{
 const result=await search('Dwarka');
 assert.equal(result.data.length,1);
 const item=result.data[0];
 assert.equal(item.id,'gujarat:106');
 assert.equal(item.name,'Dwarka · Devbhumi Dwarka · Gujarat · India');
 assert.equal(item.name.includes(','),false,'Route delimiter must not occur in a destination name');
 assert.equal(item.coordinates.latitude,22.2442);
 assert.equal(item.coordinates.longitude,68.9685);
 for(const name of ['Missing','Partial','Empty']){
  const match=(await search(name)).data.find(x=>x.canonicalName===name);
  assert(match,'Expected '+name);
  assert.equal(match.coordinates,null,name+' must not acquire (0,0) coordinates');
 }
 const zero=(await search('Zero')).data[0];
 assert.equal(zero.coordinates.latitude,0,'Genuine zero latitude remains valid');
 assert.equal(zero.coordinates.longitude,0,'Genuine zero longitude remains valid');
 assert.equal(fetchCount,1,'Catalogue should load once');
 console.log('Gujarat destination regression assertions PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
