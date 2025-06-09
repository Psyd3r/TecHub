
import { Badge } from "@/components/ui/badge";
import { Clock, Package, Truck, CheckCircle } from "lucide-react";

interface OrderStatusBadgeProps {
  status: string;
  showIcon?: boolean;
}

export const OrderStatusBadge = ({ status, showIcon = false }: OrderStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pendente',
          variant: 'secondary' as const,
          icon: Clock,
          color: 'bg-yellow-500'
        };
      case 'processing':
        return {
          label: 'Processando',
          variant: 'default' as const,
          icon: Package,
          color: 'bg-blue-500'
        };
      case 'shipped':
        return {
          label: 'Enviado',
          variant: 'default' as const,
          icon: Truck,
          color: 'bg-purple-500'
        };
      case 'delivered':
        return {
          label: 'Entregue',
          variant: 'default' as const,
          icon: CheckCircle,
          color: 'bg-green-500'
        };
      case 'completed':
        return {
          label: 'Concluído',
          variant: 'default' as const,
          icon: CheckCircle,
          color: 'bg-green-500'
        };
      case 'failed':
        return {
          label: 'Falhou',
          variant: 'destructive' as const,
          icon: Clock,
          color: 'bg-red-500'
        };
      default:
        return {
          label: status,
          variant: 'outline' as const,
          icon: Clock,
          color: 'bg-gray-500'
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <Badge className={`${config.color} text-white`}>
      {showIcon && <IconComponent className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
};
