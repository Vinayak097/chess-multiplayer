import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/component/ui/card"
import { Button } from "@/component/ui/button";

const EnterArenaCard = () => {
  return (
    <Card className="bg-[#111214]  border-b border-zinc-800 rounded-sm p-2 px-5 pb-5   w-lg ">
      <CardHeader className="border-b flex justify-between p-0  h-[10px] rounded-0">
        <h1 className="text-orange-500 w-fit"> // Briefing_01</h1>
        <div className="text-gray-500">
          <span>Live</span>
          <span className="bg-gray-500  mx-2 h-[1px] w-[] border"></span>
          <span>2431 OPS</span> 
        </div>
      </CardHeader>

      <CardContent>
        <CardTitle className="text-green-400">
          MATCHMAKING ONLINE
        </CardTitle>
        <CardTitle className="text-3xl text-orange-500">
          <span className="text-white">ENTER THE</span> <br></br>
          <span className="text-orange-500"> ARENA_</span>
        </CardTitle>
        <CardDescription className=" mt-2 flex flex-col">
        <span> {">"} Mached by rating in </span>
        <span>under 8 seconds</span>
        <span> First move is yours</span>
      </CardDescription>
      </CardContent>
      
      <CardFooter>
        <Button className="text-black font-bold tracking-wider bg-orange-500 rounded-none clip-tactical rounded-bl-3xl rounded-tr-3xl p-10">
          QUICK MATCH
        </Button>
      </CardFooter>
      
 
   
</Card>
  );
};

export default EnterArenaCard;