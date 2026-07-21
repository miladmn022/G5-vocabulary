"use client";

import { useState } from "react";


export default function Flashcard(){

const [flipped,setFlipped] = useState(false);


return (

<div
className="
relative
h-[320px]
w-full
cursor-pointer
"
onClick={()=>setFlipped(!flipped)}
>


<div
className={`
absolute
inset-0
transition-transform
duration-500
transform-style-preserve-3d

${flipped ? "rotate-y-180" : ""}
`}
>


{/* FRONT */}

<div
className="
absolute
inset-0
flex
items-center
justify-center
rounded-3xl
bg-white
p-8
shadow-lg
border
border-gray-100
backface-hidden
"
>

<div>

<h2
className="
text-4xl
font-bold
text-indigo-700
text-center
"
>
Apple
</h2>


<p
className="
mt-5
text-center
text-gray-400
"
>
Tap to reveal
</p>


</div>

</div>



{/* BACK */}

<div
className="
absolute
inset-0
rounded-3xl
bg-white
p-8
shadow-lg
border
border-gray-100
rotate-y-180
backface-hidden
"
>


<h2
className="
text-2xl
font-bold
"
>
Apple
</h2>


<div
className="
mt-6
space-y-3
text-gray-600
"
>

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



</div>


</div>

)

}