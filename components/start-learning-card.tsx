import { Button } from "@/components/ui/button";
import Card from "./card";


export default function StartLearningCard(){

return (

<Card
className="
bg-indigo-600
text-white
"
>


<h2 className="
text-xl
font-bold
">
Ready to learn?
</h2>


<p className="
mt-2
text-indigo-100
">
Review today's vocabulary cards
</p>


<Button
className="
mt-5
w-full
bg-white
text-indigo-700
hover:bg-gray-100
"
>
Start Learning
</Button>


</Card>

)

}