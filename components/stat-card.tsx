import Card from "./card";


export default function StatCard({
 title,
 value,
}:{
 title:string;
 value:string;
}){


return (

<Card>

<p className="
text-sm
text-gray-500
">
{title}
</p>


<p className="
mt-2
text-3xl
font-bold
">
{value}
</p>


</Card>

)

}