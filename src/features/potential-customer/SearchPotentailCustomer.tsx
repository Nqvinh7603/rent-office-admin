import { useQuery } from "@tanstack/react-query";
import { Button, Form, Select } from "antd";
import { useState } from "react";
import { useSearchParams } from "react-router";
import Loading from "../../common/components/Loading";
import { PERMISSIONS } from "../../interfaces/common/constants";
import { Module } from "../../interfaces/common/enums";
import { userService } from "../../services";
import { customerService } from "../../services/customer/customer-service";
import Access from "../auth/Access";

const SearchPotentialCustomer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading] = useState(false);

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
    form.submit();
  };

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
    queryFn: customerService.getAllPotentialCustomers,
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

  if (isCustomersLoading || isStaffsLoading) {
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

export default SearchPotentialCustomer;
