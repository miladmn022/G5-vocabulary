"use client";


import { Button } from "@/components/ui/button";


export default function LoginForm(){

return (

<form
className="
space-y-4
"
>


<div>

<label
className="
text-sm
font-medium
"
>
Username
</label>


<input
type="text"
placeholder="Enter username"
className="
mt-2
w-full
rounded-xl
border
border-gray-200
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"
/>

</div>



<div>

<label
className="
text-sm
font-medium
"
>
Password
</label>


<input
type="password"
placeholder="Enter password"
className="
mt-2
w-full
rounded-xl
border
border-gray-200
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"
/>

</div>



<Button
className="
w-full
rounded-xl
py-6
"
>
Sign in
</Button>



</form>

)

}