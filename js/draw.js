import CLASSES from "../data/classes.json" assert {type: "json"}

const DRAWMODE = document.getElementById("drawmode");
const DRAWRANGE = document.getElementById("drawrange");
const DRAWCOUNTER = document.getElementById("drawcounter");
const CLASSSELECTION = document.getElementById("classselection");
const SHUFFLEBTN = document.getElementById("shufflebutton");
const DRAWTABLE = document.getElementById("drawtable");
const PEOPLETEXT = document.getElementById("peopletext");


for (let opt of Object.keys(CLASSES))
{
   let optOBJ = document.createElement("option");
   optOBJ.value = optOBJ.innerText = opt;
   CLASSSELECTION.appendChild(optOBJ);
}


peopleTextUpdate()
drawRangeUpdate()

CLASSSELECTION.addEventListener("input", () => {peopleTextUpdate(); drawRangeUpdate()})
DRAWRANGE.addEventListener("input", drawCountUpdate)
DRAWMODE.addEventListener("input", drawRangeUpdate)
PEOPLETEXT.addEventListener("input", drawRangeUpdate)
SHUFFLEBTN.addEventListener("click", countDown)
SHUFFLEBTN.addEventListener("touchend", countDown)


function countDown()
{
   if (DRAWTABLE.classList.contains("countdown") == false)
   {
      DRAWTABLE.classList.add("countdown");

      let timer = 3;

      let intervalFun = () =>
      {
         if (timer == -1)
         {
            clearInterval(intervalID);
            DRAWTABLE.classList.remove("countdown");
            DRAWTABLE.innerHTML = "";
            drawCurrent()
         }
         else
         {
            DRAWTABLE.innerHTML = "";
            const TD = document.createElement("td");
            TD.innerText = timer;
            DRAWTABLE.appendChild(TD);
         }

         timer--;
      }

      intervalFun()
      let intervalID = setInterval(intervalFun, 1000)
   }
}

function peopleTextUpdate()
{
   PEOPLETEXT.value = CLASSES[CLASSSELECTION.value].join("\n");
   PEOPLETEXT.style.height = "0px";
   PEOPLETEXT.style.height = PEOPLETEXT.scrollHeight + 5 + "px";
}
function drawRangeUpdate()
{
   switch (DRAWMODE.value)
   {
      case "gruppi": DRAWRANGE.min = 2; break;
      case "persone": DRAWRANGE.min = 1; break;
   }

   DRAWRANGE.max = PEOPLETEXT.value.split("\n").filter(t => t != "").length

   drawCountUpdate()
}
function drawCountUpdate()
{
   DRAWCOUNTER.value = DRAWRANGE.value + " " + DRAWMODE.value.toUpperCase();
}

function drawCurrent()
{
   let people = PEOPLETEXT.value.split("\n").filter(t => t != "");
   let numDraw = DRAWRANGE.value;
   let drawed;

   DRAWTABLE.innerHTML = "";

   switch (DRAWMODE.value)
   {
      case "gruppi":
         drawed = draw(people, numDraw);
         setHeader(DRAWTABLE, numDraw)
         setTable(DRAWTABLE, drawed);
         break;
      case "persone":
         drawed = [draw(people, 1).flat().slice(0, numDraw)];
         setHeader(DRAWTABLE, 1)
         setTable(DRAWTABLE, drawed);
         break;
   }
}

function draw(people, numGroups)
{
   function shuffle(arr)
   {
      for (let i=arr.length-1; i > 0; i--)
      {
         let j = Math.floor(Math.random() * (i+1));
         [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      return arr;
   }


   let perGroup = Math.floor(people.length / numGroups);

   people = shuffle(people)


   let groups = [];

   for (let i=0; i<people.length; i+=perGroup)
   {
      groups.push(people.slice(i, i+perGroup))
   }


   if (groups.length > numGroups)
   {
      let remGroup = [];

      while (groups.length > numGroups) remGroup.push(groups.pop());

      remGroup = remGroup.flat();

      while (remGroup.length < numGroups) remGroup.push("");

      remGroup = shuffle(remGroup);

      for (let i=0; i<numGroups; i++) groups[i].push(remGroup[i]);
   }


   return groups;
}

function setHeader(table, cols)
{
   const TH = document.createElement("th");
   TH.colSpan = "42";
   TH.innerText = "Sorteggi";

   table.appendChild(TH);


   const GROUPTR = document.createElement("tr");
   table.appendChild(GROUPTR);

   if (cols > 1) for (let i=0; i<cols; i++)
   {
      const TD = document.createElement("td");

      TD.innerText = `${i+1}° GRUPPO`;
      TD.style.fontWeight = "bold";

      GROUPTR.appendChild(TD);
   }
}
function setTable(table, drawed)
{
   for (let i=0; i<drawed[0].length; i++)
   {
      const TR = document.createElement("tr");
      table.appendChild(TR);

      for (let j=0; j<drawed.length; j++)
      {
         const TD = document.createElement("td");

         TD.innerText = drawed[j][i] ?? "";

         TR.appendChild(TD);
      }
   }
}