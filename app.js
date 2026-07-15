const pages=[["dashboard","Dashboard"],["readings","Readings"],["maintenance","Maintenance"],["livestock","Livestock"],["equipment","Equipment"],["testers","Testers"]];

function svgData(kind,title,accent="#52d2c7"){
 const safe=String(title).replace(/[&<>"']/g,"");
 let motif="";
 if(kind==="fish") motif=`<ellipse cx="185" cy="110" rx="78" ry="40" fill="${accent}"/><polygon points="105,110 45,70 45,150" fill="${accent}"/><circle cx="220" cy="100" r="6" fill="#08161e"/><path d="M155 110 Q185 135 220 118" stroke="#08161e" stroke-width="6" fill="none"/>`;
 else if(kind==="coral") motif=`<path d="M130 170 C120 120 150 110 145 70 M170 170 C165 115 195 105 190 55 M210 170 C205 125 230 115 230 78" stroke="${accent}" stroke-width="18" stroke-linecap="round"/><circle cx="145" cy="62" r="22" fill="${accent}"/><circle cx="190" cy="47" r="24" fill="${accent}"/><circle cx="230" cy="72" r="20" fill="${accent}"/>`;
 else if(kind==="shrimp") motif=`<path d="M80 125 Q165 55 245 125 Q180 170 95 150" fill="none" stroke="${accent}" stroke-width="14"/><path d="M235 120 L285 80 M230 130 L290 150 M115 145 L75 180 M145 155 L125 195" stroke="${accent}" stroke-width="7"/><circle cx="225" cy="105" r="6" fill="#08161e"/>`;
 else if(kind==="shell") motif=`<path d="M90 165 C55 120 85 55 160 50 C250 45 285 110 245 170 C210 220 115 210 90 165Z" fill="${accent}"/><path d="M125 155 C105 120 125 85 165 85 C210 85 230 120 205 150 C185 175 145 175 125 155Z" fill="#0b2530"/>`;
 else if(kind==="tester") motif=`<rect x="95" y="45" width="150" height="155" rx="26" fill="${accent}"/><rect x="125" y="75" width="90" height="48" rx="8" fill="#0b2530"/><circle cx="170" cy="155" r="20" fill="#0b2530"/><rect x="150" y="200" width="40" height="35" rx="8" fill="${accent}"/>`;
 else motif=`<rect x="75" y="65" width="210" height="125" rx="24" fill="${accent}"/><circle cx="130" cy="127" r="34" fill="#0b2530"/><circle cx="230" cy="127" r="24" fill="#0b2530"/><rect x="150" y="40" width="60" height="30" rx="8" fill="${accent}"/>`;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#0b2530"/><stop offset="1" stop-color="#123b49"/></linearGradient></defs><rect width="360" height="220" rx="28" fill="url(#g)"/>${motif}<text x="180" y="208" fill="#dff8fb" font-family="Arial" font-size="15" text-anchor="middle">${safe}</text></svg>`;
 return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
}

const targets={
 alk:{label:"Alkalinity",unit:"dKH",min:7,max:9,key:"alk",weight:16,testDays:3},
 ca:{label:"Calcium",unit:"ppm",min:400,max:460,key:"ca",weight:9,testDays:14},
 mg:{label:"Magnesium",unit:"ppm",min:1280,max:1420,key:"mg",weight:7,testDays:30},
 no3:{label:"Nitrate",unit:"ppm",min:5,max:15,key:"no3",weight:10,testDays:7},
 po4:{label:"Phosphate",unit:"ppm",min:.03,max:.10,key:"po4",weight:10,testDays:7},
 ph:{label:"pH",unit:"",min:7.9,max:8.4,key:"ph",weight:12,testDays:7},
 sal:{label:"Salinity",unit:"ppt",min:34,max:36,key:"sal",weight:18,testDays:7},
 temp:{label:"Temperature",unit:"°F",min:76,max:79,key:"temp",weight:18,testDays:7}
};
const maintenanceTemplates={
  daily:[
    {title:"Daily reef check",details:"Confirm fish are present and eating, inspect coral tissue, verify temperature, flow, ATO, skimmer operation, and check for leaks.",type:"Daily check",cadence:"daily"}
  ],
  weekly:[
    {weekday:6,title:"Mechanical filtration and skimmer",details:"Replace or rinse filter floss and clean the skimmer cup/neck if buildup is present.",type:"Filtration"},
    {weekday:6,title:"Glass, rockwork, and detritus check",details:"Clean viewing panels as needed, baste rockwork, and inspect for algae, vermetids, or damaged tissue.",type:"Maintenance"},
    {weekday:5,title:"ATO and dosing inspection",details:"Check the RODI reservoir, sensors, tubing, siphon risk, and dosing output.",type:"Equipment"}
  ],
  monthly:[
    {day:22,title:"Heater, probes, and safety inspection",details:"Verify temperature with a second device, inspect cords and mounts, clean sensors, and test alarms/shutoffs.",type:"Safety"},
    {day:28,title:"Dosing-pump calibration",details:"Measure actual output with a graduated cylinder and inspect tubing, check valves, and reservoir condition.",type:"Dosing"}
  ]
};
let maintenanceWindowDays=7;
function localISODate(d){
 const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");
 return `${y}-${m}-${day}`;
}
function dateAtNoon(date){return new Date(date.getFullYear(),date.getMonth(),date.getDate(),12,0,0,0)}
function latestParameterValue(key){
 const history=state.readings.filter(r=>hasReadingValue(r[key])&&readingDate(r)).sort((a,b)=>readingDate(b)-readingDate(a));
 return history.length?Number(history[0][key]):null;
}
function waterChangeRecommendation(){
 const history=[...(state.waterChanges||[])].filter(w=>w&&w.date&&Number(w.gallons)>0).sort((a,b)=>new Date(b.date+"T12:00:00")-new Date(a.date+"T12:00:00"));
 const last=history[0]||null;
 const systemGallons=65;
 let gallons=15,interval=14,reason="A 15-gallon change is about 23% of the estimated 65-gallon system and is a conservative routine starting point.";
 if(last){
  const previous=Number(last.gallons);
  if(previous>=25){gallons=15;interval=21;reason=`Your last change was ${previous} gallons, so the next routine change can usually be smaller and spaced about three weeks apart if nutrients remain stable.`}
  else if(previous>=15){gallons=Math.round(previous);interval=14;reason=`Your previous ${previous}-gallon change is a reasonable routine size; the planner keeps a two-week interval.`}
  else if(previous>=10){gallons=15;interval=10;reason=`Your previous change was ${previous} gallons, so the planner recommends a slightly larger change or a shorter interval.`}
  else {gallons=15;interval=7;reason=`Your previous change was only ${previous} gallons, so the next change is scheduled sooner.`}
 }
 const no3=latestParameterValue("no3"),po4=latestParameterValue("po4");
 if((no3!==null&&no3>15)||(po4!==null&&po4>.10)){
  gallons=Math.max(gallons,20);interval=Math.min(interval,7);reason="Nitrate or phosphate is above the dashboard target, so the planner suggests a moderately larger change sooner. Confirm the result before reacting.";
 }else if((no3!==null&&no3<3)&&(po4!==null&&po4<.02)){
  gallons=Math.min(gallons,10);interval=Math.max(interval,21);reason="Both nutrients are very low, so the planner avoids an aggressive water change unless another issue requires one.";
 }
 const today=dateAtNoon(new Date());
 const base=last?new Date(last.date+"T12:00:00"):today;
 const due=new Date(base);due.setDate(base.getDate()+interval);
 if(!last){due.setTime(today.getTime());due.setDate(today.getDate()+7)}
 if(due<today)due.setTime(today.getTime());
 return {last,gallons,interval,due,date:localISODate(due),reason,percent:Math.round(gallons/systemGallons*100)};
}
function addDaysISO(iso,days){const d=new Date(iso+"T12:00:00");d.setDate(d.getDate()+days);return localISODate(d)}
function latestReadingText(key){
 const h=parameterHistory(key);
 if(!h.length)return "Last reading: None yet";
 const r=h[h.length-1],t=targets[key];
 return `Last reading: ${Number(r[key]).toFixed(key==="po4"?3:(key==="ca"||key==="mg"?0:1))} ${t?.unit||""} on ${readingDate(r).toLocaleDateString([], {month:"short",day:"numeric"})}`;
}
function dynamicTestingTasks(dateKey){
 const today=localISODate(new Date()),out=[];
 const plan=[
  {key:"alk",offset:0,title:"Alkalinity test",details:"Establish the real alkalinity baseline before changing All-For-Reef."},
  {key:"sal",offset:0,title:"Salinity and pH test",details:"Confirm salinity after the 30-gallon water change and establish a real pH baseline.",extra:"ph"},
  {key:"no3",offset:1,title:"Nitrate and phosphate test",details:"Establish the real nutrient baseline before deciding whether reactor media needs adjustment.",extra:"po4"},
  {key:"ca",offset:2,title:"Calcium and magnesium test",details:"Establish the real major-elements baseline after the water change and new media.",extra:"mg"}
 ];
 for(const p of plan){
  const history=parameterHistory(p.key);
  let due;
  if(!history.length)due=addDaysISO(today,p.offset);
  else {const last=readingDate(history[history.length-1]);due=addDaysISO(localISODate(last),targets[p.key].testDays)}
  if(dateKey===due){
   const extraText=p.extra?` • ${latestReadingText(p.extra)}`:"";
   out.push({title:p.title,details:`${p.details} ${latestReadingText(p.key)}${extraText}`,type:"Testing"});
  }
 }
 return out;
}
function serviceDueTasks(dateKey){
 const out=[],h=state.serviceHistory||{};
 const add=(field,days,title,details,type)=>{if(h[field]&&dateKey===addDaysISO(h[field],days))out.push({title,details:`${details} Last completed: ${waterChangeDateLabel(h[field])}.`,type})};
 add("equipmentCleaned",30,"Equipment cleaning review","Inspect pumps, skimmer, filters, and ATO. Clean only equipment that actually has buildup.","Equipment");
 add("reactorMediaReplaced",30,"Reactor media review","Check carbon age and reactor flow. Test phosphate before deciding whether GFO needs replacement.","Filtration");
 add("bioMediaReplaced",90,"Biological media inspection","Do not routinely replace established bio media. Inspect for clogging and gently rinse only in removed aquarium water if necessary.","Filtration");
 return out;
}
function generatedMaintenanceTasks(days=30){
 const start=dateAtNoon(new Date()),tasks=[];
 const water=waterChangeRecommendation();
 for(let offset=0;offset<days;offset++){
  const date=new Date(start);date.setDate(start.getDate()+offset);
  const dateKey=localISODate(date);
  const templates=[];
  templates.push(...maintenanceTemplates.daily);
  templates.push(...maintenanceTemplates.weekly.filter(t=>t.weekday===date.getDay()));
  templates.push(...maintenanceTemplates.monthly.filter(t=>t.day===date.getDate()));
  templates.push(...dynamicTestingTasks(dateKey));
  templates.push(...serviceDueTasks(dateKey));
  if(dateKey===water.date){templates.push({title:`Recommended ${water.gallons}-gallon water change`,details:`About ${water.percent}% of system volume. Match temperature and salinity, siphon detritus, and log the actual amount afterward.`,type:"Water change"})}
  templates.forEach((template,index)=>{
   const id=`${dateKey}|${template.title}|${index}`;
   tasks.push({...template,id,date:dateKey,dateObj:new Date(date),done:Boolean(state.taskCompletions[id])});
  });
 }
 return tasks;
}
const livestock=[
{group:"Fish",name:"Biota Hawaiian yellow tang",scientific:"Zebrasoma flavescens",kind:"fish",accent:"#f2d447",summary:"Captive-bred Hawaiian yellow tang from Biota, added as a juvenile and showing clear growth.",facts:{Count:"1",Status:"Active",PurchaseDate:"May 20, 2026",PurchaseSize:"About 1.5 in",CurrentSize:"About 2–2.25 in",Growth:"About 0.5–0.75 in",Temperament:"Semi-aggressive",Diet:"Herbivore / omnivore",AdultSize:"7–8 in"},behavior:"Spends much of the day grazing rockwork and swimming throughout the display. Watch interactions with the Tomini tang as both mature.",food:"Offer nori or other marine algae regularly, plus spirulina-based pellets and varied frozen foods.",care:["Captive-bred by Biota","Provide algae daily","Track body condition and continued growth","Watch for chasing between tangs","Monitor for ich and HLLE"]},
{group:"Fish",name:"Darwin ocellaris clownfish",scientific:"Amphiprion ocellaris",kind:"fish",accent:"#8f98a3",summary:"The larger clownfish in the pair and likely female.",facts:{Count:"1",Status:"Active",PurchaseDate:"Existing livestock",PurchaseSize:"Not recorded",CurrentSize:"About 2–2.25 in",Temperament:"Semi-aggressive",Diet:"Omnivore",AdultSize:"3–4 in",Zone:"Chosen territory"},behavior:"May maintain distance from the smaller Snowflake clown while the pair establishes its hierarchy.",food:"Quality marine pellets, mysis, finely chopped seafood, and occasional enriched frozen foods.",care:["Reef-safe with corals","Watch for excessive aggression toward the smaller clown","Pairs may establish a host area or spawning site","Keep temperature and salinity stable"]},
{group:"Fish",name:"Snowflake ocellaris clownfish",scientific:"Amphiprion ocellaris",kind:"fish",accent:"#f4f4f4",summary:"The smaller designer-pattern clownfish in the established pair.",facts:{Count:"1",Status:"Active",PurchaseDate:"Existing livestock",PurchaseSize:"Not recorded",CurrentSize:"About 1.25–1.5 in",Temperament:"Semi-aggressive",Diet:"Omnivore",AdultSize:"3–4 in",Zone:"Near mate / territory"},behavior:"Usually remains near the Darwin clown and may display submissive twitching toward the larger fish.",food:"Pellets, flakes, mysis, brine shrimp, and finely chopped marine foods.",care:["Reef-safe","Monitor that it receives enough food","Some size difference from the female is normal","Watch for persistent hiding or injury"]},
{group:"Fish",name:"Blue-green chromis",scientific:"Chromis viridis",kind:"fish",accent:"#58c7d8",summary:"The remaining chromis, currently kept as a single open-water fish.",facts:{Count:"1",Status:"Active",PurchaseDate:"Existing livestock",PurchaseSize:"Not recorded",CurrentSize:"About 2.25 in",Temperament:"Generally peaceful",Diet:"Planktivore / omnivore",AdultSize:"3–4 in",Zone:"Open water"},behavior:"Typically swims in open water and should be watched for changes in appetite, buoyancy, or isolation.",food:"Small pellets, flakes, mysis, calanus, and other small frozen foods.",care:["Feed manageable small portions","Maintain strong oxygenation","Track appetite and swimming behavior","Log white stringy feces or sinking behavior promptly"]},
{group:"Fish",name:"Purple firefish ×2",scientific:"Nemateleotris decora",kind:"fish",accent:"#9b7de2",summary:"A pair of purple firefish added together on June 2.",facts:{Count:"2",Status:"Active",PurchaseDate:"June 2, 2026",PurchaseSize:"About 2 in each",CurrentSize:"About 2 in each",Temperament:"Peaceful",Diet:"Planktivore / carnivore",AdultSize:"3–4 in",Zone:"Lower open water / caves"},behavior:"May hover together near shelter and retreat quickly when startled.",food:"Small pellets, mysis, brine shrimp, calanus, and finely chopped frozen foods.",care:["Keep a secure lid","Provide multiple caves and bolt-holes","Watch for competition with the Helfrichi firefish","Confirm both appear at feeding time"]},
{group:"Fish",name:"Helfrichi firefish ×2",scientific:"Nemateleotris helfrichi",kind:"fish",accent:"#d98bd7",summary:"A pair of Helfrichi firefish purchased with the purple firefish on June 2.",facts:{Count:"2",Status:"Active",PurchaseDate:"June 2, 2026",PurchaseSize:"About 2 in each",CurrentSize:"About 2 in each",Temperament:"Peaceful",Diet:"Planktivore / carnivore",AdultSize:"About 2.5–3 in",Zone:"Lower open water / caves"},behavior:"Can be shy and may spend considerable time near a shared cave, especially after disturbances.",food:"Small frequent offerings of mysis, calanus, copepod-sized foods, and fine pellets.",care:["A tight-fitting lid is essential","Provide quiet shelter","Make sure shy fish receive food","Monitor aggression among firefish as they mature"]},
{group:"Fish",name:"Tomini tang",scientific:"Ctenochaetus tominiensis",kind:"fish",accent:"#c68a54",summary:"A juvenile bristletooth tang added on June 9.",facts:{Count:"1",Status:"Active",PurchaseDate:"June 9, 2026",PurchaseSize:"About 2 in",CurrentSize:"About 2 in",Temperament:"Semi-aggressive",Diet:"Herbivore / detritivore",AdultSize:"About 6 in",Zone:"Rockwork / open swimming"},behavior:"Continuously picks at rock and glass films. Interactions with the yellow tang should be monitored as both fish grow.",food:"Natural algae films, nori, spirulina foods, quality pellets, and supplemental frozen fare.",care:["Provide swimming room and mature rockwork","Offer algae regularly","Watch tang-to-tang aggression","Track weight and belly fullness"]},
{group:"Invertebrate",name:"Skunk cleaner shrimp",scientific:"Lysmata amboinensis",kind:"shrimp",accent:"#f8f1e4",summary:"Visible cleaner and scavenger that may establish a cleaning station.",facts:{Count:"1",Status:"Active",PurchaseDate:"Existing livestock",CurrentSize:"Not recorded",Temperament:"Peaceful",Diet:"Omnivore",AdultSize:"2–3 in",Zone:"Caves / ledges"},behavior:"Waves its antennae to attract fish and may steal food from corals.",food:"Small pieces of marine meat, pellets, mysis, and scavenged leftovers.",care:["Maintain stable salinity","Provide hiding places for molts","Avoid copper-based medications","Ensure it receives some direct food"]},
{group:"Invertebrate",name:"Tiger pistol shrimp (snapping shrimp)",scientific:"Alpheus bellulus",kind:"shrimp",accent:"#f1a55b",summary:"Burrowing snapping shrimp that moves sand and rubble beneath the rockwork.",facts:{Count:"1",Status:"Active",PurchaseDate:"Existing livestock",CurrentSize:"Not recorded",Temperament:"Territorial burrower",Diet:"Omnivore",AdultSize:"2–3 in",Zone:"Sand / rock base"},behavior:"Excavates tunnels and produces a loud, normal snapping sound.",food:"Sinking pellets, small meaty foods, leftovers, and natural detritus.",care:["Keep rockwork secure","Expect ongoing sand movement","Provide small rubble for burrow building","Check that excavations do not undermine coral placement"]},
{group:"Invertebrate",name:"Electric blue hermit crab",scientific:"Calcinus elegans",kind:"shell",accent:"#478de8",summary:"Colorful algae- and detritus-grazing hermit crab.",facts:{Count:"1",Status:"Active",PurchaseDate:"Existing livestock",CurrentSize:"Not recorded",Temperament:"Semi-aggressive scavenger",Diet:"Omnivore",AdultSize:"About 2 in",Zone:"Rock and sand"},behavior:"Roams the tank grazing and investigating shells and food scraps.",food:"Algae, detritus, leftover foods, and occasional sinking algae foods.",care:["Provide spare shells","Watch for aggression toward snails","Supplement food if the tank is very clean","Keep salinity stable"]},
{group:"Invertebrate",name:"Zebra hermit crab",scientific:"Calcinus laevimanus",kind:"shell",accent:"#d9d9d2",summary:"Small striped-leg hermit that grazes algae and scavenges detritus.",facts:{Count:"1",Status:"Active",PurchaseDate:"Existing livestock",CurrentSize:"Not recorded",Temperament:"Generally peaceful",Diet:"Omnivore",AdultSize:"About 1 in",Zone:"Rock and sand"},behavior:"Actively explores rockwork and sand for edible films and debris.",food:"Natural algae, detritus, leftover food, and small algae wafers if needed.",care:["Offer appropriately sized spare shells","Watch interactions with snails","Avoid starvation in an ultra-clean tank","Stable salinity supports molting"]},
{group:"Invertebrate",name:"Dwarf yellow tip hermit crab",scientific:"Clibanarius sp.",kind:"shell",accent:"#e4c64d",summary:"The dark blue-black dwarf hermit with pale speckling and yellow-gold tips shown in your LiveAquaria reference photo.",facts:{Count:"1",Status:"Active",PurchaseDate:"Existing livestock",CurrentSize:"Not recorded",Temperament:"Generally peaceful scavenger",Diet:"Omnivore",AdultSize:"Small / dwarf",Zone:"Rock and sand",Reference:"LiveAquaria Dwarf Yellow Tip Hermit Crab"},behavior:"Moves across rock and sand while grazing films and scavenging leftover food. The dark legs and lighter yellow-gold tips distinguish it from brighter generic yellow-leg hermits.",food:"Natural algae films, detritus, leftover marine foods, and occasional sinking algae-based foods.",care:["Provide several appropriately sized spare shells","Monitor interactions with snails and smaller hermits","Supplement food if the aquarium is very clean","Maintain stable salinity and avoid copper medications"]},
{group:"Coral",name:"Purple hammer coral",scientific:"Fimbriaphyllia paraancora",kind:"coral",accent:"#9f72d9",summary:"The remaining purple branching hammer coral in the display.",facts:{Count:"1",Status:"Active",PurchaseDate:"Not recorded",CurrentSize:"Not recorded",Placement:"Not recorded",Lighting:"Moderate",Flow:"Gentle to moderate indirect",LastDipped:"Not recorded",LastFragged:"Never / not recorded"},behavior:"Should inflate during the light cycle and may extend sweeper tentacles after dark.",food:"Primarily photosynthetic; optional small coral foods can be offered occasionally.",care:["Keep alkalinity and salinity stable","Avoid direct blasting flow","Leave room for sweeper tentacles","Log tissue recession, brown jelly, or failure to expand"]},
{group:"Coral",name:"Neon yellow octospawn",scientific:"Fimbriaphyllia species",kind:"coral",accent:"#d8ef45",summary:"The remaining neon yellow octospawn coral with fleshy, many-tipped tentacles.",facts:{Count:"1",Status:"Active",PurchaseDate:"Not recorded",CurrentSize:"Not recorded",Placement:"Not recorded",Lighting:"Moderate",Flow:"Gentle random",LastDipped:"Not recorded",LastFragged:"Never / not recorded"},behavior:"Expands broadly when comfortable and may retract from excessive flow, irritation, pests, or unstable chemistry.",food:"Mostly photosynthetic, with optional occasional feeding of appropriately sized coral foods.",care:["Handle only by the skeleton","Maintain stable alkalinity","Keep away from sensitive neighbors","Log bailout, tissue recession, or prolonged retraction immediately"]}
];
const equipment=[
{group:"Lighting",name:"Radion XR15 G6 Pro ×2",kind:"equipment",accent:"#67b8ff",summary:"Primary reef lighting controlled through Mobius.",facts:{Role:"Photosynthesis and coloration",Maintenance:"Clean lenses and vents monthly",Control:"Mobius",Placement:"Above display"},details:"Keep salt spray off lenses and fan openings. Changes to intensity should be gradual, especially after adding new corals."},
{group:"Flow",name:"Maxspect Gyre XF330 Cloud ×2",kind:"equipment",accent:"#52d2c7",summary:"Cross-flow pumps used to create broad circulation across the aquarium.",facts:{Role:"Primary water movement",Maintenance:"Inspect monthly",Control:"Syna-G",Placement:"Side glass"},details:"Clean rotors before calcium buildup becomes heavy. Uneven noise or reduced output usually indicates debris, worn bushings, or incorrect rotor seating."},
{group:"Flow",name:"AI Nero 3",kind:"equipment",accent:"#8f9dff",summary:"Compact supplemental circulation pump controlled through Mobius.",facts:{Role:"Targeted flow",Maintenance:"Clean monthly",Control:"Mobius",Placement:"Display glass"},details:"A red flashing indicator commonly points to a stalled rotor, obstruction, or motor issue. Keep the wet side free of calcium deposits."},
{group:"Filtration",name:"AquaMaxx HF-M HOB Multi Filter",kind:"equipment",accent:"#63c4bd",summary:"Hang-on-back filtration combining mechanical filtration and protein skimming.",facts:{Role:"Skimming and polishing",Maintenance:"Cup weekly; body periodically",Media:"Filter floss / biological media",Placement:"Back of tank"},details:"The skimmer and filter share circulation, so turning the unit off also pauses both functions. Clean the cup neck frequently for consistent foam production."},
{group:"Reactor",name:"AquaMaxx FR-S reactor",kind:"equipment",accent:"#f1c86b",summary:"Media reactor used for activated carbon and GFO.",facts:{Role:"Chemical filtration",Maintenance:"Inspect flow weekly",Media:"Carbon / GFO",Placement:"Internal"},details:"Do not pack the reactor tightly. Carbon should remain contained without grinding; GFO should move only slightly at the surface to prevent clumping or dust."},
{group:"Filtration",name:"Tunze Comline 3163",kind:"equipment",accent:"#7fd3a3",summary:"Internal filter used for water polishing and debris removal.",facts:{Role:"Mechanical filtration",Maintenance:"Rinse media as needed",Use:"Post-cleanup polishing",Placement:"Inside display"},details:"Useful after blowing debris from rockwork. Rinse or replace mechanical media before trapped waste breaks down."},
{group:"ATO",name:"XP Aqua Sumpless ATO2",kind:"equipment",accent:"#68d9e8",summary:"Automatic top-off and surface-skimming system.",facts:{Role:"Maintain salinity",Maintenance:"Inspect weekly",Fluid:"RODI only",Placement:"Display / reservoir"},details:"Keep sensors clean and verify that tubing cannot siphon. Test the backup shutoff periodically."},
{group:"Heating",name:"Helio 200W PTC heater",kind:"equipment",accent:"#ff927e",summary:"Primary temperature-control system.",facts:{Role:"Heating",Maintenance:"Inspect monthly",Target:"77–78°F",Placement:"High-flow area"},details:"Keep the sensor away from direct heater output. Verify temperature with an independent device during seasonal changes."},
{group:"Dosing",name:"Kamoer F1 dosing pump",kind:"equipment",accent:"#52d2c7",summary:"Single-channel dosing pump used for All-For-Reef.",facts:{Role:"Daily supplementation",Maintenance:"Calibrate periodically",Fluid:"All-For-Reef",Placement:"Above reservoir"},details:"Calibrate with a graduated cylinder. Keep the outlet above the waterline and arrange tubing to prevent accidental siphoning."},
{group:"Monitoring",name:"Seneye",kind:"equipment",accent:"#67b8ff",summary:"Continuous monitoring device for selected water conditions.",facts:{Role:"Trend monitoring",Maintenance:"Keep sensor clean",Use:"Supplement manual tests",Placement:"Display / sump area"},details:"Use Seneye trends as an early warning, while relying on calibrated handheld tests for dosing decisions."}
];
const livestockPhotoPages={
 "Biota Hawaiian yellow tang":"Yellow_tang",
 "Darwin ocellaris clownfish":"Amphiprion_ocellaris",
 "Snowflake ocellaris clownfish":"Amphiprion_ocellaris",
 "Blue-green chromis":"Chromis_viridis",
 "Purple firefish ×2":"Nemateleotris_decora",
 "Helfrichi firefish ×2":"Nemateleotris_helfrichi",
 "Tomini tang":"Ctenochaetus_tominiensis",
 "Skunk cleaner shrimp":"Lysmata_amboinensis",
 "Tiger pistol shrimp (snapping shrimp)":"Alpheus_bellulus",
 "Electric blue hermit crab":"Calcinus_elegans",
 "Zebra hermit crab":"Calcinus_laevimanus",
 "Dwarf yellow tip hermit crab":"Clibanarius",
 "Purple hammer coral":"Fimbriaphyllia_paraancora",
 "Neon yellow octospawn":"Euphyllia"
};

const livestockLocalImages={
 "Dwarf yellow tip hermit crab":"./images/dwarf_yellow_tip_hermit.jpg"
};
const equipmentSources={
 "Radion XR15 G6 Pro ×2":"https://store2.ecotechmarine.com/products/radion-xr15g6pro",
 "Maxspect Gyre XF330 Cloud ×2":"https://maxspect.com/en/innovate-series/617-gyre-300-ce.html",
 "AI Nero 3":"https://www.aquaillumination.com/products/nero",
 "AquaMaxx HF-M HOB Multi Filter":"https://www.bulkreefsupply.com/hf-m-hang-on-back-multi-filter-with-protein-skimmer-aquamaxx.html",
 "AquaMaxx FR-S reactor":"https://www.bulkreefsupply.com/fr-s-internal-gfo-carbon-and-biopellet-filter-media-reactor-aquamaxx.html",
 "Tunze Comline 3163":"https://www.tunze.com/en/details/3163.000-comline-filter-3163.html",
 "XP Aqua Sumpless ATO2":"https://www.xpaqua.com/products/sumpless-ato",
 "Helio 200W PTC heater":"https://www.innovative-marine.com/shop/Helio-Universal-PTC-Smart-Heater-c118225737",
 "Kamoer F1 dosing pump":"https://www.kamoer.com/products/f1-wifi-dosing-pump",
 "Seneye":"https://www.seneye.com/store/seneye-home.html"
};
const testerSources={
 "HI772":"https://hannainst.com/marine-alkalinity-dkh-checkerr-hc-hi772.html",
 "HI758U":"https://hannainst.com/marine-calcium-checkerr-hc-hi758u.html",
 "HI783":"https://hannainst.com/marine-magnesium-checker-hc-hi783.html",
 "HI782":"https://hannainst.com/marine-nitrate-high-range-checker-hc-hi782.html",
 "HI736":"https://hannainst.com/phosphorus-ultra-low-range-colorimeter-checker-hc-hi736.html",
 "HI780":"https://hannainst.com/marine-ph-tester-hi780.html",
 "HI98319":"https://hannainst.com/marine-salinity-tester-hi98319.html"
};


const defaultInventory=[
 {id:"salt-tropic-marin",category:"Salt",name:"Tropic Marin Pro-Reef",current:40,full:40,unit:"cups",expiry:"",usagePerTask:0.5,match:"water change",note:"Automatic usage is calculated from gallons logged at 0.5 cup per gallon at 35 ppt."},
 {id:"reagent-alk",category:"Test Reagents",name:"Hanna HI772 Alkalinity Reagent",current:25,full:25,unit:"tests",expiry:"",usagePerTask:1,match:"alkalinity test",note:"One test is deducted when alkalinity is saved or its task is completed."},
 {id:"reagent-ca",category:"Test Reagents",name:"Hanna HI758 Calcium Reagent",current:25,full:25,unit:"tests",expiry:"",usagePerTask:1,match:"calcium",note:"One test is deducted per calcium reading."},
 {id:"reagent-mg",category:"Test Reagents",name:"Hanna HI783 Magnesium Reagent",current:25,full:25,unit:"tests",expiry:"",usagePerTask:1,match:"magnesium",note:"One test is deducted per magnesium reading."},
 {id:"reagent-no3",category:"Test Reagents",name:"Hanna HI782 Nitrate Reagent",current:25,full:25,unit:"tests",expiry:"",usagePerTask:1,match:"nitrate",note:"One test is deducted per nitrate reading."},
 {id:"reagent-po4",category:"Test Reagents",name:"Hanna HI736 Phosphorus Reagent",current:25,full:25,unit:"tests",expiry:"",usagePerTask:1,match:"phosphate",note:"One test is deducted per phosphorus/phosphate reading."},
 {id:"afr",category:"Dosing",name:"Tropic Marin All-For-Reef",current:1000,full:1000,unit:"mL",expiry:"",usagePerTask:10,match:"all-for-reef|afr|dose",note:"Set Usage per task to your normal daily dose so completed dosing tasks deduct the correct volume."},
 {id:"mb7",category:"Dosing",name:"MicroBacter7",current:250,full:250,unit:"mL",expiry:"",usagePerTask:6.5,match:"microbacter7",note:"Only deducts when a matching goal-based dosing task is completed."},
 {id:"mbclean",category:"Dosing",name:"MicroBacter CLEAN",current:500,full:500,unit:"mL",expiry:"",usagePerTask:52,match:"microbacter clean",note:"Only deducts when a matching goal-based dosing task is completed."},
 {id:"carbon",category:"Filter Media",name:"ROX 0.8 Carbon",current:500,full:500,unit:"mL",expiry:"",usagePerTask:100,match:"carbon",note:"Edit Usage per task to the amount normally replaced."},
 {id:"gfo",category:"Filter Media",name:"High-Capacity GFO",current:250,full:250,unit:"grams",expiry:"",usagePerTask:50,match:"gfo|phosphate media",note:"Edit Usage per task to the amount normally replaced."},
 {id:"floss",category:"Filter Media",name:"Filter Floss / Socks",current:20,full:20,unit:"changes",expiry:"",usagePerTask:1,match:"filter floss|filter sock|mechanical filtration",note:"One change is deducted when a matching replacement task is completed."},
 {id:"mysis",category:"Food",name:"Frozen Mysis",current:20,full:20,unit:"cubes",expiry:"",usagePerTask:0.5,match:"frozen|mysis|feed fish",note:"Optional automatic amount for a completed feeding task."},
 {id:"nori",category:"Food",name:"Nori Sheets",current:20,full:20,unit:"sheets",expiry:"",usagePerTask:0.25,match:"nori|algae grazing",note:"Set the amount used for each feeding task."}
];

const testers=[{"code": "HI772", "name": "Marine Alkalinity Checker", "image": "./images/hanna_hi772.jpg", "key": "alk", "unit": "dKH", "summary": "Measures alkalinity directly in dKH and is the primary test used to fine-tune All-For-Reef.", "range": "0.0–20.0 dKH", "reagent": "HI772-26", "frequency": "2–3× weekly while adjusting AFR", "steps": ["Rinse the cuvette with tank water, then fill exactly to the 10 mL line.", "Wipe the cuvette and insert it for the C1 zero reading.", "Add exactly 1.0 mL of HI772 reagent.", "Cap and invert gently several times without creating bubbles.", "Wipe the cuvette again, keep the same orientation, and take the C2 reading."], "tips": ["Use a dedicated 1 mL syringe.", "Test at the same time of day.", "Remove fingerprints and bubbles before both readings."], "mistakes": ["Inaccurate 1 mL reagent volume", "Changing cuvette orientation between C1 and C2", "Testing immediately after dosing into the same area"]}, {"code": "HI758U", "name": "Marine Calcium Checker", "image": "./images/hanna_hi758.jpg", "key": "ca", "unit": "ppm", "summary": "Measures calcium using a very small 0.1 mL aquarium-water sample.", "range": "200–600 ppm", "reagent": "HI758-26", "frequency": "Weekly initially; every 2–4 weeks once stable", "steps": ["Add 1 mL reagent A to a clean cuvette.", "Add RODI water to the 10 mL line, mix, wipe, and zero as C1.", "Add exactly 0.1 mL of aquarium water using the supplied micropipette.", "Add one packet of reagent B.", "Cap and shake vigorously for the specified time, wipe, and read C2."], "tips": ["The 0.1 mL sample volume is the most important accuracy step.", "Use only clean RODI for the blank.", "Keep the micropipette tip free of salt residue."], "mistakes": ["Using 1 mL tank water instead of 0.1 mL", "Poor micropipette technique", "Residual calcium or salt in the cuvette"]}, {"code": "HI783", "name": "Marine Magnesium Checker", "image": "./images/hanna_hi783.jpg", "key": "mg", "unit": "ppm", "summary": "Measures magnesium, which helps stabilize calcium and alkalinity chemistry.", "range": "1000–1800 ppm", "reagent": "HI783-25", "frequency": "Weekly during setup; monthly once stable", "steps": ["Use clean cuvettes, syringes, and pipette tips.", "Prepare the C1 blank exactly as shown in the current reagent-kit quick guide.", "Zero the checker with the C1 cuvette.", "Prepare the C2 sample using the stated aquarium-water and reagent volumes.", "Mix completely, wipe the cuvette, and take the final reading."], "tips": ["Follow the instructions packaged with the current reagent lot.", "Measure every liquid carefully.", "Rinse tools immediately after testing."], "mistakes": ["Following instructions from an older reagent version", "Cross-contaminating the sample syringe", "Incomplete mixing"]}, {"code": "HI782", "name": "Marine Nitrate High Range Checker", "image": "./images/hanna_hi782.jpg", "key": "no3", "unit": "ppm", "summary": "Measures nitrate in a reef-friendly range without manual color matching.", "range": "0.0–75.0 ppm", "reagent": "HI782-25", "frequency": "Weekly", "steps": ["Fill a clean cuvette with 10 mL of aquarium water.", "Wipe the cuvette and take the C1 zero reading.", "Add one HI782 reagent packet.", "Cap and shake/mix for the full instructed period.", "Use the timed reading mode and keep the cuvette clean before C2."], "tips": ["Get all powder into the cuvette.", "Start timing promptly.", "Tap away microbubbles before reading."], "mistakes": ["Reagent powder left in the packet", "Shortened mixing time", "Dirty or scratched cuvette"]}, {"code": "HI736", "name": "Phosphorus Ultra Low Range Checker", "image": "./images/hanna_hi736.jpg", "key": "ppb", "unit": "ppb P", "summary": "Reads ultra-low phosphorus in ppb. Aquarium Hub converts it automatically to phosphate ppm.", "range": "0–200 ppb phosphorus", "reagent": "HI736-25", "frequency": "Weekly or after changing GFO", "steps": ["Fill a clean cuvette with 10 mL aquarium water.", "Wipe it and take the C1 zero reading.", "Add one HI736 reagent packet.", "Shake continuously for 2 minutes.", "Hold the button to start the 3-minute countdown, then read the phosphorus result."], "tips": ["Enter the ppb result into the Readings page.", "Conversion used: ppb phosphorus × 3.066 ÷ 1000.", "Example: 20 ppb phosphorus = 0.061 ppm phosphate."], "mistakes": ["Entering the result directly as phosphate ppm", "Waiting too long before starting the timer", "Powder stuck around the neck or cap"]}, {"code": "HI780", "name": "Marine pH Tester", "image": "", "key": "ph", "unit": "pH", "summary": "A digital probe used for quick pH spot checks alongside the Seneye trend.", "range": "6.3–8.6 pH", "reagent": "pH 7.01 / 10.01 buffers", "frequency": "Weekly", "steps": ["Rinse the probe with RODI water.", "Blot gently—do not rub the glass sensor.", "Immerse the probe in a clean aquarium-water sample.", "Stir gently and wait until the reading stabilizes.", "Rinse and return the cap with storage solution."], "tips": ["Keep the probe hydrated.", "Calibrate with fresh buffers.", "Do not store the probe in RODI water."], "mistakes": ["Allowing the probe to dry", "Using expired or contaminated calibration buffer", "Rubbing the sensing bulb"]}, {"code": "HI98319", "name": "Marine Salinity Tester", "image": "./images/hanna_hi98319.jpg", "key": "sal", "unit": "ppt", "summary": "Measures salinity digitally in ppt or specific gravity.", "range": "0.0–70.0 ppt", "reagent": "35.00 ppt calibration solution", "frequency": "Every water change and weekly", "steps": ["Rinse the probe with RODI water.", "Immerse the probe in the aquarium-water sample.", "Stir gently to release any trapped bubbles.", "Wait for the reading to stabilize.", "Rinse after use and dry the exterior."], "tips": ["Calibrate with 35.00 ppt standard.", "Match new saltwater to the aquarium before a water change.", "Use ppt for the clearest comparison."], "mistakes": ["Air bubbles on the sensor", "Calibrating with tank water", "Testing a very small sample that changes temperature quickly"]}];

const verifiedProductImages={"AI Nero 3": "./images/nero3.jpg", "Maxspect Gyre XF330 Cloud ×2": "./images/gyre_xf330.jpg", "AquaMaxx HF-M HOB Multi Filter": "./images/aquamaxx_hfm_logo_free.jpg", "AquaMaxx FR-S reactor": "./images/aquamaxx_frs_logo_free.jpg", "Helio 200W PTC heater": "./images/helio_heater.jpg", "Seneye": "./images/seneye.jpg"};
const verifiedTesterImages={"HI772": "./images/hanna_hi772.jpg", "HI758U": "./images/hanna_hi758.jpg", "HI783": "./images/hanna_hi783.jpg", "HI782": "./images/hanna_hi782.jpg", "HI736": "./images/hanna_hi736.jpg", "HI98319": "./images/hanna_hi98319.jpg"};
const memoryStorage={};
function safeGet(key,fallback){
 try{
  const value=window.localStorage.getItem(key);
  return value===null?fallback:value;
 }catch(err){
  console.warn("Persistent storage is unavailable; using this session only.",err);
  return Object.prototype.hasOwnProperty.call(memoryStorage,key)?memoryStorage[key]:fallback;
 }
}
function safeSet(key,value){
 memoryStorage[key]=String(value);
 try{
  window.localStorage.setItem(key,String(value));
  return true;
 }catch(err){
  console.warn("Persistent storage is unavailable; data will remain for this open session.",err);
  return false;
 }
}
function safeJson(key,fallback){
 try{return JSON.parse(safeGet(key,JSON.stringify(fallback)))}catch(err){console.warn("Invalid saved data reset for",key,err);return fallback}
}
let state={
 readings:safeJson("reefReadings",[]),
 tasks:safeJson("reefTasks",[]),
 taskCompletions:safeJson("reefTaskCompletions",{}),
 waterChanges:safeJson("reefWaterChanges",[]),
 serviceHistory:safeJson("reefServiceHistory",{}),
 observations:safeJson("reefObservations",[]),
 recommendationHistory:safeJson("reefRecommendationHistory",[]),
 inventory:safeJson("reefInventory",defaultInventory),
 inventoryEvents:safeJson("reefInventoryEvents",{}),
};

function applyV14RealBaseline(){
 const migrationKey="aquariumHubV14RealBaseline";
 if(safeGet(migrationKey,"")==="done")return;
 const today=localISODate(new Date());
 // The user confirmed prior readings were only test data. Start the real log clean.
 state.readings=[];
 state.taskCompletions={};
 state.waterChanges=[{id:Date.now(),date:today,gallons:30,notes:"Initial real maintenance baseline"}];
 state.serviceHistory={equipmentCleaned:today,bioMediaReplaced:today,reactorMediaReplaced:today};
 safeSet("reefReadings",JSON.stringify(state.readings));
 safeSet("reefTaskCompletions",JSON.stringify(state.taskCompletions));
 safeSet("reefWaterChanges",JSON.stringify(state.waterChanges));
 safeSet("reefServiceHistory",JSON.stringify(state.serviceHistory));
 safeSet(migrationKey,"done");
}
applyV14RealBaseline();
function applyV15MaintenanceMigration(){
 const migrationKey="aquariumHubV15MaintenanceMigration";
 if(safeGet(migrationKey,"")==="done")return;
 const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
 const yesterdayKey=localISODate(yesterday);
 const baseline=(state.waterChanges||[]).find(w=>Number(w.gallons)===30&&String(w.notes||"").toLowerCase().includes("baseline"));
 if(baseline){baseline.date=yesterdayKey;baseline.notes="30-gallon water change"}
 else if(!(state.waterChanges||[]).some(w=>w.date===yesterdayKey&&Number(w.gallons)===30)){
  state.waterChanges.push({id:Date.now(),date:yesterdayKey,gallons:30,notes:"30-gallon water change"});
 }
 state.observations=Array.isArray(state.observations)?state.observations:[];
 state.recommendationHistory=Array.isArray(state.recommendationHistory)?state.recommendationHistory:[];
 safeSet("reefWaterChanges",JSON.stringify(state.waterChanges));
 safeSet("reefObservations",JSON.stringify(state.observations));
 safeSet(migrationKey,"done");
}
applyV15MaintenanceMigration();

function normalizeInventory(){
 const saved=Array.isArray(state.inventory)?state.inventory:[];
 const byId=Object.fromEntries(saved.map(x=>[x.id,x]));
 state.inventory=defaultInventory.map(d=>({...d,...(byId[d.id]||{})}));
 state.inventoryEvents=state.inventoryEvents&&typeof state.inventoryEvents==="object"?state.inventoryEvents:{};
}
normalizeInventory();

function persist(showWarning=false){
 const readingsSaved=safeSet("reefReadings",JSON.stringify(state.readings));
 const tasksSaved=safeSet("reefTasks",JSON.stringify(state.tasks));
 const completionsSaved=safeSet("reefTaskCompletions",JSON.stringify(state.taskCompletions));
 const waterChangesSaved=safeSet("reefWaterChanges",JSON.stringify(state.waterChanges));
 const serviceSaved=safeSet("reefServiceHistory",JSON.stringify(state.serviceHistory));
 const observationsSaved=safeSet("reefObservations",JSON.stringify(state.observations||[]));
 const recommendationHistorySaved=safeSet("reefRecommendationHistory",JSON.stringify(state.recommendationHistory||[]));
 const inventorySaved=safeSet("reefInventory",JSON.stringify(state.inventory||[]));
 const inventoryEventsSaved=safeSet("reefInventoryEvents",JSON.stringify(state.inventoryEvents||{}));
 if(showWarning&&(!readingsSaved||!tasksSaved||!completionsSaved||!waterChangesSaved||!serviceSaved||!observationsSaved||!recommendationHistorySaved||!inventorySaved||!inventoryEventsSaved)){
  alert("Your changes are working in this open session, but this browser blocked permanent storage. Open the app in Safari/Chrome outside Private Browsing for permanent saving.");
 }
 return true;
}
function showPage(id){
 const page=document.getElementById(id);if(!page){console.warn("Unknown page:",id);return false}
 document.querySelectorAll(".page").forEach(x=>x.classList.toggle("active",x.id===id));
 document.querySelectorAll("[data-page]").forEach(x=>x.classList.toggle("active",x.dataset.page===id));
 window.scrollTo({top:0,behavior:"smooth"});return true;
}
function goToSection(pageId,sectionId){
 if(!showPage(pageId))return;
 setTimeout(()=>{const el=document.getElementById(sectionId)||document.getElementById(pageId);if(el)el.scrollIntoView({behavior:"smooth",block:"start"})},80);
}
function itemQuantity(name){
 const match=String(name).match(/[×x]\s*(\d+)/i);
 return match?Number(match[1]):1;
}
function livestockCount(group){return livestock.filter(x=>x.group===group).reduce((sum,x)=>sum+itemQuantity(x.name),0)}
function latestFullTest(){
 const keys=["alk","ca","mg","no3","po4","ph","sal","temp"];
 return [...state.readings].filter(r=>keys.every(k=>Number.isFinite(Number(r[k])))).sort((a,b)=>new Date(b.date+"T"+(b.time||"00:00"))-new Date(a.date+"T"+(a.time||"00:00")))[0]||null;
}
function initNav(){
 ["nav","mobileTabs"].forEach(cid=>{const c=document.getElementById(cid);pages.forEach(([id,label])=>{const b=document.createElement("button");b.textContent=label;b.dataset.page=id;b.onclick=()=>showPage(id);if(id==="dashboard")b.classList.add("active");c.appendChild(b)})});
}
function latest(){return [...state.readings].sort((a,b)=>new Date(b.date+"T"+b.time)-new Date(a.date+"T"+a.time))[0]||null}
function hasReadingValue(v){return v!==null&&v!==undefined&&String(v).trim()!==""&&Number.isFinite(Number(v))}
function mean(key){const v=state.readings.map(r=>r[key]).filter(hasReadingValue).map(Number);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null}
function fmt(v,key){if(v==null||v==="")return "—";if(key==="po4")return Number(v).toFixed(3);if(["alk","ph","sal","temp"].includes(key))return Number(v).toFixed(2).replace(/0+$/,"").replace(/\.$/,"");return Math.round(v)}
function statusClass(v,t){if(v==null)return "";return v>=t.min&&v<=t.max?"good":(v<t.min*.9||v>t.max*1.1?"bad":"warn")}
function readingDate(r){
 const d=new Date(`${r.date||""}T${r.time||"12:00"}`);
 return Number.isNaN(d.getTime())?null:d;
}
function parameterHistory(key){
 return state.readings
  .filter(r=>hasReadingValue(r[key])&&readingDate(r))
  .sort((a,b)=>readingDate(a)-readingDate(b));
}
function rangeConditionScore(value,t){
 if(value>=t.min&&value<=t.max)return 100;
 const span=t.max-t.min;
 const distance=value<t.min?(t.min-value)/span:(value-t.max)/span;
 if(distance<=.15)return 75;
 if(distance<=.40)return 50;
 if(distance<=.75)return 20;
 return 0;
}
function trendDeduction(history,t){
 if(history.length<2)return 0;
 const current=Number(history[history.length-1][t.key]);
 const previous=Number(history[history.length-2][t.key]);
 const change=current-previous;
 const span=t.max-t.min;
 if(!Number.isFinite(change)||span<=0)return 0;
 const movement=Math.abs(change)/span;
 const center=(t.min+t.max)/2;
 const movingAway=Math.abs(current-center)>Math.abs(previous-center);
 if(!movingAway)return 0;
 if(movement>=.50)return 25;
 if(movement>=.25)return 15;
 if(movement>=.10)return 5;
 return 0;
}
function freshnessCap(lastReading,t){
 const d=readingDate(lastReading);if(!d)return 0;
 const ageDays=Math.max(0,(Date.now()-d.getTime())/86400000);
 if(ageDays<=t.testDays)return 100;
 if(ageDays<=t.testDays*2)return 85;
 return 60;
}
function tankHealthScore(){
 let earned=0,availableWeight=0;
 Object.values(targets).forEach(t=>{
  const history=parameterHistory(t.key);
  if(!history.length)return;
  const last=history[history.length-1];
  const value=Number(last[t.key]);
  let score=rangeConditionScore(value,t)-trendDeduction(history,t);
  score=Math.max(0,Math.min(score,freshnessCap(last,t)));
  earned+=score*t.weight;
  availableWeight+=t.weight;
 });
 return availableWeight?Math.round(earned/availableWeight):null;
}
function renderDashboard(){
 const l=latest(); const k=document.getElementById("kpis");k.innerHTML="";
 // Each dashboard parameter card uses that parameter's newest saved result.
 // This allows partial tests to update immediately without waiting for a full-panel reading.
 Object.values(targets).forEach(t=>{
  const history=parameterHistory(t.key);
  const newest=history.length?history[history.length-1]:null;
  const previous=history.length>1?history[history.length-2]:null;
  const v=newest?newest[t.key]:null;
  let changeHtml='<span class="kpi-change neutral">No reading saved</span>';
  if(newest&&previous){
   const delta=Number(newest[t.key])-Number(previous[t.key]);
   const decimals=t.key==='po4'?3:(["alk","ph","sal","temp"].includes(t.key)?2:0);
   const threshold=t.key==='po4'?0.0005:0.005;
   const arrow=Math.abs(delta)<threshold?'→':delta>0?'↑':'↓';
   const sign=delta>0?'+':'';
   const cls=Math.abs(delta)<threshold?'neutral':delta>0?'up':'down';
   changeHtml=`<span class="kpi-change ${cls}">${arrow} ${sign}${delta.toFixed(decimals).replace(/\.?0+$/,'')} ${t.unit} since last</span>`;
  }else if(newest){changeHtml='<span class="kpi-change neutral">First saved reading</span>'}
  const c=document.createElement("div");
  c.className="card kpi";
  c.innerHTML=`<div class="label">${t.label}</div><div class="value ${statusClass(v,t)}">${fmt(v,t.key)}${v!=null?` <small>${t.unit}</small>`:''}</div>${changeHtml}<div class="sub">${newest?`Latest: ${newest.date} • `:''}Target ${t.min}–${t.max} ${t.unit}</div>`;
  k.appendChild(c);
 });
 const ok=Object.values(targets).every(t=>{
  const newest=latestForKey(t.key);
  const v=newest?Number(newest[t.key]):NaN;
  return Number.isFinite(v)&&v>=t.min&&v<=t.max;
 });
 const sb=document.getElementById("statusBadge");if(sb){sb.textContent=!l?"Waiting for readings":ok?"All latest readings in range":"Review latest readings";sb.className="badge "+(!l?"gold":ok?"":"coral")}
 const todayKey=localISODate(new Date());
 const todayTasks=generatedMaintenanceTasks(7).filter(t=>t.date===todayKey);
 const pending=todayTasks.filter(t=>!t.done);
 document.getElementById("dashboardTasks").innerHTML=pending.length?pending.map(taskHtml).join(""):'<div class="empty">All of today’s tasks are complete.</div>';
 document.getElementById("taskCount").textContent=`${pending.length} remaining today`;
 document.getElementById("currentAfr").textContent=l&&l.afr?`${l.afr} mL/day`:"Not set";
 const health=tankHealthScore();
 const healthDisplay=health==null?0:health;
 const healthScoreEl=document.getElementById("healthScore");
 if(healthScoreEl)healthScoreEl.textContent=healthDisplay+"%";
 const ring=document.getElementById("healthRingLarge");if(ring)ring.style.setProperty("--score",healthDisplay);
 const healthLabel=health==null?"Waiting for readings":health>=90?"Excellent":health>=75?"Good":health>=55?"Needs Attention":"At Risk";
 document.getElementById("healthLabel").textContent=healthLabel;
 document.getElementById("glanceStatus").textContent=health==null?"Waiting for readings":health>=75?"All critical levels stable":"Review water parameters";
 const full=latestFullTest();document.getElementById("lastFullTest").textContent=full?`${full.date}${full.time?" • "+full.time:""}`:"No complete test saved";
 document.getElementById("healthUpdated").textContent=l?`Updated: ${l.date}${l.time?" • "+l.time:""}`:"Updated: No readings";
 document.getElementById("glanceFish").textContent=livestockCount("Fish");
 document.getElementById("glanceInverts").textContent=livestockCount("Invertebrate");
 document.getElementById("glanceCorals").textContent=livestockCount("Coral");
 const monthTasks=generatedMaintenanceTasks(30),doneCount=monthTasks.filter(t=>t.done).length;
 document.getElementById("maintenanceScore").textContent=Math.round((doneCount/Math.max(1,monthTasks.length))*100)+"%";
 document.getElementById("afrSummary").textContent=l&&l.afr?`${l.afr} mL`:"—";
 renderMajorElements(state.readings.slice(-14));
 renderNutrients(state.readings.slice(-14));
}
function drawLine(id,pts,colors){
 const el=document.getElementById(id);if(!pts.length){el.innerHTML='<div class="empty">Add readings to see a trend.</div>';return}
 const w=700,h=240,p=30,ys=pts.map(x=>x.y),min=Math.min(...ys),max=Math.max(...ys),span=max-min||1;
 const x=i=>p+(w-2*p)*(i/Math.max(1,pts.length-1)), y=v=>h-p-(h-2*p)*((v-min)/span);
 const path=pts.map((pt,i)=>(i?"L":"M")+x(i)+","+y(pt.y)).join(" ");
 el.innerHTML=`<svg viewBox="0 0 ${w} ${h}"><line class="axis" x1="${p}" y1="${h-p}" x2="${w-p}" y2="${h-p}"/><line class="axis" x1="${p}" y1="${p}" x2="${p}" y2="${h-p}"/><path d="${path}" class="line"/>${pts.map((pt,i)=>`<circle class="dot" cx="${x(i)}" cy="${y(pt.y)}" r="4"><title>${pt.label}: ${pt.y}</title></circle>`).join("")}<text class="labeltxt" x="${p}" y="18">${max.toFixed(2)}</text><text class="labeltxt" x="${p}" y="${h-5}">${min.toFixed(2)}</text></svg>`;
}

function trendMeta(rows,key,decimals,unit){
 const vals=rows.filter(r=>r&&r[key]!==null&&Number.isFinite(Number(r[key])));
 if(!vals.length)return {html:'<span class="change neutral">No prior reading</span>',label:'No prior reading'};
 if(vals.length<2)return {html:'<span class="change neutral">First reading</span>',label:'First reading'};
 const current=Number(vals[vals.length-1][key]);
 const previous=Number(vals[vals.length-2][key]);
 const diff=current-previous;
 const threshold=Math.pow(10,-decimals)/2;
 if(Math.abs(diff)<=threshold)return {html:'<span class="change stable">→ Stable</span>',label:'Stable'};
 const sign=diff>0?'+':'';
 const cls=diff>0?'up':'down';
 const arrow=diff>0?'↑':'↓';
 return {html:`<span class="change ${cls}">${arrow} ${sign}${diff.toFixed(decimals)} ${unit} since last</span>`,label:`${diff>0?'Up':'Down'} ${Math.abs(diff).toFixed(decimals)} ${unit}`};
}

function renderMajorElements(rows){
 const el=document.getElementById("majorElementsChart");
 const summary=document.getElementById("majorSummary");
 if(!el||!summary)return;
 const config=[
  {key:"alk",label:"Alkalinity",short:"Alk",unit:"dKH",color:"#4fd6d0",targetMin:7,targetMax:9,decimals:1,step:1},
  {key:"ca",label:"Calcium",short:"Ca",unit:"ppm",color:"#ff9d45",targetMin:400,targetMax:460,decimals:0,step:50},
  {key:"mg",label:"Magnesium",short:"Mg",unit:"ppm",color:"#a875ff",targetMin:1280,targetMax:1420,decimals:0,step:150}
 ];
 const chronological=[...rows].filter(Boolean).sort((a,b)=>readingDate(a)-readingDate(b));
 const historyFor=key=>chronological.filter(r=>r[key]!==null&&Number.isFinite(Number(r[key]))).slice(-12);
 const formatDateShort=r=>{const d=readingDate(r);return d?d.toLocaleDateString([], {month:"short",day:"numeric"}):""};
 summary.innerHTML=config.map(c=>{
  const h=historyFor(c.key),last=h[h.length-1],value=last?Number(last[c.key]):null,trend=trendMeta(h,c.key,c.decimals,c.unit);
  const previous=h.length>1?h[h.length-2]:null;
  return `<div class="major-stat" style="--element-color:${c.color}">
   <span class="element-label ${c.key}"><i class="element-dot ${c.key}-dot" style="background:${c.color}"></i>${c.short}</span>
   <strong>${value===null?"—":value.toFixed(c.decimals)} <em>${value===null?"":c.unit}</em></strong>
   ${trend.html}
   <small>${previous?`Previous: ${formatDateShort(previous)}<br>`:""}Target: ${c.targetMin}–${c.targetMax}</small>
  </div>`;
 }).join("");

 const allDates=[...new Set(config.flatMap(c=>historyFor(c.key).map(r=>{
  const d=readingDate(r); return d?d.toISOString().slice(0,10):"";
 })).filter(Boolean))].sort().slice(-12);
 if(!allDates.length){el.innerHTML='<div class="empty">Add alkalinity, calcium, or magnesium readings to see trends.</div>';return}

 const dateIndex=new Map(allDates.map((d,i)=>[d,i]));
 const w=700,h=230,left=38,right=14,top=18,bottom=38,n=Math.max(1,allDates.length-1);
 const x=i=>left+(w-left-right)*(i/n);
 const normalized=(c,v)=>Number(v)/c.step;
 const normalizedTargets=config.flatMap(c=>[normalized(c,c.targetMin),normalized(c,c.targetMax)]);
 const normalizedValues=config.flatMap(c=>historyFor(c.key).map(r=>normalized(c,r[c.key])));
 const rawMin=Math.min(...normalizedTargets,...normalizedValues);
 const rawMax=Math.max(...normalizedTargets,...normalizedValues);
 const yMin=Math.max(0,Math.floor(rawMin-0.5));
 const yMax=Math.ceil(rawMax+0.5);
 const span=Math.max(1,yMax-yMin);
 const y=v=>h-bottom-(h-top-bottom)*((v-yMin)/span);

 const pointSets=config.map(c=>({c,pts:historyFor(c.key).map(r=>{
  const d=readingDate(r),iso=d?d.toISOString().slice(0,10):"";
  return {i:dateIndex.get(iso),raw:Number(r[c.key]),scaled:normalized(c,r[c.key]),date:formatDateShort(r)};
 }).filter(q=>Number.isInteger(q.i))}));

 let svg=`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Normalized alkalinity, calcium, and magnesium trends">`;
 for(let tick=yMin;tick<=yMax;tick++){
  const gy=y(tick);
  svg+=`<line class="major-grid" x1="${left}" y1="${gy}" x2="${w-right}" y2="${gy}"/>`;
  svg+=`<text class="major-axis" text-anchor="end" x="${left-6}" y="${gy+3}">${tick}</text>`;
 }
 // Each element has its own normalized target band; these overlap near the desired operating zone.
 config.forEach(c=>{
  const low=normalized(c,c.targetMin),high=normalized(c,c.targetMax);
  svg+=`<rect x="${left}" y="${y(high)}" width="${w-left-right}" height="${Math.max(2,y(low)-y(high))}" fill="${c.color}" fill-opacity=".045" rx="4"><title>${c.label} target: ${c.targetMin}–${c.targetMax} ${c.unit}</title></rect>`;
  svg+=`<line x1="${left}" y1="${y(low)}" x2="${w-right}" y2="${y(low)}" stroke="${c.color}" stroke-opacity=".26" stroke-dasharray="4 5"/>`;
  svg+=`<line x1="${left}" y1="${y(high)}" x2="${w-right}" y2="${y(high)}" stroke="${c.color}" stroke-opacity=".26" stroke-dasharray="4 5"/>`;
 });
 pointSets.forEach(({c,pts})=>{
  if(!pts.length)return;
  const path=pts.length===1?`M${x(pts[0].i)-1},${y(pts[0].scaled)} L${x(pts[0].i)+1},${y(pts[0].scaled)}`:pts.map((q,i)=>(i?"L":"M")+x(q.i)+","+y(q.scaled)).join(" ");
  svg+=`<path d="${path}" fill="none" stroke="${c.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  svg+=pts.map(q=>`<circle cx="${x(q.i)}" cy="${y(q.scaled)}" r="3.6" fill="${c.color}" stroke="#0a202a" stroke-width="1.7"><title>${q.date}: ${c.label} ${q.raw.toFixed(c.decimals)} ${c.unit} • graph unit ${q.scaled.toFixed(2)}</title></circle>`).join("");
 });
 const tickIndices=allDates.length<=5?allDates.map((_,i)=>i):[0,Math.round(n/2),n];
 [...new Set(tickIndices)].forEach(i=>{
  const d=new Date(allDates[i]+"T12:00:00");
  svg+=`<text class="major-date" text-anchor="middle" x="${x(i)}" y="${h-14}">${d.toLocaleDateString([], {month:"short",day:"numeric"})}</text>`;
 });
 svg+='</svg>';
 el.innerHTML=svg;
}

function renderNutrients(rows){
 const clean=rows.filter(r=>r && (r.no3!==null || r.po4!==null));
 const el=document.getElementById("nutrientChart");
 const summary=document.getElementById("nutrientSummary");
 if(!el||!summary)return;
 const chronological=[...clean].sort((a,b)=>readingDate(a)-readingDate(b));
 const no3History=chronological.filter(r=>r.no3!==null&&Number.isFinite(Number(r.no3)));
 const po4History=chronological.filter(r=>r.po4!==null&&Number.isFinite(Number(r.po4)));
 const no3Row=no3History[no3History.length-1],po4Row=po4History[po4History.length-1];
 const no3Latest=no3Row?Number(no3Row.no3):null,po4Latest=po4Row?Number(po4Row.po4):null;
 const no3Trend=trendMeta(no3History,"no3",1,"ppm"),po4Trend=trendMeta(po4History,"po4",3,"ppm");
 const dateShort=r=>{const d=r&&readingDate(r);return d?d.toLocaleDateString([], {month:"short",day:"numeric"}):""};
 const no3Previous=no3History.length>1?no3History[no3History.length-2]:null;
 const po4Previous=po4History.length>1?po4History[po4History.length-2]:null;
 summary.innerHTML=`
  <div class="nutrient-stat" style="--nutrient-color:#67b8ff">
   <span><i style="background:#67b8ff"></i>Nitrate</span>
   <strong>${no3Latest===null?"—":no3Latest.toFixed(1)} <em>${no3Latest===null?"":"ppm"}</em></strong>
   ${no3Trend.html}
   <small>${no3Row?`Latest: ${dateShort(no3Row)}<br>`:""}${no3Previous?`Previous: ${dateShort(no3Previous)}<br>`:""}Target: 5–15 ppm</small>
  </div>
  <div class="nutrient-stat" style="--nutrient-color:#f1c86b">
   <span><i style="background:#f1c86b"></i>Phosphate</span>
   <strong>${po4Latest===null?"—":po4Latest.toFixed(3)} <em>${po4Latest===null?"":"ppm"}</em></strong>
   ${po4Trend.html}
   <small>${po4Row?`Latest: ${dateShort(po4Row)}<br>`:""}${po4Previous?`Previous: ${dateShort(po4Previous)}<br>`:""}Target: 0.03–0.10 ppm</small>
  </div>`;
 const no3=clean.map((r,i)=>({i,v:r.no3===null?null:Number(r.no3),date:r.date})).filter(x=>Number.isFinite(x.v));
 const po4=clean.map((r,i)=>({i,v:r.po4===null?null:Number(r.po4),date:r.date})).filter(x=>Number.isFinite(x.v));
 if(!no3.length&&!po4.length){el.innerHTML='<div class="empty">Add nitrate or phosphate readings to see nutrient trends.</div>';return}
 const w=700,h=240,left=42,right=48,top=24,bottom=32,n=Math.max(1,clean.length-1);
 const no3Max=Math.max(20,...no3.map(x=>x.v))*1.05;
 const po4Max=Math.max(.12,...po4.map(x=>x.v))*1.05;
 const x=i=>left+(w-left-right)*(i/n),yNo3=v=>h-bottom-(h-top-bottom)*(v/no3Max),yPo4=v=>h-bottom-(h-top-bottom)*(v/po4Max);
 const path=(arr,yfn)=>arr.map((q,j)=>(j?"L":"M")+x(q.i)+","+yfn(q.v)).join(" ");
 let svg=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Nitrate and phosphate trends with target ranges">`;
 for(let i=0;i<=4;i++){const y=top+(h-top-bottom)*i/4;svg+=`<line class="nutrient-grid" x1="${left}" y1="${y}" x2="${w-right}" y2="${y}"/>`;}
 const no3BandTop=yNo3(15),no3BandBottom=yNo3(5);
 const po4BandTop=yPo4(.10),po4BandBottom=yPo4(.03);
 svg+=`<rect x="${left}" y="${no3BandTop}" width="${w-left-right}" height="${Math.max(2,no3BandBottom-no3BandTop)}" fill="rgba(103,184,255,.10)" rx="4"><title>Nitrate target 5–15 ppm</title></rect>`;
 svg+=`<rect x="${left}" y="${po4BandTop}" width="${w-left-right}" height="${Math.max(2,po4BandBottom-po4BandTop)}" fill="rgba(241,200,107,.10)" rx="4"><title>Phosphate target 0.03–0.10 ppm</title></rect>`;
 svg+=`<text class="nutrient-axis-no3" x="${left}" y="14">NO₃ ppm</text><text class="nutrient-axis-po4" text-anchor="end" x="${w-right}" y="14">PO₄ ppm</text>`;
 svg+=`<text class="nutrient-axis-no3" x="4" y="${top+4}">${no3Max.toFixed(1)}</text><text class="nutrient-axis-no3" x="18" y="${h-bottom+4}">0</text>`;
 svg+=`<text class="nutrient-axis-po4" text-anchor="end" x="${w-3}" y="${top+4}">${po4Max.toFixed(3)}</text><text class="nutrient-axis-po4" text-anchor="end" x="${w-18}" y="${h-bottom+4}">0</text>`;
 if(no3.length)svg+=`<path d="${path(no3,yNo3)}" fill="none" stroke="#67b8ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${no3.map(q=>`<circle cx="${x(q.i)}" cy="${yNo3(q.v)}" r="3.5" fill="#67b8ff"><title>${q.date}: NO3 ${q.v} ppm</title></circle>`).join("")}`;
 if(po4.length)svg+=`<path d="${path(po4,yPo4)}" fill="none" stroke="#f1c86b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${po4.map(q=>`<circle cx="${x(q.i)}" cy="${yPo4(q.v)}" r="3.5" fill="#f1c86b"><title>${q.date}: PO4 ${q.v} ppm</title></circle>`).join("")}`;
 const labelIndexes=clean.length<=6?clean.map((_,i)=>i):[0,Math.floor((clean.length-1)/2),clean.length-1];
 [...new Set(labelIndexes)].forEach(i=>{const d=readingDate(clean[i]);if(d)svg+=`<text class="nutrient-date" text-anchor="middle" x="${x(i)}" y="${h-9}">${d.toLocaleDateString([], {month:"short",day:"numeric"})}</text>`});
 svg+='</svg>';el.innerHTML=svg;
}
function readingField(id){return document.getElementById(id)}
function openReadingForm(){
 readingField("readingForm").style.display="block";
 const d=new Date();
 readingField("rDate").value=d.toISOString().slice(0,10);
 readingField("rTime").value=d.toTimeString().slice(0,5);
}
function closeReadingForm(){readingField("readingForm").style.display="none"}
function updateConversion(){
 const ppb=readingField("rPpb");
 const po4=readingField("rPo4");
 po4.value=ppb.value?(Number(ppb.value)*3.066/1000).toFixed(3):"";
}

function inventoryItem(id){return (state.inventory||[]).find(x=>x.id===id)}
function clampInventory(item){
 item.full=Math.max(0,Number(item.full)||0);item.current=Math.max(0,Number(item.current)||0);
 if(item.full>0)item.current=Math.min(item.current,item.full);
}
function setInventoryEvent(eventKey,usages){
 if(!eventKey)return;
 reverseInventoryEvent(eventKey,false);
 const applied=[];
 (usages||[]).forEach(u=>{
  const item=inventoryItem(u.id),amount=Math.max(0,Number(u.amount)||0);
  if(!item||!amount)return;
  item.current=Math.max(0,(Number(item.current)||0)-amount);clampInventory(item);applied.push({id:u.id,amount});
 });
 if(applied.length)state.inventoryEvents[eventKey]=applied;
}
function reverseInventoryEvent(eventKey,deleteKey=true){
 const events=state.inventoryEvents&&state.inventoryEvents[eventKey];
 if(Array.isArray(events))events.forEach(u=>{const item=inventoryItem(u.id);if(item){item.current=(Number(item.current)||0)+(Number(u.amount)||0);clampInventory(item)}});
 if(deleteKey&&state.inventoryEvents)delete state.inventoryEvents[eventKey];
}
function readingInventoryUsages(r){
 const map={alk:"reagent-alk",ca:"reagent-ca",mg:"reagent-mg",no3:"reagent-no3",ppb:"reagent-po4",po4:"reagent-po4"};
 const used=[];
 Object.entries(map).forEach(([key,id])=>{if(hasReadingValue(r[key])&&!used.some(x=>x.id===id))used.push({id,amount:1})});
 return used;
}
function taskInventoryUsages(t){
 const text=`${t.title||""} ${t.details||""} ${t.type||""}`.toLowerCase(),used=[];
 const add=(id,amount)=>{if(amount>0&&!used.some(x=>x.id===id))used.push({id,amount})};
 if(/alkalinity test|test alkalinity/.test(text))add("reagent-alk",1);
 if(/calcium/.test(text))add("reagent-ca",1);
 if(/magnesium/.test(text))add("reagent-mg",1);
 if(/nitrate/.test(text))add("reagent-no3",1);
 if(/phosphate|phosphorus/.test(text))add("reagent-po4",1);
 (state.inventory||[]).forEach(item=>{if(!item.match)return;try{if(new RegExp(item.match,"i").test(text))add(item.id,Number(item.usagePerTask)||0)}catch{}});
 return used;
}
function inventoryPercent(item){return Number(item.full)>0?Math.max(0,Math.min(100,Math.round(Number(item.current)/Number(item.full)*100))):0}
function inventoryStatusClass(p){return p<=15?"critical":p<=35?"low":p<=60?"medium":"good"}
function formatInventoryNumber(v){const n=Number(v)||0;return Number.isInteger(n)?String(n):n.toFixed(2).replace(/0+$/,"").replace(/\.$/,"")}
function saveInventoryItem(id){
 const item=inventoryItem(id);if(!item)return;
 const q=s=>document.querySelector(`[data-inventory-id="${CSS.escape(id)}"] ${s}`);
 const full=Number(q('[data-field="full"]')?.value),current=Number(q('[data-field="current"]')?.value);
 if(!Number.isFinite(full)||full<=0||!Number.isFinite(current)||current<0){alert("Enter a valid full amount and amount remaining.");return}
 item.full=full;item.current=Math.min(current,full);item.unit=q('[data-field="unit"]')?.value.trim()||item.unit;item.expiry=q('[data-field="expiry"]')?.value||"";item.usagePerTask=Math.max(0,Number(q('[data-field="usage"]')?.value)||0);
 persist(true);renderInventory();
}
function adjustInventory(id,delta){const item=inventoryItem(id);if(!item)return;item.current=(Number(item.current)||0)+Number(delta||0);clampInventory(item);persist(true);renderInventory()}
function renderInventory(){
 const container=document.getElementById("inventoryList");if(!container)return;
 const order=["Salt","Test Reagents","Dosing","Filter Media","Food"];
 const categories=[...new Set((state.inventory||[]).map(x=>x.category))].sort((a,b)=>(order.indexOf(a)<0?99:order.indexOf(a))-(order.indexOf(b)<0?99:order.indexOf(b)));
 container.innerHTML=categories.map(cat=>{
  const items=state.inventory.filter(x=>x.category===cat),pct=items.length?Math.round(items.reduce((s,x)=>s+inventoryPercent(x),0)/items.length):0;
  return `<details class="inventory-category category-accordion"><summary><span class="category-title">${escapeHtml(cat)}</span><span class="inventory-category-percent ${inventoryStatusClass(pct)}">${pct}% left</span><span class="accordion-chevron">⌄</span></summary><div class="category-body">${items.map(item=>{
   const p=inventoryPercent(item),expired=item.expiry&&new Date(item.expiry+"T23:59:59")<new Date();
   return `<details class="inventory-product nested-item" data-inventory-id="${escapeHtml(item.id)}"><summary><span>${escapeHtml(item.name)}</span><span class="inventory-inline-percent ${inventoryStatusClass(p)}">${p}%</span><span class="accordion-chevron">⌄</span></summary><div class="inventory-product-body"><div class="inventory-meter"><div class="inventory-meter-fill ${inventoryStatusClass(p)}" style="width:${p}%"></div></div><div class="inventory-balance"><strong>${formatInventoryNumber(item.current)} ${escapeHtml(item.unit)}</strong><span>of ${formatInventoryNumber(item.full)} ${escapeHtml(item.unit)} remaining</span></div>${item.expiry?`<div class="inventory-expiry ${expired?"expired":""}">${expired?"Expired":"Expires"}: ${escapeHtml(item.expiry)}</div>`:""}<div class="inventory-edit-grid"><label>Amount remaining<input data-field="current" type="number" min="0" step="any" value="${Number(item.current)||0}"></label><label>Full amount<input data-field="full" type="number" min="0.01" step="any" value="${Number(item.full)||0}"></label><label>Unit<input data-field="unit" value="${escapeHtml(item.unit)}"></label><label>Expiration date<input data-field="expiry" type="date" value="${escapeHtml(item.expiry||"")}"></label><label>Usage per completed task<input data-field="usage" type="number" min="0" step="any" value="${Number(item.usagePerTask)||0}"></label></div><p class="inventory-note">${escapeHtml(item.note||"")}</p><div class="inventory-actions"><button class="btn primary" onclick="saveInventoryItem('${escapeAttr(item.id)}')">Save product</button><button class="btn" onclick="adjustInventory('${escapeAttr(item.id)}',Number(inventoryItem('${escapeAttr(item.id)}').usagePerTask)||1)">Add one usage</button><button class="btn danger" onclick="adjustInventory('${escapeAttr(item.id)}',-(Number(inventoryItem('${escapeAttr(item.id)}').usagePerTask)||1))">Use one</button></div></div></details>`
  }).join("")}</div></details>`
 }).join("");
}

function saveReading(){
 const r={
  id:Date.now(),
  date:readingField("rDate").value,
  time:readingField("rTime").value,
  alk:num(readingField("rAlk").value),
  ca:num(readingField("rCa").value),
  mg:num(readingField("rMg").value),
  no3:num(readingField("rNo3").value),
  ppb:num(readingField("rPpb").value),
  po4:num(readingField("rPo4").value),
  ph:num(readingField("rPh").value),
  sal:num(readingField("rSal").value),
  temp:num(readingField("rTemp").value),
  afr:num(readingField("rAfr").value),
  notes:readingField("rNotes").value.trim()
 };
 if(!r.date){alert("Please choose a date.");return}
 const measured=[r.alk,r.ca,r.mg,r.no3,r.ppb,r.po4,r.ph,r.sal,r.temp,r.afr].filter(v=>v!==null);
 if(!measured.length){alert("Enter at least one test result before saving.");return}
 if(measured.some(v=>!Number.isFinite(v))){alert("One or more results are not valid numbers.");return}
 state.readings.push(r);
 setInventoryEvent(`reading:${r.id}`,readingInventoryUsages(r));
 persist(true);
 ["rAlk","rCa","rMg","rNo3","rPpb","rPo4","rPh","rSal","rTemp","rAfr","rNotes"].forEach(id=>readingField(id).value="");
 closeReadingForm();
 renderAll();
 showPage("readings");
}
function num(v){if(v==null||String(v).trim()==="")return null;const n=Number(v);return Number.isFinite(n)?n:NaN}
function renderReadings(){
 const rows=[...state.readings].sort((a,b)=>new Date(b.date+"T"+b.time)-new Date(a.date+"T"+a.time));
 document.getElementById("readingRows").innerHTML=rows.length?rows.map(r=>`<tr><td>${r.date}<br><span style="color:var(--muted)">${r.time||""}</span></td><td>${fmt(r.alk,"alk")}</td><td>${fmt(r.ca,"ca")}</td><td>${fmt(r.mg,"mg")}</td><td>${fmt(r.no3,"no3")}</td><td>${fmt(r.ppb,"ppb")}</td><td>${fmt(r.po4,"po4")}</td><td>${fmt(r.ph,"ph")}</td><td>${fmt(r.sal,"sal")}</td><td>${fmt(r.temp,"temp")}</td><td>${r.afr??"—"}</td><td>${r.notes||""}</td><td><button class="btn danger" onclick="deleteReading(${r.id})">Delete</button></td></tr>`).join(""):'<tr><td colspan="13" class="empty">No readings yet.</td></tr>';
}
function deleteReading(id){if(confirm("Delete this reading?")){reverseInventoryEvent(`reading:${id}`);state.readings=state.readings.filter(r=>r.id!==id);persist(true);renderAll()}}
function maintenanceDateLabel(task){
 const d=task.dateObj||new Date(task.date+"T12:00:00");
 const today=localISODate(new Date());
 const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);
 const prefix=task.date===today?"Today":task.date===localISODate(tomorrow)?"Tomorrow":d.toLocaleDateString([], {weekday:"short"});
 return `${prefix} • ${d.toLocaleDateString([], {month:"short",day:"numeric"})}`;
}
function taskHtml(t){
 const encoded=encodeURIComponent(t.id);
 const isDaily=t.type==="Daily check"||/daily reef check/i.test(t.title);
 const observationButton=isDaily?`<button class="btn observation-plus task-observation-button" onclick="event.preventDefault();event.stopPropagation();toggleObservationPanel(true,'${t.date}')">＋ Observation</button>`:"";
 return `<div class="task scheduled-task compact-scheduled ${t.type==="Water change"?"water-change-task":""} ${isDaily?"daily-reef-task":""} ${t.done?"done":""}"><input type="checkbox" ${t.done?"checked":""} onchange="toggleScheduledTask('${encoded}')"><div class="task-copy"><div class="task-title">${t.title}</div><div class="task-meta">${t.details}</div>${observationButton}</div><span class="task-type">${t.type}</span></div>`;
}
function waterChangeDateLabel(date){
 const d=new Date(date+"T12:00:00");
 return Number.isNaN(d.getTime())?date:d.toLocaleDateString([], {month:"short",day:"numeric",year:"numeric"});
}

function tropicMarinSaltEstimate(gallons,ppt=35){
 const g=Number(gallons),target=Number(ppt)||35;
 if(!Number.isFinite(g)||g<=0)return null;
 // Volume estimate: about 1/2 US cup per gallon at 35 ppt, scaled for target salinity.
 const cups=g*0.5*(target/35);
 return {cups,target};
}
function formatSaltCups(cups){
 const rounded=Math.round(Number(cups)*4)/4;
 const whole=Math.floor(rounded);
 const fraction=Math.round((rounded-whole)*4);
 const glyph={1:"¼",2:"½",3:"¾"}[fraction]||"";
 if(!whole&&glyph)return glyph;
 return `${whole}${whole&&glyph?" ":""}${glyph}` || "0";
}
function updateSaltEstimate(){
 const gallons=Number(document.getElementById("waterChangeGallons")?.value);
 const ppt=Number(document.getElementById("saltTargetPpt")?.value||35);
 const primary=document.getElementById("saltEstimatePrimary"),details=document.getElementById("saltEstimateDetails");
 if(!primary||!details)return;
 const estimate=tropicMarinSaltEstimate(gallons,ppt);
 if(!estimate){primary.textContent="—";details.textContent="Enter gallons to calculate cups of salt.";return}
 const cupText=formatSaltCups(estimate.cups);
 primary.textContent=`${cupText} ${Math.abs(estimate.cups-1)<0.001?"cup":"cups"}`;
 details.textContent=`For ${gallons.toFixed(gallons%1?1:0)} gallons at ${ppt} ppt`;
}

function renderWaterChangePlanner(){
 const rec=waterChangeRecommendation(),history=[...(state.waterChanges||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
 const amount=document.getElementById("recommendedWaterAmount"),due=document.getElementById("recommendedWaterDate"),reason=document.getElementById("waterChangeReason"),last=document.getElementById("lastWaterChange"),list=document.getElementById("waterChangeHistory");
 if(amount)amount.textContent=`${rec.gallons} gallons (${rec.percent}%)`;
 if(due)due.textContent=waterChangeDateLabel(rec.date);
 if(reason)reason.textContent=rec.reason;
 if(last)last.textContent=rec.last?`${rec.last.gallons} gallons on ${waterChangeDateLabel(rec.last.date)}`:"No water change logged yet";
 if(list)list.innerHTML=history.length?history.slice(0,8).map(w=>`<div class="water-history-row"><div><strong>${Number(w.gallons)} gallons</strong><span>${waterChangeDateLabel(w.date)}${w.notes?` • ${escapeHtml(w.notes)}`:""}</span></div><button class="btn danger compact" onclick="deleteWaterChange(${Number(w.id)})">Delete</button></div>`).join(""):'<div class="empty compact-empty">No water changes logged yet.</div>';
 const dateInput=document.getElementById("waterChangeDate"),gallonsInput=document.getElementById("waterChangeGallons");
 if(dateInput&&!dateInput.value)dateInput.value=localISODate(new Date());
 if(gallonsInput&&!gallonsInput.value)gallonsInput.value=rec.gallons;
 updateSaltEstimate();
}
function saveWaterChange(){
 const date=document.getElementById("waterChangeDate")?.value;
 const gallons=Number(document.getElementById("waterChangeGallons")?.value);
 const notes=document.getElementById("waterChangeNotes")?.value.trim()||"";
 if(!date){alert("Choose the water-change date.");return}
 if(!Number.isFinite(gallons)||gallons<=0||gallons>65){alert("Enter a water-change amount between 0 and 65 gallons.");return}
 const entry={id:Date.now(),date,gallons:Number(gallons.toFixed(1)),notes};
 state.waterChanges.push(entry);
 const estimate=tropicMarinSaltEstimate(gallons,Number(document.getElementById("saltTargetPpt")?.value||35));
 setInventoryEvent(`water:${entry.id}`,[{id:"salt-tropic-marin",amount:estimate?estimate.cups:0}]);
 persist(true);
 document.getElementById("waterChangeNotes").value="";
 document.getElementById("waterChangeGallons").value="";
 updateSaltEstimate();
 renderAll();
}
function deleteWaterChange(id){
 if(confirm("Delete this water-change entry?")){reverseInventoryEvent(`water:${id}`);state.waterChanges=state.waterChanges.filter(w=>Number(w.id)!==Number(id));persist(true);renderAll()}
}

function observationAdvice(category,subject,details){
 const text=`${category} ${subject} ${details}`.toLowerCase();
 if(/not eating|won't eat|wont eat|sinking|labored|rapid breathing|gasp|white stringy|bulging eye|popeye/.test(text))return "Treat this as a fish-health concern. Verify temperature, salinity, ammonia, and oxygenation first; observe breathing, swimming, appetite, feces, and aggression. Avoid adding medication to the display tank until the cause is narrowed down, and prepare a quarantine tank if symptoms persist or worsen.";
 if(/coral|hammer|frogspawn|octospawn|tissue|recession|bailout|closed|not opening|brown jelly/.test(text))return "Check alkalinity, salinity, temperature, flow, and nearby aggression. Inspect after lights out for pests or tissue damage. Do not make several chemistry changes at once; document the location and take a photo so progression can be compared. Rapid tissue loss or brown-jelly-like material warrants prompt isolation and targeted action.";
 if(/dinoflag|dino|snot|bubbles/.test(text))return "Confirm the identification before treatment. Test nitrate and phosphate, inspect the growth under white light, and avoid driving nutrients to zero. Prioritize stable nutrients, manual removal, fresh mechanical filtration, and appropriate UV only when the suspected type and tank setup support it.";
 if(/cyanobacter|cyano|red slime/.test(text))return "Increase detritus removal and check flow without blasting corals. Test nitrate and phosphate, replace dirty mechanical filtration, siphon mats during a water change, and review feeding and dead spots. Correct the cause before considering chemical treatments.";
 if(/hair algae|green hair|gha|algae/.test(text))return "Test nitrate and phosphate, manually remove what you can, clean detritus traps, verify source water, and review feeding and light exposure. Avoid stripping nutrients to zero; use a gradual nutrient-control plan and track whether the growth is spreading or receding.";
 if(/aiptasia/.test(text))return "Confirm it is Aiptasia, then use a targeted removal method while avoiding tearing or spreading it. Inspect nearby rockwork for smaller individuals and log follow-up checks.";
 if(/vermetid/.test(text))return "Inspect for mucus webs and irritated coral tissue. Physically remove or seal the tube opening where accessible, avoid scattering fragments, and recheck the area during feeding.";
 if(/flatworm|nudibranch|pest|worm/.test(text))return "Photograph and identify the organism before treatment. Inspect affected livestock closely, consider a controlled dip only when appropriate for that animal, and avoid display-wide medication until identification is reasonably certain.";
 if(/leak|overheat|heater|pump stopped|no flow|ato|salinity swing|equipment/.test(text))return "Handle this as an equipment or stability issue. Verify the reading with a second device, protect oxygenation and temperature, inspect cords and connections, and correct changes gradually. Mark the related maintenance task complete only after the equipment has been tested under normal operation.";
 return "Document the observation with a photo if possible, check temperature and salinity, review the most recent test results, and watch whether it improves, stays stable, or worsens over the next 24 hours. Use the relevant scheduled task to guide the next check rather than changing several things at once.";
}
function saveObservation(){
 const observationDate=document.getElementById("observationDate")?.value||localISODate(new Date());
 const category=document.getElementById("observationCategory")?.value||"General";
 const subject=document.getElementById("observationSubject")?.value.trim()||"Tank observation";
 const details=document.getElementById("observationDetails")?.value.trim()||"";
 if(!details){alert("Describe what you observed before saving.");return}
 const recommendation=observationAdvice(category,subject,details);
 state.observations=Array.isArray(state.observations)?state.observations:[];
 state.recommendationHistory=Array.isArray(state.recommendationHistory)?state.recommendationHistory:[];
 const now=new Date();
 const time=`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:00`;
 state.observations.push({id:Date.now(),date:`${observationDate}T${time}`,category,subject,details,recommendation,resolved:false});
 persist(true);
 document.getElementById("observationSubject").value="";
 document.getElementById("observationDetails").value="";
 renderAll();
 toggleObservationPanel(false);
}
function toggleObservationResolved(id){
 const item=(state.observations||[]).find(o=>Number(o.id)===Number(id));if(!item)return;
 item.resolved=!item.resolved;persist(true);renderAll();
}
function deleteObservation(id){
 if(!confirm("Delete this observation?"))return;
 state.observations=(state.observations||[]).filter(o=>Number(o.id)!==Number(id));persist(true);renderAll();
}
function observationSteps(recommendation){
 const parts=String(recommendation||"").split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(Boolean);
 return parts.length?parts.slice(0,6):["Continue observation and record any meaningful change."];
}
function renderObservationTools(latestRecommendation=""){
 const result=document.getElementById("observationResult"),history=document.getElementById("observationHistory"),count=document.getElementById("observationCount");
 if(result){result.innerHTML=latestRecommendation?`<div class="observation-result"><strong>Recommended next steps</strong><p>${escapeHtml(latestRecommendation)}</p></div>`:""}
 if(!history)return;
 const rows=[...(state.observations||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
 if(count)count.textContent=`${rows.length} logged`;
 history.innerHTML=rows.length?rows.map(o=>{
  const q=encodeURIComponent(`${o.subject} ${o.details} reef aquarium`);
  const steps=observationSteps(o.recommendation);
  return `<article class="observation-plan ${o.resolved?"resolved":"active"}">
    <div class="observation-plan-head"><div><span class="observation-status">${o.resolved?"Resolved":"Active"}</span><h4>${escapeHtml(o.subject)}</h4><small>${escapeHtml(o.category)} • ${new Date(o.date).toLocaleString([], {month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"})}</small></div><div class="observation-actions"><button class="btn compact" onclick="toggleObservationResolved(${Number(o.id)})">${o.resolved?"Reopen":"Mark resolved"}</button><button class="btn danger compact" onclick="deleteObservation(${Number(o.id)})">Delete</button></div></div>
    <div class="observation-noted"><strong>What you observed</strong><p>${escapeHtml(o.details)}</p></div>
    <div class="observation-solution"><strong>Recommended solution</strong><p>${escapeHtml(o.recommendation)}</p></div>
    <div class="observation-steps"><strong>Steps to take</strong><ol>${steps.map(step=>`<li>${escapeHtml(step)}</li>`).join("")}</ol></div>
    <div class="research-links"><a target="_blank" rel="noopener" href="https://www.google.com/search?q=site%3Abulkreefsupply.com+${q}">Search BRS</a><a target="_blank" rel="noopener" href="https://www.google.com/search?q=site%3Areef2reef.com+${q}">Search Reef2Reef</a><a target="_blank" rel="noopener" href="https://www.google.com/search?q=${q}">Search web</a></div>
  </article>`;
 }).join(""):'<div class="empty compact-empty">No observations logged yet. Use the + Observation button inside a Daily Reef Check task.</div>';
}
function maintenanceRecommendations(){
 const today=localISODate(new Date());
 const tasks=generatedMaintenanceTasks(7).filter(t=>!t.done);
 const recs=[];
 const add=(icon,title,text,level="warning")=>{if(!recs.some(r=>r.title===title))recs.push({icon,title,text,level})};
 tasks.forEach(t=>{
  if(t.date!==today&&t.type!=="Water change")return;
  if(t.type==="Testing")add("🧪",t.title,t.details,"warning");
  else if(t.type==="Water change")add("💧","Water change due",t.details,"warning");
  else if(t.type==="Filtration")add("🧽",t.title,`${t.details} Check this off after it is completed so this recommendation clears.`,"warning");
  else if(t.type==="Equipment"||t.type==="Safety")add("⚙️",t.title,`${t.details} Check this off after confirming normal operation.`,"warning");
  else if(t.type==="Daily check")add("👁️","Complete today's reef check","Confirm livestock behavior, coral appearance, temperature, flow, ATO, and equipment operation. Log any problem below.","good");
 });
 const activeObs=(state.observations||[]).filter(o=>!o.resolved).sort((a,b)=>new Date(b.date)-new Date(a.date));
 activeObs.slice(0,3).forEach(o=>add("⚠️",`${o.subject}: follow-up`,o.recommendation,"urgent"));
 const water=waterChangeRecommendation();
 if(water.date<=today&&!tasks.some(t=>t.type==="Water change"&&t.done))add("💧",`Consider a ${water.gallons}-gallon water change`,water.reason,"warning");
 if(!recs.length)add("✓","No urgent maintenance recommendations","The currently scheduled tasks are checked off and there are no unresolved observations. Continue normal daily inspection.","good");
 return recs;
}
function recommendationKey(r){return `${r.title}|${r.text}`}
function renderMaintenanceRecommendations(){
 const box=document.getElementById("maintenanceRecommendations"),count=document.getElementById("recommendationCount");if(!box)return;
 const recs=maintenanceRecommendations();
 const previous=Array.isArray(state._lastRecommendationKeys)?state._lastRecommendationKeys:[];
 const current=recs.filter(r=>r.level!=="good").map(recommendationKey);
 previous.filter(k=>!current.includes(k)).forEach(k=>{
  const [title]=k.split("|");
  if(title&&!state.recommendationHistory.some(h=>h.key===k))state.recommendationHistory.unshift({key:k,title,date:new Date().toISOString()});
 });
 state._lastRecommendationKeys=current;
 if(state.recommendationHistory.length>30)state.recommendationHistory=state.recommendationHistory.slice(0,30);
 safeSet("reefRecommendationHistory",JSON.stringify(state.recommendationHistory));
 box.innerHTML=recs.map(r=>`<div class="recommendation-item ${r.level}"><span class="recommendation-icon">${r.icon}</span><div><strong>${escapeHtml(r.title)}</strong><p>${escapeHtml(r.text)}</p><details class="recommendation-why"><summary>Why am I recommending this?</summary><div>${escapeHtml(recommendationReason(r))}</div></details></div></div>`).join("");
 if(count)count.textContent=`${recs.filter(r=>r.level!=="good").length} active`;
 const history=document.getElementById("recommendationHistory");
 if(history)history.innerHTML=state.recommendationHistory.length?state.recommendationHistory.slice(0,12).map(h=>`<div class="recommendation-history-row">✓ ${escapeHtml(h.title)} <span style="color:var(--muted)">• ${new Date(h.date).toLocaleDateString([], {month:"short",day:"numeric"})}</span></div>`).join(""):'<div class="empty compact-empty">No completed recommendations yet.</div>';
}
function recommendationReason(r){
 if(/alkalinity|nitrate|phosphate|calcium|magnesium|salinity|pH|test/i.test(r.title))return `${r.text} The app compares the latest saved reading and test date with the target range and testing interval.`;
 if(/water change/i.test(r.title))return `This is based on your logged water-change amount, the number of days since the last change, and your latest nutrient readings.`;
 if(/follow-up/i.test(r.title))return `This remains active because the linked observation has not been marked resolved.`;
 return `This recommendation is active because its related scheduled task is unchecked or overdue. Checking the task will recalculate the list immediately.`;
}
function toggleObservationPanel(force,date){
 const panel=document.getElementById("observationPanel");if(!panel)return;
 const show=typeof force==="boolean"?force:panel.hasAttribute("hidden");
 if(show){
  panel.removeAttribute("hidden");
  const dateInput=document.getElementById("observationDate");if(dateInput)dateInput.value=date||localISODate(new Date());
  setTimeout(()=>panel.scrollIntoView({behavior:"smooth",block:"start"}),30);
 }else panel.setAttribute("hidden","");
}

function renderTasks(){
 const tasks=generatedMaintenanceTasks(maintenanceWindowDays),list=document.getElementById("taskList");
 const groups={};tasks.forEach(t=>(groups[t.date]||(groups[t.date]=[])).push(t));
 const dates=Object.keys(groups).sort();
 list.innerHTML=dates.length?dates.map((date,index)=>{
  const dayTasks=groups[date],remaining=dayTasks.filter(t=>!t.done).length;
  const dateObj=dayTasks[0].dateObj;
  const label=maintenanceDateLabel(dayTasks[0]);
  return `<details class="maintenance-day"><summary><span>${label}</span><small>${remaining} remaining • ${dayTasks.length} task${dayTasks.length===1?"":"s"}</small></summary><div class="maintenance-day-tasks">${dayTasks.map(taskHtml).join("")}</div></details>`;
 }).join(""):'<div class="empty">No scheduled tasks in this period.</div>';
 const title=document.getElementById("maintenanceWindowTitle"),hint=document.getElementById("maintenanceWindowHint"),button=document.getElementById("maintenanceWindowToggle");
 if(title)title.textContent=maintenanceWindowDays===7?"Next 7 days":"30-day calendar";
 if(hint)hint.textContent=`${tasks.filter(t=>!t.done).length} remaining • Tap a date to expand`;
 if(button)button.textContent=maintenanceWindowDays===7?"View 30-day calendar":"Show next 7 days";
 renderWaterChangePlanner();
}
function toggleScheduledTask(encodedId){
 const id=decodeURIComponent(encodedId),task=generatedMaintenanceTasks(30).find(t=>t.id===id),next=!state.taskCompletions[id];
 state.taskCompletions[id]=next;
 const eventKey=`task:${id}`;
 if(next&&task)setInventoryEvent(eventKey,taskInventoryUsages(task));else reverseInventoryEvent(eventKey);
 persist(true);renderAll();
}
function toggleMaintenanceWindow(){maintenanceWindowDays=maintenanceWindowDays===7?30:7;renderTasks()}
function resetTasks(){
 if(confirm("Clear completed maintenance checks for the next 30 days?")){
  generatedMaintenanceTasks(30).forEach(t=>delete state.taskCompletions[t.id]);persist(true);renderAll();
 }
}
function photoStore(){return safeJson("reefPhotos",{})}
function savePhotoStore(s){return safeSet("reefPhotos",JSON.stringify(s))}
function mediaKey(group,name){return `${group}:${name}`}
function placeholderFor(group,name){
 const n=name.toLowerCase();
 if(group==="livestock"){
   if(n.includes("coral")||n.includes("hammer")||n.includes("frog")||n.includes("octo"))return "🪸";
   if(n.includes("shrimp"))return "🦐";
   if(n.includes("conch")||n.includes("snail"))return "🐚";
   return "🐠";
 }
 if(group==="equipment"){
   if(n.includes("light")||n.includes("radion"))return "💡";
   if(n.includes("heater"))return "🌡️";
   if(n.includes("dosing")||n.includes("kamoer"))return "💧";
   if(n.includes("monitor")||n.includes("seneye"))return "📊";
   return "⚙️";
 }
 return "🧪";
}
function mediaCard(group,name,meta,extra){
 const store=photoStore(),key=mediaKey(group,name),src=store[key];
 const photo=src?`<img src="${src}" alt="${escapeHtml(name)}">`:`<div class="media-placeholder">${placeholderFor(group,name)}</div>`;
 const inputId=`photo-${btoa(unescape(encodeURIComponent(key))).replace(/=/g,"")}`;
 return `<div class="media-card">
   <div class="media-photo">${photo}</div>
   <div class="media-body">
     <h4>${escapeHtml(name)}</h4>
     <div class="media-meta">${escapeHtml(meta)}${extra?`<br>${escapeHtml(extra)}`:""}</div>
     <div class="media-actions">
       <label class="btn primary" for="${inputId}">${src?"Change photo":"Add photo"}</label>
       <input class="photo-input" id="${inputId}" type="file" accept="image/*" capture="environment" onchange="setItemPhoto(event,'${escapeAttr(key)}')">
       ${src?`<button class="btn danger" onclick="removeItemPhoto('${escapeAttr(key)}')">Remove</button>`:""}
     </div>
     <div class="photo-note">Saved only on this device and browser.</div>
   </div>
 </div>`;
}
function setItemPhoto(event,key){
 const file=event.target.files[0]; if(!file)return;
 if(file.size>5*1024*1024){alert("Please choose an image under 5 MB.");event.target.value="";return}
 const reader=new FileReader();
 reader.onload=()=>{const store=photoStore();store[key]=reader.result;const saved=savePhotoStore(store);renderAll();event.target.value="";if(!saved)alert("The photo is available in this open session, but permanent browser storage is blocked.")};
 reader.readAsDataURL(file);
}
function removeItemPhoto(key){const s=photoStore();delete s[key];const saved=savePhotoStore(s);renderAll();if(!saved)alert("The photo was removed for this open session, but permanent browser storage is blocked.")}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function escapeAttr(s){return String(s).replace(/\\/g,"\\\\").replace(/'/g,"\\'")}
function factsHtml(facts){
 return `<div class="fact-grid">${Object.entries(facts).map(([k,v])=>`<div class="fact"><b>${escapeHtml(k.replace(/([A-Z])/g," $1"))}</b><span>${escapeHtml(v)}</span></div>`).join("")}</div>`;
}
function livestockCard(x){
 const custom=photoStore()[mediaKey("livestock",x.name)];
 const wiki=livestockPhotoPages[x.name];
 const src=custom||livestockLocalImages[x.name]||svgData(x.kind,x.name,x.accent);
 const inputId=`photo-${btoa(unescape(encodeURIComponent(mediaKey("livestock",x.name)))).replace(/=/g,"")}`;
 return `<article class="profile-card">
   <div class="profile-image remote-photo"><img data-wiki="${livestockLocalImages[x.name]?"":escapeHtml(wiki||x.scientific||x.name)}" src="${src}" alt="${escapeHtml(x.name)}" onerror="this.onerror=null;this.src=svgData(\'${x.kind}\',\'${escapeAttr(x.name)}\',\'${x.accent}\')"></div>
   <div class="profile-content">
    <div class="profile-kicker">${escapeHtml(x.group)}${x.scientific?` • ${escapeHtml(x.scientific)}`:""}</div>
    <h4>${escapeHtml(x.name)}</h4>
    <div class="profile-summary">${escapeHtml(x.summary)}</div>
    ${factsHtml(x.facts)}
    <details class="details"><summary>Care profile</summary>
      <p><strong>Behavior:</strong> ${escapeHtml(x.behavior)}</p>
      <p><strong>Food:</strong> ${escapeHtml(x.food)}</p>
      <ul>${x.care.map(i=>`<li>${escapeHtml(i)}</li>`).join("")}</ul>
    </details>
    <div class="media-actions">
      <label class="btn primary" for="${inputId}">${custom?"Change your photo":"Add your photo"}</label>
      <input class="photo-input" id="${inputId}" type="file" accept="image/*" capture="environment" onchange="setItemPhoto(event,'${escapeAttr(mediaKey("livestock",x.name))}')">
      ${custom?`<button class="btn danger" onclick="removeItemPhoto('${escapeAttr(mediaKey("livestock",x.name))}')">Use generic image</button>`:""}
    </div>
    <a class="source-link" target="_blank" rel="noopener" href="https://en.wikipedia.org/wiki/${encodeURIComponent(wiki||x.scientific)}">Species reference</a>
    <div class="ref-image-note">Real reference photo loads from Wikipedia/Wikimedia when online. Your own photo always takes priority.</div>
   </div>
 </article>`;
}
function equipmentCard(x){
 const custom=photoStore()[mediaKey("equipment",x.name)];
 const source=equipmentSources[x.name];
 const src=custom||verifiedProductImages[x.name]||svgData("equipment",x.name,x.accent);
 const inputId=`photo-${btoa(unescape(encodeURIComponent(mediaKey("equipment",x.name)))).replace(/=/g,"")}`;
 return `<article class="profile-card">
   <div class="profile-image"><img src="${src}" alt="${escapeHtml(x.name)}" onerror="this.onerror=null;this.src=svgData(\'equipment\',\'${escapeAttr(x.name)}\',\'${x.accent}\')"></div>
   <div class="profile-content">
    <div class="profile-kicker">${escapeHtml(x.group)}</div>
    <h4>${escapeHtml(x.name)}</h4>
    <div class="profile-summary">${escapeHtml(x.summary)}</div>
    ${factsHtml(x.facts)}
    <details class="details"><summary>Equipment notes</summary><p>${escapeHtml(x.details)}</p></details>
    <div class="media-actions">
      <label class="btn primary" for="${inputId}">${custom?"Change your photo":"Add your photo"}</label>
      <input class="photo-input" id="${inputId}" type="file" accept="image/*" capture="environment" onchange="setItemPhoto(event,'${escapeAttr(mediaKey("equipment",x.name))}')">
      ${custom?`<button class="btn danger" onclick="removeItemPhoto('${escapeAttr(mediaKey("equipment",x.name))}')">Use official preview</button>`:""}
    </div>
    ${source?`<a class="source-link" target="_blank" rel="noopener" href="${source}">Open official/product page</a>`:""}
    <div class="ref-image-note">Online preview of the product page; your own photo always takes priority.</div>
   </div>
 </article>`;
}

function loadRemotePhotos(){
 document.querySelectorAll('img[data-wiki]').forEach(img=>{
  const title=img.dataset.wiki;
  if(!title||img.dataset.remoteLoaded||String(img.src).startsWith("data:image")===false)return;
  img.dataset.remoteLoaded="1";
  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
   .then(r=>r.ok?r.json():Promise.reject(new Error("Photo lookup failed")))
   .then(d=>{const url=d.thumbnail&&d.thumbnail.source;if(url)img.src=url})
   .catch(()=>{});
 });
}
function countUnits(items){
 return items.reduce((sum,item)=>sum+(Number(item.facts&&item.facts.Count)||1),0);
}
function accordionItem(item,type){
 const card=type==="livestock"?livestockCard(item):equipmentCard(item);
 const count=Number(item.facts&&item.facts.Count)||1;
 const countText=type==="livestock"?`<span class="item-count">${count}</span>`:"";
 return `<details class="nested-item"><summary><span>${escapeHtml(item.name)}</span>${countText}<span class="accordion-chevron">⌄</span></summary><div class="nested-body">${card}</div></details>`;
}
function categoryAccordion(title,items,type,id=""){
 const count=type==="livestock"?countUnits(items):items.length;
 const noun=type==="livestock"?"total":"devices";
 return `<details class="category-accordion" ${id?`id="${id}"`:""}><summary><span class="category-title">${escapeHtml(title)}</span><span class="category-count">${count} ${noun}</span><span class="accordion-chevron">⌄</span></summary><div class="category-body">${items.map(i=>accordionItem(i,type)).join("")}</div></details>`;
}
function renderLivestockPage(){
 const container=document.getElementById("livestockList");
 if(!container)return;
 const livestockGroups=[
  {key:"Fish",id:"fish-section",title:"Fish"},
  {key:"Invertebrate",id:"invertebrate-section",title:"Invertebrates"},
  {key:"Coral",id:"coral-section",title:"Corals"}
 ];
 container.innerHTML=livestockGroups.map(g=>categoryAccordion(g.title,livestock.filter(x=>x.group===g.key),"livestock",g.id)).join("");
 const totals={
  livestockFishTotal:countUnits(livestock.filter(x=>x.group==="Fish")),
  livestockInvertTotal:countUnits(livestock.filter(x=>x.group==="Invertebrate")),
  livestockCoralTotal:countUnits(livestock.filter(x=>x.group==="Coral"))
 };
 Object.entries(totals).forEach(([id,value])=>{const el=document.getElementById(id);if(el)el.textContent=value});
}
function renderEquipmentPage(){
 const targetsContainer=document.getElementById("targetList");
 if(targetsContainer)targetsContainer.innerHTML=Object.values(targets).map(t=>`<div class="task"><div><div class="task-title">${t.label}</div><div class="task-meta">${t.min}–${t.max} ${t.unit}</div></div></div>`).join("");
 const container=document.getElementById("equipmentList");
 if(!container)return;
 const equipmentOrder=["Lighting","Flow","Filtration","Heating","ATO","Monitoring","Controllers","Electrical","Dosing"];
 const equipmentGroups=[...new Set(equipment.map(x=>x.group))].sort((a,b)=>{
  const ai=equipmentOrder.indexOf(a),bi=equipmentOrder.indexOf(b);return (ai<0?99:ai)-(bi<0?99:bi);
 });
 container.innerHTML=equipmentGroups.map(group=>categoryAccordion(group,equipment.filter(x=>x.group===group),"equipment")).join("");
 renderInventory();
}

function latestForKey(key){
 const rows=[...state.readings].filter(r=>hasReadingValue(r[key])).sort((a,b)=>new Date(b.date+"T"+(b.time||"00:00"))-new Date(a.date+"T"+(a.time||"00:00")));
 return rows[0]||null;
}
function averageForKey(key){
 const vals=state.readings.map(r=>r[key]).filter(hasReadingValue).map(Number);
 return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;
}
function daysSince(dateString){
 if(!dateString)return null;
 return Math.floor((Date.now()-new Date(dateString+"T12:00:00").getTime())/86400000);
}
function testerCard(t){
 const latestRow=latestForKey(t.key);
 const avg=averageForKey(t.key);
 const lastValue=latestRow?latestRow[t.key]:null;
 const customKey=mediaKey("tester",`${t.code} — ${t.name}`);
 const custom=photoStore()[customKey];
 const image=custom||t.image||verifiedTesterImages[t.code]||svgData("tester",t.code,t.accent||"#52d2c7");
 const lastLabel=latestRow?latestRow.date:"Never";
 const count=state.readings.filter(r=>Number.isFinite(Number(r[t.key]))).length;
 return `<article class="tester-card">
   <div class="tester-hero"><img src="${image}" alt="${escapeHtml(t.code+" "+t.name)}" onerror="this.onerror=null;this.src=svgData('tester','${escapeAttr(t.code)}','#52d2c7')"></div>
   <div class="tester-body">
    <span class="tester-code">${escapeHtml(t.code)}</span>
    <h3>${escapeHtml(t.name)}</h3>
    <div class="tester-summary">${escapeHtml(t.summary)}</div>
    <div class="tester-metrics">
      <div class="tester-metric"><b>Latest</b><span>${lastValue==null?"—":fmt(lastValue,t.key)} ${escapeHtml(t.unit)}</span></div>
      <div class="tester-metric"><b>Average</b><span>${avg==null?"—":fmt(avg,t.key)} ${escapeHtml(t.unit)}</span></div>
      <div class="tester-metric"><b>Tests</b><span>${count}</span></div>
      <div class="tester-metric"><b>Last tested</b><span>${escapeHtml(lastLabel)}</span></div>
      <div class="tester-metric"><b>Range</b><span>${escapeHtml(t.range)}</span></div>
      <div class="tester-metric"><b>Reagent</b><span>${escapeHtml(t.reagent)}</span></div>
    </div>
    <div class="tester-section"><h4>Recommended frequency</h4><div class="tester-summary">${escapeHtml(t.frequency)}</div></div>
    <details class="details"><summary>Step-by-step instructions</summary><div class="steps">${t.steps.map(s=>`<div class="step">${escapeHtml(s)}</div>`).join("")}</div></details>
    <details class="details"><summary>Accuracy tips</summary><ul>${t.tips.map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul></details>
    <details class="details"><summary>Common mistakes</summary><div class="warning-list">${t.mistakes.map(x=>`<div class="warning-item">⚠ ${escapeHtml(x)}</div>`).join("")}</div></details>
    <div class="quick-actions">
      <button class="btn primary" onclick="showPage('readings');openReadingForm()">Log reading</button>
      <label class="btn">Use your photo<input class="photo-input" type="file" accept="image/*" capture="environment" onchange="setItemPhoto(event,'${escapeAttr(customKey)}')"></label>
      ${custom?`<button class="btn danger" onclick="removeItemPhoto('${escapeAttr(customKey)}')">Restore product photo</button>`:""}
    </div>
   </div>
  </article>`;
}
function renderTesters(){
 const list=document.getElementById("testerList");
 list.innerHTML=testers.map(testerCard).join("");
 const sessions=state.readings.length;
 document.getElementById("testsLogged").textContent=sessions;
 const sorted=[...state.readings].sort((a,b)=>new Date(b.date+"T"+(b.time||"00:00"))-new Date(a.date+"T"+(a.time||"00:00")));
 document.getElementById("lastTestDate").textContent=sorted[0]?sorted[0].date:"—";
 const priorities=testers.map(t=>({t,last:latestForKey(t.key),days:daysSince(latestForKey(t.key)?.date)}));
 priorities.sort((a,b)=>(b.days??9999)-(a.days??9999));
 document.getElementById("recommendedTest").textContent=priorities[0]?.t.code||"Alk";
}
function exportData(){
 const bundle={version:2,exportedAt:new Date().toISOString(),readings:state.readings,tasks:state.tasks,taskCompletions:state.taskCompletions,waterChanges:state.waterChanges,serviceHistory:state.serviceHistory,observations:state.observations,photos:photoStore()};
 const blob=new Blob([JSON.stringify(bundle,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="aquarium-hub-backup.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function importData(e){
 const input=e.target,f=input.files&&input.files[0];if(!f)return;
 const rd=new FileReader();
 rd.onload=()=>{try{
  const d=JSON.parse(rd.result);
  if(!d||!Array.isArray(d.readings))throw new Error("Invalid backup format");
  state.readings=d.readings;state.tasks=Array.isArray(d.tasks)?d.tasks:[];
  if(d.taskCompletions&&typeof d.taskCompletions==="object")state.taskCompletions=d.taskCompletions;
  if(Array.isArray(d.waterChanges))state.waterChanges=d.waterChanges;
  if(d.serviceHistory&&typeof d.serviceHistory==="object")state.serviceHistory=d.serviceHistory;
  if(Array.isArray(d.observations))state.observations=d.observations;
  if(d.photos&&typeof d.photos==="object")savePhotoStore(d.photos);
  persist(true);renderAll();alert("Backup imported.");
 }catch(err){console.error(err);alert("That file is not a valid Aquarium Hub backup.")}finally{input.value=""}};
 rd.onerror=()=>{alert("That backup file could not be read.");input.value=""};
 rd.readAsText(f);
}
function renderAll(){
 renderDashboard();
 renderReadings();
 renderTasks();
 renderObservationTools();
 renderMaintenanceRecommendations();
 renderLivestockPage();
 renderEquipmentPage();
 renderTesters();
 loadRemotePhotos();
}
function appSelfCheck(){
 const required=["dashboard","readings","maintenance","livestock","equipment","testers","kpis","readingForm","readingRows","taskList","livestockList","equipmentList","testerList","healthScore"];
 const missing=required.filter(id=>!document.getElementById(id));
 const pageParents=[...document.querySelectorAll("main > section.page")].map(page=>page.id);
 return {ok:missing.length===0&&pageParents.length===pages.length,missing,pages:pageParents,readings:state.readings.length,tasks:state.tasks.length};
}
try{initNav();renderAll();window.AquariumHub={showPage,goToSection,saveReading,renderAll,renderInventory,saveInventoryItem,appSelfCheck,state}}catch(err){console.error("Aquarium Hub failed to initialize:",err);alert("Aquarium Hub could not finish loading. Please reload the page.")}
