const CORRECT = document.getElementById("answercorrect");
const PERFECT = document.getElementById("answerperfect");
const SCALEMIN = document.getElementById("votescalemin");
const SCALEMAX = document.getElementById("votescalemax");
const CALCBTN = document.getElementById("calculatevotebutton");
const CALCOUT = document.getElementById("calculatevoteoutput");
const CALCROUNDOUT = document.getElementById("calculatevoteroundedoutput");

CORRECT.addEventListener("input", () => CALCOUT.value = "")
PERFECT.addEventListener("input", () => CALCOUT.value = "")
SCALEMIN.addEventListener("input", () => CALCOUT.value = "")
SCALEMAX.addEventListener("input", () => CALCOUT.value = "")
CALCBTN.addEventListener("click", outputVote)



function getVoteText(vote)
{
   function getNearestInArr(num, arr)
   {
      let nearest = arr[0];

      for (let val of arr)
      {
         if (Math.abs(num - val) < Math.abs(num - nearest))
         {
            nearest = val;
         }
      }

      return nearest;
   }

   const VOTEDECSARR = [0, 0.15, 0.5, 0.85, 1];

   let votefloor = Math.floor(vote)

   let nearest = getNearestInArr(vote % 1, VOTEDECSARR);

   let votetext;
   switch (nearest)
   {
      case 0: votetext = votefloor; break;
      case 0.15: votetext = votefloor + "+"; break;
      case 0.5: votetext = votefloor + "½"; break;
      case 0.85: votetext = ++votefloor + "-"; break;
      case 0.1: votetext = ++votefloor; break;
   }

   return votetext;
}


function calculateVote(correct, perfect, scalemin, scalemax)
{
   return (scalemax-scalemin)*correct/perfect + scalemin;
}

function outputVote()
{
   let vote = calculateVote(+CORRECT.value, +PERFECT.value, +SCALEMIN.value, +SCALEMAX.value);
   let votetext = getVoteText(vote);

   const prec = 5
   CALCOUT.value = Math.floor(vote*10**prec)/10**prec;
   CALCROUNDOUT.value = (votetext.toString() == "NaN" ? "" : votetext);
}