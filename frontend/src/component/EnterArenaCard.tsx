import { Card, CardContent } from "@/component/ui/card";
import { Button } from "@/component/ui/button";

const EnterArenaCard = () => {
  return (
    <Card className="bg-[#111214] border border-zinc-800 rounded-sm">
  <div className="px-5 pt-3 pb-4">
    <h2>ENTER ARENA</h2>

    <p>Join matchmaking...</p>

    <Button>PLAY NOW</Button>
  </div>
</Card>
  );
};

export default EnterArenaCard;