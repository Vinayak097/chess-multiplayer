import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/component/ui/card"
import { Button } from "@/component/ui/button";
import { GameType } from "@/pages/Home";

const EnterArenaCard = ({quickPlay}:{quickPlay:(gametype:GameType)=>void}) => {
  
  return (
    <Card className="bg-[#111214] text-max-xl  rounded-none border-b border-zinc-800  p-2 px-5 pb-5 md:w-ful w-full">
      
      <CardHeader className="border-b flex justify-between p-0  h-[10px] rounded-0">
        <h1 className="text-orange-500 w-fit"> // Briefing_01</h1>
        <div className="text-gray-500">
          <span>Live</span>
          <span className="bg-gray-500  mx-2 h-[1px] w-[] border"></span>
          <span>2431 OPS</span> 
        </div>
      </CardHeader>

      <CardContent>
        <CardTitle className="text-cyan-400 tracking-wider font-semibold text-xs">
          MATCHMAKING ONLINE
        </CardTitle>
        <CardTitle className="text-lg text-orange-500 ">
          <span className="text-white">ENTER THE</span> <br></br>
          <span className="text-orange-500"> ARENA_</span>
        </CardTitle>
        <CardDescription className=" mt-2 flex flex-col text-xs">
        <span> {">"} Mached by rating in </span>
        <span>under 8 seconds</span>
        <span> First move is yours</span>
      </CardDescription>
      </CardContent>
      
      <CardFooter>
        <Button onClick={()=>quickPlay("Rapid" as GameType)} className="text-black font-bold tracking-wider text-xs bg-orange-500 rounded-none clip-tactical rounded-bl-sm rounded-tr-sm p-2">
          QUICK MATCH
        </Button>
      </CardFooter>
      
 
   
</Card>
  );
};

export default EnterArenaCard;