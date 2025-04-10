import { useQuery } from "@tanstack/react-query";
import { addressService } from "../../../services/address/address-service";

export function useGetCitys() {
    const { data, error, isLoading } = useQuery({
        queryKey: ["citys"],
        queryFn: () => addressService.getProvinces(3),
    });

    return { city: data, error, isLoading };
}
