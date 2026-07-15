import AppShell from "@/components/app-shell";
import AppHeader from "@/components/app-header";
import Card from "@/components/card";
import ProgressBar from "@/components/progress-bar";


export default function Home(){

return (

<AppShell>

<AppHeader/>


<Card>

<h1 className="
text-2xl
font-bold
">
Welcome back 👋
</h1>


<p className="
mt-2
text-gray-500
">
Today Goal: 10 words
</p>


<div className="mt-5">

<ProgressBar value={40}/>

</div>


</Card>


</AppShell>

)

}