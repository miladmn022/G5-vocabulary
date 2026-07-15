import AppShell from "@/components/app-shell";
import LearningHeader from "@/components/learning-header";
import Flashcard from "@/components/flashcard";
import ReviewButtons from "@/components/review-buttons";


export default function LearnPage(){

return (

<AppShell>


<LearningHeader/>


<div className="
mt-8
">

<Flashcard/>


<ReviewButtons/>


</div>


</AppShell>

)

}