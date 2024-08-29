import { getEstablishment } from "@/app/_actions/get-establishment";
import { notFound } from "next/navigation";

const BookingsPage = async ({ params } :  { params: { name: string}}) => {
    const { name } = params
    const establishment = await getEstablishment({ subdomain: name })

    if (!establishment) return notFound()

    return (
        <h1>Olá, {name}</h1>
    );
}
 
export default BookingsPage;