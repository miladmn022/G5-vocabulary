import Logo from "./logo";


export default function AppHeader(){

return (

<header
className="
flex
items-center
justify-between
py-6
"
>

<Logo/>


<div
className="
h-10
w-10
rounded-full
bg-gray-200
"
/>


</header>

)

}