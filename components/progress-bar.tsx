export default function ProgressBar({
  value
}: {
  value:number
}) {

return (

<div className="
w-full
overflow-hidden
rounded-full
bg-gray-200
h-3
">

<div
className="
h-full
rounded-full
bg-emerald-500
transition-all
"
style={{
width:`${value}%`
}}
/>

</div>

)

}