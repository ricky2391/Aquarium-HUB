
const pages=[["dashboard","Dashboard"],["readings","Readings"],["maintenance","Maintenance"],["tank","Tank"],["testers","Testers"]];

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
 alk:{label:"Alkalinity",unit:"dKH",min:7,max:9,key:"alk"},
 ca:{label:"Calcium",unit:"ppm",min:400,max:460,key:"ca"},
 mg:{label:"Magnesium",unit:"ppm",min:1280,max:1420,key:"mg"},
 no3:{label:"Nitrate",unit:"ppm",min:5,max:15,key:"no3"},
 po4:{label:"Phosphate",unit:"ppm",min:.03,max:.10,key:"po4"},
 ph:{label:"pH",unit:"",min:7.9,max:8.4,key:"ph"},
 sal:{label:"Salinity",unit:"ppt",min:34,max:36,key:"sal"},
 temp:{label:"Temperature",unit:"°F",min:76,max:79,key:"temp"}
};
const defaultTasks=[
 {title:"25-gallon water change",meta:"Sunday • Match temperature and salinity; test full panel 1–2 hours later"},
 {title:"Alkalinity test",meta:"Monday • Same time of day"},
 {title:"MicroBacter7 — 6.5 mL",meta:"Monday • Shake well; skimmer/UV off 4 hours"},
 {title:"Alkalinity test",meta:"Wednesday • Same time of day"},
 {title:"MicroBacter CLEAN — 52 mL",meta:"Wednesday • Dilute in ~8 oz tank water; skimmer/UV off 4 hours"},
 {title:"Equipment inspection",meta:"Friday • ATO, pumps, skimmer, reactor, dosing line"},
 {title:"Full panel",meta:"Saturday • Alk, Ca, Mg, NO3, PO4, pH, salinity, temperature"},
 {title:"Weekly maintenance",meta:"Saturday • Glass, floss, skimmer cup, baste rocks"}
];
const livestock=[
{group:"Fish",name:"Darwin ocellaris clownfish",scientific:"Amphiprion ocellaris",kind:"fish",accent:"#8f98a3",summary:"A hardy clownfish known for its dark coloration and strong pair-bonding behavior.",facts:{Temperament:"Semi-aggressive",Diet:"Omnivore",AdultSize:"3–4 in",Lifespan:"10–20+ years",Growth:"Moderate",Zone:"Midwater / chosen territory"},behavior:"Pairs often establish a preferred corner, coral, or rock as a territory. The larger fish becomes female and may keep the smaller male at a respectful distance.",food:"Offer quality marine pellets, mysis, finely chopped seafood, and occasional enriched frozen foods. Feed small portions once or twice daily.",care:["Reef-safe with corals","May become territorial near a host coral or spawning site","Watch for bullying of a smaller mate","Stable salinity and temperature are more important than chasing exact numbers"]},
{group:"Fish",name:"Snowflake ocellaris clownfish",scientific:"Amphiprion ocellaris",kind:"fish",accent:"#f4f4f4",summary:"A designer-pattern ocellaris clownfish with the same general care as standard ocellaris.",facts:{Temperament:"Semi-aggressive",Diet:"Omnivore",AdultSize:"3–4 in",Lifespan:"10–20+ years",Growth:"Moderate",Zone:"Midwater / territory"},behavior:"Usually stays close to its mate and may show submissive twitching toward the larger female. It can sleep near a coral, powerhead, or tank corner.",food:"Pellets, flakes, mysis, brine shrimp, chopped marine foods, and occasional enriched frozen fare.",care:["Reef-safe","Pairs can spawn in mature aquariums","The male is usually smaller","Avoid overfeeding rich frozen foods"]},
{group:"Fish",name:"Blue-green chromis ×2",scientific:"Chromis viridis",kind:"fish",accent:"#58c7d8",summary:"Active open-water planktivores that add movement to the upper half of the aquarium.",facts:{Temperament:"Peaceful to conspecific-aggressive",Diet:"Planktivore / omnivore",AdultSize:"3–4 in",Lifespan:"5–10+ years",Growth:"Moderate",Zone:"Open water"},behavior:"They school loosely when comfortable, but small groups can develop a dominance hierarchy. A weaker fish may hide, stop eating, or remain near the bottom.",food:"Small pellets, flakes, mysis, calanus, copepod-sized frozen foods, and frequent small meals.",care:["Feed small portions more than once daily when possible","Monitor for one fish being excluded","Good oxygenation is important","White stringy feces and sinking behavior warrant close observation"]},
{group:"Fish",name:"Yellow tang",scientific:"Zebrasoma flavescens",kind:"fish",accent:"#f2d447",summary:"A constantly grazing herbivore that helps control film and filamentous algae.",facts:{Temperament:"Semi-aggressive",Diet:"Herbivore / omnivore",AdultSize:"7–8 in",Lifespan:"20–30+ years",Growth:"Moderate",Zone:"Entire rockwork"},behavior:"Spends much of the day patrolling rockwork and picking at algae. It may defend the tank from similarly shaped tangs.",food:"Provide nori or other marine algae regularly, spirulina-based foods, and supplemental pellets or frozen foods.",care:["Needs substantial swimming room as it grows","Offer algae daily","Watch for marine ich and HLLE","A varied diet helps maintain body condition and color"]},
{group:"Fish",name:"Banggai cardinalfish ×3",scientific:"Pterapogon kauderni",kind:"fish",accent:"#d8dce2",summary:"Slow-moving cardinalfish with bold black bands and long fins.",facts:{Temperament:"Peaceful, pair-forming",Diet:"Carnivore",AdultSize:"3 in",Lifespan:"5–8+ years",Growth:"Moderate",Zone:"Midwater / sheltered areas"},behavior:"Often hover in place near structure. As they mature, pairs can form and may become aggressive toward an unpaired third fish.",food:"Mysis, finely chopped seafood, enriched brine shrimp, and small sinking pellets.",care:["Observe for pair formation and exclusion","Mouthbrooding males may refuse food","Prefer calmer flow pockets","Can be slow eaters beside aggressive feeders"]},
{group:"Fish",name:"Lawnmower blenny",scientific:"Salarias fasciatus",kind:"fish",accent:"#9a8a70",summary:"A benthic grazer with expressive behavior and a strong preference for natural algae films.",facts:{Temperament:"Generally peaceful",Diet:"Herbivore / detritivore",AdultSize:"5 in",Lifespan:"4–8 years",Growth:"Moderate",Zone:"Rockwork / bottom"},behavior:"Perches on rocks, hops short distances, and spends the day rasping algae from hard surfaces.",food:"Natural film algae, nori attached to rock, spirulina foods, algae wafers, and occasional prepared blends.",care:["A pinched belly suggests inadequate food intake","Not all individuals accept prepared foods quickly","Requires mature rockwork","May nip clam mantles or fleshy corals when underfed"]},
{group:"Invertebrate",name:"Tiger pistol shrimp",scientific:"Alpheus bellulus",kind:"shrimp",accent:"#f1a55b",summary:"A burrowing shrimp known for its loud snapping claw and goby partnerships.",facts:{Temperament:"Territorial burrower",Diet:"Omnivore",AdultSize:"2–3 in",Lifespan:"3–5+ years",Growth:"Molts periodically",Zone:"Sand / rock base"},behavior:"Excavates tunnels, moves sand, and reinforces burrows with rubble. Its snap can sound startling but is normal.",food:"Leftover meaty foods, sinking pellets, small pieces of shrimp or fish, and natural detritus.",care:["Secure rockwork on the tank bottom","Expect sand movement","Provide rubble for burrow building","Compatible gobies may form a symbiotic pair"]},
{group:"Invertebrate",name:"Skunk cleaner shrimp",scientific:"Lysmata amboinensis",kind:"shrimp",accent:"#f8f1e4",summary:"A visible cleaner shrimp that may service fish and scavenge leftover foods.",facts:{Temperament:"Peaceful",Diet:"Omnivore",AdultSize:"2–3 in",Lifespan:"2–4 years",Growth:"Molts regularly",Zone:"Caves / ledges"},behavior:"Often establishes a cleaning station and waves its antennae to attract fish. It may steal food from corals.",food:"Small pieces of marine meat, pellets, mysis, and scavenged leftovers.",care:["Needs stable salinity","Sensitive during and after molting","Provide hiding places","Avoid medications containing copper"]},
{group:"Invertebrate",name:"Tiger conch",scientific:"Conomurex luhuanus",kind:"shell",accent:"#c99457",summary:"A sand-surface grazer that helps consume films and detritus.",facts:{Temperament:"Peaceful",Diet:"Herbivore / detritivore",AdultSize:"3–4 in",Lifespan:"Several years",Growth:"Slow to moderate",Zone:"Sandbed"},behavior:"Moves with a distinctive hopping motion and may bury partially in the sand.",food:"Diatoms, microalgae, detritus, and supplemental algae-based foods if the sandbed is too clean.",care:["Needs open sand area","Avoid starving in an ultra-clean tank","Can right itself better than many snails","Watch for predatory hermits"]},
{group:"Coral",name:"Branching hammer coral",scientific:"Fimbriaphyllia paraancora",kind:"coral",accent:"#66d68f",summary:"A fleshy LPS coral with hammer-shaped tentacle tips and moderate growth.",facts:{Temperament:"Aggressive",Diet:"Photosynthetic + plankton",AdultSize:"Expanding colony",Lifespan:"Many years",Growth:"Moderate",Zone:"Lower to middle reef"},behavior:"Inflates during the day and may extend long sweeper tentacles after lights-out.",food:"Primarily photosynthetic; optional small meaty or powdered coral foods can support growth.",care:["Moderate, indirect flow","Moderate lighting","Leave several inches from neighboring corals","Watch for brown jelly, tissue recession, and exposed skeleton"]},
{group:"Coral",name:"Frogspawn coral",scientific:"Fimbriaphyllia divisa / paradivisa",kind:"coral",accent:"#83d476",summary:"A flowing LPS coral with branching or wall-form growth and rounded tentacle tips.",facts:{Temperament:"Aggressive",Diet:"Photosynthetic + plankton",AdultSize:"Expanding colony",Lifespan:"Many years",Growth:"Moderate",Zone:"Lower to middle reef"},behavior:"Displays long, swaying tentacles and can sting nearby corals with sweepers.",food:"Light-driven nutrition plus optional small particle foods or finely chopped meaty foods.",care:["Avoid blasting flow","Keep stable alkalinity and salinity","Provide spacing from non-Euphyllia neighbors","Inspect new tissue for recession or pests"]},
{group:"Coral",name:"Octospawn coral",scientific:"Fimbriaphyllia species",kind:"coral",accent:"#b78bf1",summary:"A fleshy Euphyllia-type LPS coral with many-tipped tentacles and strong visual movement.",facts:{Temperament:"Aggressive",Diet:"Photosynthetic + plankton",AdultSize:"Expanding colony",Lifespan:"Many years",Growth:"Moderate",Zone:"Lower to middle reef"},behavior:"Expands broadly when comfortable and retracts when irritated by flow, pests, or unstable chemistry.",food:"Mostly photosynthetic, with optional occasional feeding of small coral foods.",care:["Moderate lighting and gentle random flow","Keep away from sensitive neighbors","Stable alkalinity is especially important","Handle only by the skeleton"]}
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
 "Darwin ocellaris clownfish":"Amphiprion_ocellaris",
 "Snowflake ocellaris clownfish":"Amphiprion_ocellaris",
 "Blue-green chromis ×2":"Chromis_viridis",
 "Yellow tang":"Yellow_tang",
 "Banggai cardinalfish ×3":"Banggai_cardinalfish",
 "Lawnmower blenny":"Salarias_fasciatus",
 "Tiger pistol shrimp":"Alpheus_bellulus",
 "Skunk cleaner shrimp":"Lysmata_amboinensis",
 "Tiger conch":"Conomurex_luhuanus",
 "Branching hammer coral":"Fimbriaphyllia_paraancora",
 "Frogspawn coral":"Euphyllia_divisa",
 "Octospawn coral":"Euphyllia"
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
function pagePreview(url){return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=900`;}

const testers=[
{code:"HI772",name:"Marine Alkalinity Checker",kind:"tester",accent:"#52d2c7",summary:"Measures alkalinity directly in dKH.",workflow:"Fill a clean cuvette to 10 mL, zero as C1, add exactly 1 mL reagent, invert gently, wipe the cuvette, and read C2.",tips:"Use a dedicated 1 mL syringe, keep bubbles out, and test at the same time of day."},
{code:"HI758U",name:"Marine Calcium Checker",kind:"tester",accent:"#67b8ff",summary:"Measures calcium in ppm using a very small sample volume.",workflow:"Prepare the C1 blank with reagent A and RODI, zero the checker, add exactly 0.1 mL tank water, add reagent B, mix, and read.",tips:"The 0.1 mL tank sample is the critical step. Use a clean dedicated pipette tip."},
{code:"HI783",name:"Marine Magnesium Checker",kind:"tester",accent:"#b78bf1",summary:"Measures magnesium in ppm.",workflow:"Follow the current reagent-kit sequence for the C1 blank and C2 sample.",tips:"Use the quick guide supplied with the reagent lot because component order can differ between versions."},
{code:"HI782",name:"Marine Nitrate High Range Checker",kind:"tester",accent:"#f1c86b",summary:"Measures nitrate in ppm in a range suitable for many reef aquariums.",workflow:"Zero a 10 mL sample, add the reagent packet, mix for the specified time, and run the timed reading.",tips:"Fully dissolve the reagent and avoid fingerprints or microbubbles."},
{code:"HI736",name:"Phosphorus Ultra Low Range Checker",kind:"tester",accent:"#7fd3a3",summary:"Reads phosphorus in ppb; the app converts it automatically to phosphate ppm.",workflow:"Zero a 10 mL sample, add the packet, shake for 2 minutes, then use the 3-minute timed reading.",tips:"Phosphate ppm = phosphorus ppb × 3.066 ÷ 1000. Example: 20 ppb phosphorus = 0.061 ppm phosphate."},
{code:"HI780",name:"Marine pH Tester",kind:"tester",accent:"#ff927e",summary:"Digital pH probe for spot checks.",workflow:"Rinse with RODI, blot gently, immerse in a sample, and wait for a stable result.",tips:"Keep the probe hydrated and calibrate with fresh buffer solutions."},
{code:"HI98319",name:"Marine Salinity Tester",kind:"tester",accent:"#68d9e8",summary:"Digital salinity meter that can display ppt or specific gravity.",workflow:"Rinse the probe, immerse in the sample, stir gently, and wait for the result to stabilize.",tips:"Calibrate with 35.00 ppt standard and make sure no bubbles cling to the probe."}
];

let state={
 readings:JSON.parse(localStorage.getItem("reefReadings")||"[]"),
 tasks:JSON.parse(localStorage.getItem("reefTasks")||JSON.stringify(defaultTasks.map((x,i)=>({...x,done:false,id:i})))),
};
function persist(){localStorage.setItem("reefReadings",JSON.stringify(state.readings));localStorage.setItem("reefTasks",JSON.stringify(state.tasks))}
function showPage(id){
 document.querySelectorAll(".page").forEach(x=>x.classList.toggle("active",x.id===id));
 document.querySelectorAll("[data-page]").forEach(x=>x.classList.toggle("active",x.dataset.page===id));
 window.scrollTo({top:0,behavior:"smooth"});
}
function initNav(){
 ["nav","mobileTabs"].forEach(cid=>{const c=document.getElementById(cid);pages.forEach(([id,label])=>{const b=document.createElement("button");b.textContent=label;b.dataset.page=id;b.onclick=()=>showPage(id);if(id==="dashboard")b.classList.add("active");c.appendChild(b)})});
}
function latest(){return [...state.readings].sort((a,b)=>new Date(b.date+"T"+b.time)-new Date(a.date+"T"+a.time))[0]||null}
function mean(key){const v=state.readings.map(r=>Number(r[key])).filter(Number.isFinite);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null}
function fmt(v,key){if(v==null||v==="")return "—";if(key==="po4")return Number(v).toFixed(3);if(["alk","ph","sal","temp"].includes(key))return Number(v).toFixed(2).replace(/0+$/,"").replace(/\.$/,"");return Math.round(v)}
function statusClass(v,t){if(v==null)return "";return v>=t.min&&v<=t.max?"good":(v<t.min*.9||v>t.max*1.1?"bad":"warn")}
function renderDashboard(){
 const l=latest(); const k=document.getElementById("kpis");k.innerHTML="";
 Object.values(targets).forEach(t=>{const v=l?l[t.key]:null;const c=document.createElement("div");c.className="card kpi";c.innerHTML=`<div class="label">${t.label}</div><div class="value ${statusClass(v,t)}">${fmt(v,t.key)}</div><div class="sub">${t.unit} • target ${t.min}–${t.max}</div>`;k.appendChild(c)});
 const ok=l&&Object.values(targets).every(t=>{const v=Number(l[t.key]);return Number.isFinite(v)&&v>=t.min&&v<=t.max});
 const sb=document.getElementById("statusBadge");sb.textContent=!l?"Waiting for readings":ok?"All latest readings in range":"Review latest readings";sb.className="badge "+(!l?"gold":ok?"":"coral");
 document.getElementById("averages").innerHTML=Object.values(targets).map(t=>`<div class="task"><div><div class="task-title">${t.label}</div><div class="task-meta">${fmt(mean(t.key),t.key)} ${t.unit} average</div></div></div>`).join("");
 const pending=state.tasks.filter(t=>!t.done).slice(0,5);document.getElementById("dashboardTasks").innerHTML=pending.length?pending.map(taskHtml).join(""):'<div class="empty">All tasks complete.</div>';document.getElementById("taskCount").textContent=`${state.tasks.filter(t=>!t.done).length} remaining`;
 document.getElementById("currentAfr").textContent=l&&l.afr?`${l.afr} mL/day`:"Not set";
 drawLine("alkChart",state.readings.slice(-14).map((r,i)=>({x:i,y:Number(r.alk),label:r.date})).filter(p=>Number.isFinite(p.y)),["#52d2c7"]);
 drawMulti("nutrientChart",state.readings.slice(-14),[{key:"no3",color:"#67b8ff",scale:1},{key:"po4",color:"#f1c86b",scale:100}]);
}
function drawLine(id,pts,colors){
 const el=document.getElementById(id);if(!pts.length){el.innerHTML='<div class="empty">Add readings to see a trend.</div>';return}
 const w=700,h=240,p=30,ys=pts.map(x=>x.y),min=Math.min(...ys),max=Math.max(...ys),span=max-min||1;
 const x=i=>p+(w-2*p)*(i/Math.max(1,pts.length-1)), y=v=>h-p-(h-2*p)*((v-min)/span);
 const path=pts.map((pt,i)=>(i?"L":"M")+x(i)+","+y(pt.y)).join(" ");
 el.innerHTML=`<svg viewBox="0 0 ${w} ${h}"><line class="axis" x1="${p}" y1="${h-p}" x2="${w-p}" y2="${h-p}"/><line class="axis" x1="${p}" y1="${p}" x2="${p}" y2="${h-p}"/><path d="${path}" class="line"/>${pts.map((pt,i)=>`<circle class="dot" cx="${x(i)}" cy="${y(pt.y)}" r="4"><title>${pt.label}: ${pt.y}</title></circle>`).join("")}<text class="labeltxt" x="${p}" y="18">${max.toFixed(2)}</text><text class="labeltxt" x="${p}" y="${h-5}">${min.toFixed(2)}</text></svg>`;
}
function drawMulti(id,rows,series){
 const pts=rows.map((r,i)=>({i,...r}));const vals=[];series.forEach(s=>pts.forEach(p=>{const v=Number(p[s.key]);if(Number.isFinite(v))vals.push(v*s.scale)}));
 const el=document.getElementById(id);if(!vals.length){el.innerHTML='<div class="empty">Add nitrate and phosphorus readings.</div>';return}
 const w=700,h=240,p=30,min=0,max=Math.max(...vals,1),x=i=>p+(w-2*p)*(i/Math.max(1,pts.length-1)),y=v=>h-p-(h-2*p)*(v/max);
 let svg=`<svg viewBox="0 0 ${w} ${h}"><line class="axis" x1="${p}" y1="${h-p}" x2="${w-p}" y2="${h-p}"/>`;
 series.forEach(s=>{const valid=pts.map((pt,i)=>({i,v:Number(pt[s.key])*s.scale,date:pt.date})).filter(q=>Number.isFinite(q.v));if(valid.length){svg+=`<path d="${valid.map((q,j)=>(j?"L":"M")+x(q.i)+","+y(q.v)).join(" ")}" fill="none" stroke="${s.color}" stroke-width="3"/>`}});
 svg+=`<text class="labeltxt" x="${p}" y="18">NO₃ ppm • PO₄ ×100</text></svg>`;el.innerHTML=svg;
}
function openReadingForm(){document.getElementById("readingForm").style.display="block";const d=new Date();rDate.value=d.toISOString().slice(0,10);rTime.value=d.toTimeString().slice(0,5)}
function closeReadingForm(){document.getElementById("readingForm").style.display="none"}
function updateConversion(){rPo4.value=rPpb.value?(Number(rPpb.value)*3.066/1000).toFixed(3):""}
function saveReading(){
 const r={id:Date.now(),date:rDate.value,time:rTime.value,alk:num(rAlk.value),ca:num(rCa.value),mg:num(rMg.value),no3:num(rNo3.value),ppb:num(rPpb.value),po4:num(rPo4.value),ph:num(rPh.value),sal:num(rSal.value),temp:num(rTemp.value),afr:num(rAfr.value),notes:rNotes.value};
 if(!r.date){alert("Please choose a date.");return} state.readings.push(r);persist();closeReadingForm();renderAll();
}
function num(v){return v===""?null:Number(v)}
function renderReadings(){
 const rows=[...state.readings].sort((a,b)=>new Date(b.date+"T"+b.time)-new Date(a.date+"T"+a.time));
 document.getElementById("readingRows").innerHTML=rows.length?rows.map(r=>`<tr><td>${r.date}<br><span style="color:var(--muted)">${r.time||""}</span></td><td>${fmt(r.alk,"alk")}</td><td>${fmt(r.ca,"ca")}</td><td>${fmt(r.mg,"mg")}</td><td>${fmt(r.no3,"no3")}</td><td>${fmt(r.ppb,"ppb")}</td><td>${fmt(r.po4,"po4")}</td><td>${fmt(r.ph,"ph")}</td><td>${fmt(r.sal,"sal")}</td><td>${fmt(r.temp,"temp")}</td><td>${r.afr??"—"}</td><td>${r.notes||""}</td><td><button class="btn danger" onclick="deleteReading(${r.id})">Delete</button></td></tr>`).join(""):'<tr><td colspan="13" class="empty">No readings yet.</td></tr>';
}
function deleteReading(id){if(confirm("Delete this reading?")){state.readings=state.readings.filter(r=>r.id!==id);persist();renderAll()}}
function taskHtml(t){return `<div class="task ${t.done?"done":""}"><input type="checkbox" ${t.done?"checked":""} onchange="toggleTask(${t.id})"><div><div class="task-title">${t.title}</div><div class="task-meta">${t.meta}</div></div></div>`}
function renderTasks(){document.getElementById("taskList").innerHTML=state.tasks.map(taskHtml).join("")}
function toggleTask(id){const t=state.tasks.find(x=>x.id===id);if(t)t.done=!t.done;persist();renderAll()}
function resetTasks(){state.tasks=defaultTasks.map((x,i)=>({...x,done:false,id:i}));persist();renderAll()}
function photoStore(){return JSON.parse(localStorage.getItem("reefPhotos")||"{}")}
function savePhotoStore(s){localStorage.setItem("reefPhotos",JSON.stringify(s))}
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
 reader.onload=()=>{const store=photoStore();store[key]=reader.result;savePhotoStore(store);renderAll()};
 reader.readAsDataURL(file);
}
function removeItemPhoto(key){const s=photoStore();delete s[key];savePhotoStore(s);renderAll()}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function escapeAttr(s){return String(s).replace(/\\/g,"\\\\").replace(/'/g,"\\'")}
function factsHtml(facts){
 return `<div class="fact-grid">${Object.entries(facts).map(([k,v])=>`<div class="fact"><b>${escapeHtml(k.replace(/([A-Z])/g," $1"))}</b><span>${escapeHtml(v)}</span></div>`).join("")}</div>`;
}
function livestockCard(x){
 const custom=photoStore()[mediaKey("livestock",x.name)];
 const wiki=livestockPhotoPages[x.name];
 const src=custom||svgData(x.kind,x.name,x.accent);
 const inputId=`photo-${btoa(unescape(encodeURIComponent(mediaKey("livestock",x.name)))).replace(/=/g,"")}`;
 return `<article class="profile-card">
   <div class="profile-image remote-photo"><img data-wiki="${escapeHtml(wiki||"")}" class="${custom?"":"loading"}" src="${src}" alt="${escapeHtml(x.name)}"></div>
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
    <a class="source-link" target="_blank" rel="noopener" href="https://en.wikipedia.org/wiki/${encodeURIComponent(wiki||x.scientific)}">Photo/source details</a>
    <div class="ref-image-note">Real reference photo loads from Wikipedia/Wikimedia when online. Your own photo always takes priority.</div>
   </div>
 </article>`;
}
function equipmentCard(x){
 const custom=photoStore()[mediaKey("equipment",x.name)];
 const source=equipmentSources[x.name];
 const src=custom||(source?pagePreview(source):svgData("equipment",x.name,x.accent));
 const inputId=`photo-${btoa(unescape(encodeURIComponent(mediaKey("equipment",x.name)))).replace(/=/g,"")}`;
 return `<article class="profile-card">
   <div class="profile-image"><img src="${src}" alt="${escapeHtml(x.name)}"></div>
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
function testerCard(t){
 const key=mediaKey("tester",`${t.code} — ${t.name}`),custom=photoStore()[key],source=testerSources[t.code],src=custom||(source?pagePreview(source):svgData("tester",t.code,t.accent));
 const inputId=`photo-${btoa(unescape(encodeURIComponent(key))).replace(/=/g,"")}`;
 return `<article class="profile-card">
  <div class="profile-image"><img src="${src}" alt="${escapeHtml(t.code+" "+t.name)}"></div>
  <div class="profile-content">
    <div class="profile-kicker">${escapeHtml(t.code)}</div>
    <h4>${escapeHtml(t.name)}</h4>
    <div class="profile-summary">${escapeHtml(t.summary)}</div>
    <details class="details" open><summary>Quick instructions</summary>
      <p><strong>Workflow:</strong> ${escapeHtml(t.workflow)}</p>
      <p><strong>Accuracy tips:</strong> ${escapeHtml(t.tips)}</p>
    </details>
    <div class="media-actions">
      <label class="btn primary" for="${inputId}">${custom?"Change your photo":"Add your photo"}</label>
      <input class="photo-input" id="${inputId}" type="file" accept="image/*" capture="environment" onchange="setItemPhoto(event,'${escapeAttr(key)}')">
      ${custom?`<button class="btn danger" onclick="removeItemPhoto('${escapeAttr(key)}')">Use official preview</button>`:""}
    </div>
    ${source?`<a class="source-link" target="_blank" rel="noopener" href="${source}">Open Hanna product page</a>`:""}
    <div class="ref-image-note">Online preview of the official Hanna page; your own photo always takes priority.</div>
  </div>
 </article>`;
}
function loadLivestockPhotos(){
 document.querySelectorAll('img[data-wiki]').forEach(img=>{
  const title=img.dataset.wiki;if(!title||img.dataset.loaded)return;
  img.dataset.loaded='1';
  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
   .then(r=>r.ok?r.json():Promise.reject())
   .then(d=>{const u=d.thumbnail&&d.thumbnail.source;if(u){img.src=u;img.classList.remove('loading')}})
   .catch(()=>img.classList.remove('loading'));
 });
}
function renderTank(){
 document.getElementById("targetList").innerHTML=Object.values(targets).map(t=>`<div class="task"><div><div class="task-title">${t.label}</div><div class="task-meta">${t.min}–${t.max} ${t.unit}</div></div></div>`).join("");
 document.getElementById("livestock").innerHTML=livestock.map(livestockCard).join("");
 document.getElementById("equipment").innerHTML=equipment.map(equipmentCard).join("");
 setTimeout(loadLivestockPhotos,0);
}
function renderTesters(){document.getElementById("testerList").innerHTML=testers.map(testerCard).join("")}
function exportData(){const bundle={...state,photos:photoStore()};const blob=new Blob([JSON.stringify(bundle,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="reef-control-center-backup.json";a.click()}
function importData(e){const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{try{const d=JSON.parse(rd.result);if(d.readings)state.readings=d.readings;if(d.tasks)state.tasks=d.tasks;if(d.photos)savePhotoStore(d.photos);persist();renderAll();alert("Backup imported.")}catch{alert("That file could not be imported.")}};rd.readAsText(f)}
function renderAll(){renderDashboard();renderReadings();renderTasks();renderTank();renderTesters()}
initNav();renderAll();
