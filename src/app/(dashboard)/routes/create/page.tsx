import { getGivers } from "@/lib/data";
import { CreateRouteForm } from "@/components/routes/CreateRouteForm";

export default async function CreateRoutePage() {
    const givers = await getGivers();

    return <CreateRouteForm givers={givers} />;
}
