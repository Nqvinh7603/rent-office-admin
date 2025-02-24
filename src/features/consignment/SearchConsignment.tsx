import { useQuery } from "@tanstack/react-query";
import { Button, Form, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Loading from "../../common/components/Loading";
import { PERMISSIONS } from "../../interfaces/common/constants";
import { Module } from "../../interfaces/common/enums";
import { buildingTypeService, userService } from "../../services";
import { customerService } from "../../services/customer/customer-service";
import { formatCurrency, parseCurrency } from "../../utils";
import Access from "../auth/Access";
import { useGetCitys } from "./hooks";

const SearchConsignment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading] = useState(false);
  const { city } = useGetCitys();
  const [districts, setDistricts] = useState<
    { label: string; value: string; wards?: { name: string; code: string }[] }[]
  >([]);
  const [wards, setWards] = useState<{ label: string; value: string }[]>([]);

  const handleSearch = (values: Record<string, any>) => {
    const newParams = new URLSearchParams();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        newParams.set(key, values[key]);
      }
    });
    setSearchParams(newParams);
  };

  const handleReset = () => {
    form.resetFields();
    setSearchParams(new URLSearchParams());
    setDistricts([]);
    setWards([]);
    form.submit();
  };

  const addressOptions = Array.isArray(city)
    ? city.map((item) => ({
        label: item.name,
        value: item.name,
        districts: item.districts,
      }))
    : [];

  const handleCityChange = (value: string) => {
    const selectedCity = addressOptions.find((city) => city.value === value);
    if (selectedCity && selectedCity.districts) {
      setDistricts(
        selectedCity.districts.map((district) => ({
          label: district.name,
          value: district.name,
          wards: district.wards?.map((ward) => ({
            name: ward.name,
            code: ward.name,
          })),
        })),
      );
      setWards([]);
    } else {
      setDistricts([]);
      setWards([]);
    }
  };

  const handleDistrictChange = (value: string) => {
    const selectedDistrict = districts.find(
      (district) => district.value === value,
    );
    if (selectedDistrict && selectedDistrict.wards) {
      setWards(
        selectedDistrict.wards.map((ward) => ({
          label: ward.name,
          value: ward.name,
        })),
      );
    } else {
      setWards([]);
    }
  };

  useEffect(() => {
    const cityValue = form.getFieldValue("city");
    if (cityValue) {
      handleCityChange(cityValue);
    }
  }, [form]);

  const { data: buildingTypesData, isLoading: isBuildingTypesLoading } =
    useQuery({
      queryKey: ["building-types"],
      queryFn: buildingTypeService.getAllBuildingTypes,
    });

  const buildingTypeOption = buildingTypesData?.payload?.map(
    (buildingType) => ({
      label: buildingType.buildingTypeName,
      value: buildingType.buildingTypeName,
    }),
  );

  const { data: staffsData, isLoading: isStaffsLoading } = useQuery({
    queryKey: ["staffs"],
    queryFn: userService.loadStaffs,
  });

  const staffOption = staffsData?.payload?.map((staff) => ({
    label: `${staff.firstName} ${staff.lastName}`,
    value: `${staff.firstName} ${staff.lastName}`,
  }));

  const { data: customersData, isLoading: isCustomersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: customerService.getAllCustomerByRequireType,
  });

  const customerNameOption = customersData?.payload?.map((customer) => ({
    label: customer.customerName,
    value: customer.customerName,
  }));

  const customerEmailOption = customersData?.payload?.map((customer) => ({
    label: customer.email,
    value: customer.email,
  }));

  const customerPhoneNumberOption = customersData?.payload?.map((customer) => ({
    label: customer.phoneNumber,
    value: customer.phoneNumber,
  }));

  if (isBuildingTypesLoading || isCustomersLoading || isStaffsLoading) {
    return <Loading />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSearch}
      initialValues={{
        email: searchParams.get("email") || "" || undefined,
        customerName: searchParams.get("customerName") || "" || undefined,
        phoneNumber: searchParams.get("phoneNumber") || "" || undefined,
        buildingType: searchParams.get("buildingType") || undefined,
        city: searchParams.get("city") || undefined,
        district: searchParams.get("district") || undefined,
        ward: searchParams.get("ward") || undefined,
        minPrice: searchParams.get("minPrice") || undefined,
        maxPrice: searchParams.get("maxPrice") || undefined,
        staffName: searchParams.get("staffName") || undefined,
      }}
    >
      <div className="grid grid-cols-1 gap-4 gap-y-0 md:grid-cols-2 lg:grid-cols-3">
        <Form.Item name="email" label="Email khách hàng">
          <Select
            allowClear
            showSearch
            placeholder="Nhập email khách hàng"
            options={customerEmailOption}
            optionFilterProp="label"
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase()) ?? false
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item name="customerName" label="Tên khách hàng">
          <Select
            placeholder="Nhập tên khách hàng"
            options={customerNameOption}
            allowClear
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase()) ?? false
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Số điện thoại">
          <Select
            placeholder="Nhập số điện thoại khách hàng"
            options={customerPhoneNumberOption}
            allowClear
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase()) ?? false
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item label="Loại tòa nhà" name="buildingType">
          <Select
            allowClear
            showSearch
            placeholder="Chọn loại toà nhà"
            options={buildingTypeOption}
            optionFilterProp="label"
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase()) ?? false
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item label="Giá sản phẩm ký gửi (tối thiểu)" name="minPrice">
          <InputNumber
            min={0}
            placeholder="Chọn giá tối thiểu"
            addonAfter="VND/m²"
            style={{ width: "100%" }}
            formatter={(value) => formatCurrency(value)}
            parser={(value) => parseCurrency(value) as unknown as 0}
          />
        </Form.Item>
        <Form.Item label="Giá sản phẩm ký gửi (tối đa)" name="maxPrice">
          <InputNumber
            min={0}
            placeholder="Chọn giá tối đa"
            addonAfter="VND/m²"
            style={{ width: "100%" }}
            formatter={(value) => formatCurrency(value)}
            parser={(value) => parseCurrency(value) as unknown as 0}
          />
        </Form.Item>
        <Form.Item name="city" label="Khu vực ">
          <Select
            placeholder="Chọn khu vực"
            options={addressOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase()) ?? false
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            onChange={handleCityChange}
          />
        </Form.Item>

        <Form.Item name="district" label="Quận/Huyện">
          <Select
            placeholder="Chọn quận/huyện"
            options={districts}
            allowClear
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase()) ?? false
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            onChange={handleDistrictChange}
          />
        </Form.Item>

        <Form.Item name="ward" label="Phường/Xã">
          <Select
            placeholder="Chọn phường/xã"
            options={wards}
            allowClear
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase()) ?? false
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
          />
        </Form.Item>

        <Access
          permission={PERMISSIONS[Module.CUSTOMERS].ASSIGN_CUSTOMER_TO_STAFFS}
          hideChildren={true}
        >
          <Form.Item label="Nhân viên quản lý" name="staffName">
            <Select
              allowClear
              showSearch
              placeholder="Chọn nhân viên quản lý"
              options={staffOption}
              optionFilterProp="label"
              filterOption={(input, option) =>
                option?.label.toLowerCase().includes(input.toLowerCase()) ??
                false
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
            />
          </Form.Item>
        </Access>
      </div>
      <div className="mb-4 flex justify-end gap-3">
        <Button onClick={handleReset} disabled={loading}>
          Làm mới
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Tìm kiếm
        </Button>
      </div>
    </Form>
  );
};

export default SearchConsignment;
