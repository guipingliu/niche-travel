import { getRoute } from "@/lib/data";
import RouteEditForm from "@/components/RouteEditForm";

export default async function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const route = await getRoute(id);

    if (!route) {
        return <div>未找到路线</div>;
    }

    return <RouteEditForm initialRoute={route} />;
}
