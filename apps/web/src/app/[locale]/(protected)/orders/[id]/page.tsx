import { OrderDetail } from "@/widgets/orders";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  return <OrderDetail mode="edit" id={id} />;
}
