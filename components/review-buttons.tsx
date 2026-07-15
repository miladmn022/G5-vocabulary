import {Button} from "@/components/ui/button";


export default function ReviewButtons(){

return (

<div className="
grid
grid-cols-4
gap-2
mt-6
">


<Button
variant="outline"
>
Again
</Button>


<Button
variant="outline"
>
Hard
</Button>


<Button
className="
bg-emerald-500
hover:bg-emerald-600
"
>
Good
</Button>


<Button
className="
bg-indigo-600
hover:bg-indigo-700
"
>
Easy
</Button>


</div>

)

}