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
  0:[
    {title:"25-gallon water change",details:"Match temperature and salinity; test the full panel 1–2 hours later",type:"Water change"}
  ],
  1:[
    {title:"Alkalinity test",details:"Test at the same time of day",type:"Testing"},
    {title:"MicroBacter7 — 6.5 mL",details:"Shake well; pause skimmer and UV for 4 hours",type:"Dosing"}
  ],
  3:[
    {title:"Alkalinity test",details:"Test at the same time of day",type:"Testing"},
    {title:"MicroBacter CLEAN — 52 mL",details:"Dilute in about 8 oz tank water; pause skimmer and UV for 4 hours",type:"Dosing"}
  ],
  5:[
    {title:"Equipment inspection",details:"Check ATO, pumps, skimmer, reactor, and dosing line",type:"Equipment"}
  ],
  6:[
    {title:"Full test panel",details:"Alk, Ca, Mg, NO₃, PO₄, pH, salinity, and temperature",type:"Testing"},
    {title:"Weekly maintenance",details:"Clean glass and skimmer cup, change floss, and baste rocks",type:"Maintenance"}
  ]
};
let maintenanceWindowDays=7;
function localISODate(d){
 const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");
 return `${y}-${m}-${day}`;
}
function dateAtNoon(date){return new Date(date.getFullYear(),date.getMonth(),date.getDate(),12,0,0,0)}
function generatedMaintenanceTasks(days=30){
 const start=dateAtNoon(new Date()),tasks=[];
 for(let offset=0;offset<days;offset++){
  const date=new Date(start);date.setDate(start.getDate()+offset);
  const templates=maintenanceTemplates[date.getDay()]||[];
  templates.forEach((template,index)=>{
   const dateKey=localISODate(date),id=`${dateKey}|${template.title}|${index}`;
   tasks.push({...template,id,date:dateKey,dateObj:new Date(date),done:Boolean(state.taskCompletions[id])});
  });
 }
 return tasks;
}
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
};
function persist(showWarning=false){
 const readingsSaved=safeSet("reefReadings",JSON.stringify(state.readings));
 const tasksSaved=safeSet("reefTasks",JSON.stringify(state.tasks));
 const completionsSaved=safeSet("reefTaskCompletions",JSON.stringify(state.taskCompletions));
 if(showWarning&&(!readingsSaved||!tasksSaved||!completionsSaved)){
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
 const upcoming7=generatedMaintenanceTasks(7),pending=upcoming7.filter(t=>!t.done).slice(0,5);
 document.getElementById("dashboardTasks").innerHTML=pending.length?pending.map(taskHtml).join(""):'<div class="empty">All tasks in the next 7 days are complete.</div>';
 document.getElementById("taskCount").textContent=`${upcoming7.filter(t=>!t.done).length} remaining in 7 days`;
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
function deleteReading(id){if(confirm("Delete this reading?")){state.readings=state.readings.filter(r=>r.id!==id);persist(true);renderAll()}}
function maintenanceDateLabel(task){
 const d=task.dateObj||new Date(task.date+"T12:00:00");
 const today=localISODate(new Date());
 const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);
 const prefix=task.date===today?"Today":task.date===localISODate(tomorrow)?"Tomorrow":d.toLocaleDateString([], {weekday:"short"});
 return `${prefix} • ${d.toLocaleDateString([], {month:"short",day:"numeric"})}`;
}
function taskHtml(t){
 const encoded=encodeURIComponent(t.id);
 return `<div class="task scheduled-task ${t.done?"done":""}"><input type="checkbox" ${t.done?"checked":""} onchange="toggleScheduledTask('${encoded}')"><div class="task-date">${maintenanceDateLabel(t)}</div><div><div class="task-title">${t.title}</div><div class="task-meta">${t.details}</div></div><span class="task-type">${t.type}</span></div>`;
}
function renderTasks(){
 const tasks=generatedMaintenanceTasks(maintenanceWindowDays),list=document.getElementById("taskList");
 list.innerHTML=tasks.length?tasks.map(taskHtml).join(""):'<div class="empty">No scheduled tasks in this period.</div>';
 const title=document.getElementById("maintenanceWindowTitle"),hint=document.getElementById("maintenanceWindowHint"),button=document.getElementById("maintenanceWindowToggle");
 if(title)title.textContent=maintenanceWindowDays===7?"Next 7 days":"Next 30 days";
 if(hint)hint.textContent=`${tasks.filter(t=>!t.done).length} remaining • Dates update automatically`;
 if(button)button.textContent=maintenanceWindowDays===7?"Show all 30 days":"Show next 7 days";
}
function toggleScheduledTask(encodedId){
 const id=decodeURIComponent(encodedId);state.taskCompletions[id]=!state.taskCompletions[id];persist(true);renderAll();
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
 const src=custom||svgData(x.kind,x.name,x.accent);
 const inputId=`photo-${btoa(unescape(encodeURIComponent(mediaKey("livestock",x.name)))).replace(/=/g,"")}`;
 return `<article class="profile-card">
   <div class="profile-image remote-photo"><img data-wiki="${escapeHtml(wiki||x.scientific||x.name)}" src="${src}" alt="${escapeHtml(x.name)}" onerror="this.onerror=null;this.src=svgData(\'${x.kind}\',\'${escapeAttr(x.name)}\',\'${x.accent}\')"></div>
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
function renderTank(){
 document.getElementById("targetList").innerHTML=Object.values(targets).map(t=>`<div class="task"><div><div class="task-title">${t.label}</div><div class="task-meta">${t.min}–${t.max} ${t.unit}</div></div></div>`).join("");
 const groups=[
  {name:"Fish",id:"fish-section",title:"Fish"},
  {name:"Invertebrate",id:"invertebrate-section",title:"Invertebrates"},
  {name:"Coral",id:"coral-section",title:"Corals"}
 ];
 document.getElementById("livestock").innerHTML=groups.map(g=>`<section class="livestock-section" id="${g.id}"><h4 class="livestock-group-title">${g.title}</h4><div class="media-grid">${livestock.filter(x=>x.group===g.name).map(livestockCard).join("")}</div></section>`).join("");
 document.getElementById("equipment").innerHTML=equipment.map(equipmentCard).join("");
 loadRemotePhotos();
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
 const bundle={version:1,exportedAt:new Date().toISOString(),readings:state.readings,tasks:state.tasks,taskCompletions:state.taskCompletions,photos:photoStore()};
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
  if(d.photos&&typeof d.photos==="object")savePhotoStore(d.photos);
  persist(true);renderAll();alert("Backup imported.");
 }catch(err){console.error(err);alert("That file is not a valid Aquarium Hub backup.")}finally{input.value=""}};
 rd.onerror=()=>{alert("That backup file could not be read.");input.value=""};
 rd.readAsText(f);
}
function renderAll(){renderDashboard();renderReadings();renderTasks();renderTank();renderTesters()}
function appSelfCheck(){
 const required=["dashboard","readings","maintenance","tank","testers","kpis","readingForm","readingRows","taskList","livestock","equipment","testerList","healthScore"];
 const missing=required.filter(id=>!document.getElementById(id));
 return {ok:missing.length===0,missing,readings:state.readings.length,tasks:state.tasks.length};
}
try{initNav();renderAll();window.AquariumHub={showPage,goToSection,saveReading,renderAll,appSelfCheck,state}}catch(err){console.error("Aquarium Hub failed to initialize:",err);alert("Aquarium Hub could not finish loading. Please reload the page.")}
