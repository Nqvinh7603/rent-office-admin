import axios, { AxiosInstance } from "axios";
import { IAddress } from "../../interfaces";
interface IAddressService {
    getProvinces(depth: number): Promise<IAddress[]>;
}

const apiClient: AxiosInstance = axios.create({
    baseURL: "https://provinces.open-api.vn/api",
});

class AddressService implements IAddressService {
    async getProvinces(depth: number): Promise<IAddress[]> {
        return (await apiClient.get(`/?depth=${depth}`)).data;
    }
}

export const addressService = new AddressService();


