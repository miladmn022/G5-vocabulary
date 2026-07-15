"use client";


import {useState} from "react";


export default function Flashcard(){

const [flipped,setFlipped]=useState(false);


return (

<div
onClick={()=>setFlipped(!flipped)}
className="
cursor-pointer
perspective
"
>


<div
className={`
relative
min-h-[320px]
rounded-3xl
bg-white
p-8
shadow-lg
border
border-gray-100
flex
items-center
justify-center
text-center
transition
duration-500
${flipped ? "rotate-y-180" : ""}
`}
>


{
!flipped ? (

<div>

<h2 className="
text-4xl
font-bold
text-indigo-700
">
Apple
</h2>


<p className="
mt-5
text-gray-400
">
Tap to reveal
</p>


</div>

)

:

(

<div
className="
rotate-y-180
"
>

<h2 className="
text-2xl
font-bold
">
Apple
</h2>


<div className="
mt-6
space-y-3
text-gray-600
">


<p>
<strong>Meaning:</strong>
سیب
</p>


<p>
<strong>Synonyms:</strong>
fruit
</p>


<p>
<strong>Example:</strong>
I eat an apple.
</p>


</div>


</div>

)

}



</div>


</div>

)

}