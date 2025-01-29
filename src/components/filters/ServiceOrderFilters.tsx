export const getStatusColor = (status: string) => {
  switch (status) {
    case "ADE":
      return "text-blue-900 border-blue-900";
    case "AVT":
      return "text-[#F97316] border-[#F97316]";
    case "EXT":
      return "text-[#9b87f5] border-[#9b87f5]";
    case "A.M":
      return "text-[#ea384c] border-[#ea384c]";
    case "INST":
      return "text-pink-500 border-pink-500";
    case "M.S":
      return "text-[#33C3F0] border-[#33C3F0]";
    case "OSP":
      return "text-[#22c55e] border-[#22c55e]";
    case "E.E":
      return "text-[#F97316] border-[#F97316]";
    default:
      return "text-gray-500 border-gray-500";
  }
};

export const filterServiceOrders = ({
  serviceOrders,
  searchQuery,
  searchField,
  selectedStatus,
  searchCriteria,
}: {
  serviceOrders: any[];
  searchQuery: string;
  searchField: string;
  selectedStatus: string | null;
  searchCriteria: { field: string; value: string }[];
}) => {
  return serviceOrders.filter((order) => {
    const matchesQuery =
      order[searchField].toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus
      ? order.status === selectedStatus
      : true;
    const matchesCriteria = searchCriteria.every((criteria) =>
      order[criteria.field].toLowerCase().includes(criteria.value.toLowerCase())
    );

    return matchesQuery && matchesStatus && matchesCriteria;
  });
};
