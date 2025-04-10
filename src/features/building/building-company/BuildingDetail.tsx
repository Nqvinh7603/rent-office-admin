import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Menu,
  Select,
  Timeline,
  Tooltip,
  Upload,
  UploadProps,
} from "antd";
import { UploadFile } from "antd/lib";
import dayjs from "dayjs";
import JoditEditor from "jodit-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router";
import Loading from "../../../common/components/Loading";
import { FileType, IBuilding } from "../../../interfaces";
import {
  BUILDING_STATUS_TRANSLATION,
  BUILDING_UNIT_STATUS_TRANSLATION,
  CONSIGNMENT_STATUS_TRANSLATION,
  ORENTATION_TRANSLATIONS,
} from "../../../interfaces/common/constants";
import { ConsignmentStatus } from "../../../interfaces/common/enums";
import { buildingLevelService, buildingTypeService } from "../../../services";
import { buildingService } from "../../../services/building/building-service";
import { feeTypeService } from "../../../services/building/fee-type-service";
import {
  formatCurrency,
  getBase64,
  parseCurrency,
  toSnakeCase,
} from "../../../utils";
import { useGetCitys } from "../../consignment/hooks";
import BuildingBreadcrumb from "../Breadcrumb/BuildingBreadcrumb";

interface UpdateBuildingArgs {
  buildingId: string;
  updatedBuilding: FormData;
}
export interface BuildingFormValues extends IBuilding {
  buildingImg: UploadFile[];
}

const BuildingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const navigate = useNavigate();
  const [detailForm] = Form.useForm<BuildingFormValues>();
  const [approveForm] = Form.useForm<BuildingFormValues>();

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { city } = useGetCitys();
  const [districts, setDistricts] = useState<
    { label: string; value: string; wards?: { name: string; code: string }[] }[]
  >([]);
  const [wards, setWards] = useState<{ label: string; value: string }[]>([]);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem("theme") === "dark" ? "dark" : "light");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const { data, isLoading } = useQuery({
    queryFn: () => buildingService.getBuildingById(id!),
    queryKey: ["buildings", id],
  });

  const building = data?.payload;

  useEffect(() => {
    if (building) {
      detailForm.setFieldsValue({
        ...building,
        buildingImg: building.buildingImages.map((image, index) => ({
          uid: `${index}`,
          name: image.imgUrl || `image-${index}`,
          status: "done",
          url: image.imgUrl,
        })),
      });
      setPreviewImage(building.buildingImages[0]?.imgUrl || "");
      setFileList(
        building.buildingImages.map((image, index) => ({
          uid: `${index}`,
          name: image.imgUrl || `image-${index}`,
          status: "done",
          url: image.imgUrl,
        })),
      );
    }
  }, [building, detailForm]);

  useEffect(() => {
    if (building) {
      approveForm.setFieldsValue({
        ...building,
        buildingImg: building.buildingImages.map((image, index) => ({
          uid: `${index}`,
          name: image.imgUrl || `image-${index}`,
          status: "done",
          url: image.imgUrl,
        })),
      });
      setPreviewImage(building.buildingImages[0]?.imgUrl || "");
      setFileList(
        building.buildingImages.map((image, index) => ({
          uid: `${index}`,
          name: image.imgUrl || `image-${index}`,
          status: "done",
          url: image.imgUrl,
        })),
      );
    }
  }, [building, approveForm]);

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
    const cityValue = detailForm.getFieldValue("city");
    if (cityValue) {
      handleCityChange(cityValue);
    }
  }, [detailForm]);
  useEffect(() => {
    const cityValue = approveForm.getFieldValue("city");
    if (cityValue) {
      handleCityChange(cityValue);
    }
  }, [approveForm]);

  async function handlePreview(file: UploadFile) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || file.preview || "");
    setPreviewOpen(true);
  }

  const handleUploadChange: UploadProps["onChange"] = ({ fileList, file }) => {
    if (file.status === "removed" && file.url) {
      setDeletedImages((prev) => [...prev, file.url!]);
    }
    setFileList(fileList); // Cập nhật danh sách file
    detailForm.setFieldsValue({ buildingImg: fileList }); // Đồng bộ với form
  };

  const { data: buildingTypesData, isLoading: isBuildingTypesLoading } =
    useQuery({
      queryKey: ["building-types"],
      queryFn: buildingTypeService.getAllBuildingTypes,
    });

  const buildingTypeOption = buildingTypesData?.payload?.map(
    (buildingType) => ({
      label: buildingType.buildingTypeName,
      value: buildingType.buildingTypeId,
    }),
  );

  const { data: buildingLevelsData, isLoading: isBuildingLevelsLoading } =
    useQuery({
      queryKey: ["building-levels"],
      queryFn: buildingLevelService.getAllBuildingLevels,
    });

  const buildingLevelOption = buildingLevelsData?.payload?.map(
    (buildingLevel) => ({
      label: buildingLevel.buildingLevelName,
      value: buildingLevel.buildingLevelId,
    }),
  );

  const { data: feeTypesData } = useQuery({
    queryKey: ["fee-types"],
    queryFn: feeTypeService.getAllFeeTypes,
  });
  const feeTypeOption = feeTypesData?.payload?.map((feeType) => ({
    label: feeType.feeTypeName,
    value: feeType.feeTypeId,
  }));

  const { mutate: updateBuilding, isPending: isUpdating } = useMutation({
    mutationFn: ({ buildingId, updatedBuilding }: UpdateBuildingArgs) => {
      return buildingService.update(buildingId, updatedBuilding);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("buildings");
        },
      });
    },
  });

  function handleDetailFormFinish(values: BuildingFormValues) {
    if (building) {
      const consignments = {
        ...building,
        ...values,
        // rentalPricing: [
        //   ...building.rentalPricing,
        //   {
        //     price: values.rentalPricing[values.rentalPricing.length - 1]?.price,
        //   },
        // ],

        paymentPolicies: [
          ...building.paymentPolicies,
          {
            paymentCycle:
              values.paymentPolicies[values.paymentPolicies.length - 1]
                ?.paymentCycle,
            depositTerm:
              values.paymentPolicies[values.paymentPolicies.length - 1]
                ?.depositTerm,
          },
        ],
        fees: values.fees.map((fee) => ({
          ...fee,
          feePricing: [
            {
              priceUnit: fee.feePricing[fee.feePricing.length - 1]?.priceUnit,
              priceValue: fee.feePricing[fee.feePricing.length - 1]?.priceValue,
              description:
                fee.feePricing[fee.feePricing.length - 1]?.description,
            },
          ],
        })),
      };
      const formData = new FormData();
      formData.append("customer", JSON.stringify(toSnakeCase(consignments)));

      if (fileList.length > 0) {
        fileList.forEach((file) => {
          formData.append("buildingImg", file.originFileObj as FileType);
        });
      } else {
        formData.append("buildingImg", "");
      }

      if (deletedImages.length > 0) {
        deletedImages.forEach((image) => {
          formData.append("deleted_images", image);
        });
      }
      console.log("Danh sách ảnh bị xoá gửi lên backend:", deletedImages);
      updateBuilding(
        {
          buildingId: building.buildingId.toString(),
          updatedBuilding: formData,
        },
        {
          onSuccess: (res) => {
            toast.success("Cập nhật tài sản thành công");
          },
          onError: (error) => {
            console.error("Lỗi cập nhật tài sản:", error);
            toast.error("Cập nhật tài sản thất bại");
          },
        },
      );
    }
  }

  function handleApproveFormFinish(values: BuildingFormValues) {
    if (building) {
      const consignments = {
        ...building,
        ...values,
        buildingUnits: values.buildingUnits.map((unit) => ({
          ...unit,
          rentAreas: unit.rentAreas.map((area) => ({
            ...area,
            area: area.area,
          })),
          rentalPricing: [
            {
              price: unit.rentalPricing[unit.rentalPricing.length - 1]?.price,
            },
          ],
          status: unit.status,
        })),
      };
      const formData = new FormData();
      formData.append("customer", JSON.stringify(toSnakeCase(consignments)));

      if (fileList.length > 0) {
        fileList.forEach((file) => {
          formData.append("buildingImg", file.originFileObj as FileType);
        });
      } else {
        formData.append("buildingImg", "");
      }

      if (deletedImages.length > 0) {
        deletedImages.forEach((image) => {
          formData.append("deleted_images", image);
        });
      }
      console.log("Danh sách ảnh bị xoá gửi lên backend:", deletedImages);
      updateBuilding(
        {
          buildingId: building.buildingId.toString(),
          updatedBuilding: formData,
        },
        {
          onSuccess: (res) => {
            toast.success("Cập nhật tài sản thành công");
          },
          onError: (error) => {
            console.error("Lỗi cập nhật tài sản:", error);
            toast.error("Cập nhật tài sản thất bại");
          },
        },
      );
    }
  }
  const [currentTab, setCurrentTab] = useState<string>("detail");

  if (
    isLoading ||
    isBuildingTypesLoading ||
    !building ||
    isBuildingLevelsLoading
  ) {
    return <Loading />;
  }

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center">
        <Tooltip title="Quay lại">
          <Button icon={<GoArrowLeft />} onClick={() => navigate(-1)} />
        </Tooltip>
        <div className="ml-2">
          <BuildingBreadcrumb consignmentId={id} />
        </div>
      </div>

      <Menu
        mode="horizontal"
        defaultSelectedKeys={["detail"]}
        onClick={({ key }) => setCurrentTab(key)}
        className="mb-1"
        style={{ borderRadius: "8px" }}
      >
        <Menu.Item key="detail">Chi tiết tài sản</Menu.Item>
        <Menu.Item key="approveAsset">Duyệt tài sản lên hệ thống</Menu.Item>
        <Menu.Item key="price">Lịch sử giá thuê</Menu.Item>
        <Menu.Item key="historyConsignmentStatus">
          Lịch sử trạng thái ký gửi
        </Menu.Item>
      </Menu>

      <div className="card pb-1">
        {currentTab === "detail" && (
          <Form
            layout="vertical"
            initialValues={{ active: true }}
            form={detailForm}
            onFinish={handleDetailFormFinish}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Thông tin chủ tài sản</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <Form.Item
                label="Họ và tên"
                name={["customer", "customerName"]}
                rules={[
                  {
                    required: true,
                    message: "Họ và tên không được để trống!",
                  },
                ]}
                className="flex-1"
              >
                <Input placeholder="Nhập họ và tên" allowClear />
              </Form.Item>
              <Form.Item
                label="Email"
                name={["customer", "email"]}
                rules={[
                  { required: true, message: "Email không được để trống!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
                className="flex-1"
              >
                <Input placeholder="Nhập email" allowClear />
              </Form.Item>
              <Form.Item
                label="Điện thoại"
                name={["customer", "phoneNumber"]}
                rules={[
                  {
                    required: true,
                    message: "Số điện thoại không được để trống!",
                  },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
                className="flex-1"
              >
                <Input placeholder="Nhập số điện thoại" allowClear />
              </Form.Item>
            </div>

            <Form.Item
              label="Địa chỉ"
              name={["customer", "address"]}
              rules={[
                { required: true, message: "Địa chỉ không được để trống!" },
              ]}
            >
              <Input.TextArea
                placeholder="Nhập địa chỉ (ví dụ: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM)"
                autoSize={{ minRows: 1, maxRows: 3 }}
                allowClear
              />
            </Form.Item>

            <Divider />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Thông tin tài sản</h2>
            </div>

            <div className="flex flex-wrap gap-4">
              <Form.Item
                label="Tên tài sản"
                name={["buildingName"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại tài sản ký gửi!",
                  },
                ]}
                className="flex-1"
              >
                <Input placeholder="Nhập tên tài sản" allowClear />
              </Form.Item>
              <Form.Item
                label="Loại tài sản"
                name={["buildingType", "buildingTypeId"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại tài sản ký gửi!",
                  },
                ]}
                className="flex-1"
              >
                <Select
                  placeholder="Chọn loại tài sản"
                  options={buildingTypeOption}
                  allowClear
                />
              </Form.Item>
              {/* <Form.Item
                label="Giá cho thuê"
                name={[
                  "rentalPricing",
                  detailForm.getFieldValue("rentalPricing")?.length - 1,
                  "price",
                ]}
                rules={[
                  {
                    required: true,
                    message: "Giá cho thuê không được để trống!",
                  },
                ]}
                className="flex-1"
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) => formatCurrency(value)}
                  parser={(value) => parseCurrency(value) as unknown as 0}
                  addonAfter={
                    <span>
                      VND/m<sup>2</sup>/tháng
                    </span>
                  }
                />
              </Form.Item> */}
            </div>
            <div className="flex flex-wrap gap-4">
              <Form.Item
                name="city"
                label="Khu vực"
                className="flex-1"
                rules={[
                  { required: true, message: "Khu vực không được để trống!" },
                ]}
              >
                <Select
                  placeholder="Chọn khu vực"
                  options={addressOptions}
                  allowClear
                  showSearch
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
                  onChange={handleCityChange}
                />
              </Form.Item>

              <Form.Item
                name="district"
                label="Quận/Huyện"
                className="flex-1"
                rules={[
                  {
                    required: true,
                    message: "Quânh/Huyện không được để trống!",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn quận/huyện"
                  options={districts}
                  allowClear
                  showSearch
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
                  onChange={handleDistrictChange}
                />
              </Form.Item>

              <Form.Item
                name="ward"
                label="Phường/Xã"
                className="flex-1"
                rules={[
                  { required: true, message: "Phường/Xã không được để trống!" },
                ]}
              >
                <Select
                  placeholder="Chọn phường/xã"
                  options={wards}
                  allowClear
                  showSearch
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
            </div>
            <div className="flex flex-wrap gap-4">
              <Form.Item
                className="flex-2"
                label="Số nhà"
                name={["buildingNumber"]}
                rules={[
                  { required: true, message: "Số nhàkhông được để trống!" },
                ]}
              >
                <Input placeholder="Nhập số nhà" allowClear />
              </Form.Item>

              <Form.Item
                className="flex-1"
                label="Địa chỉ đường"
                name={["street"]}
                rules={[
                  { required: true, message: "Đường không được để trống!" },
                ]}
              >
                <Input placeholder="Nhập địa chỉ" allowClear />
              </Form.Item>
            </div>

            <div className="flex flex-wrap gap-4">
              <Form.Item
                label="Hướng"
                name={["orientation"]}
                rules={[
                  { required: true, message: "Hướng không được để trống!" },
                ]}
                className="flex-1"
              >
                <Select
                  placeholder="Chọn hướng"
                  allowClear
                  showSearch
                  options={Object.entries(ORENTATION_TRANSLATIONS).map(
                    ([value, label]) => ({
                      label,
                      value,
                    }),
                  )}
                  filterOption={(input, option) =>
                    option?.label.toLowerCase().includes(input.toLowerCase()) ??
                    false
                  }
                />
              </Form.Item>
              <Form.Item
                label="Số tầng"
                name={["numberOfFloors"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số tầng!",
                  },
                ]}
                className="flex-1"
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  addonAfter="tầng"
                />
              </Form.Item>
              <Form.Item
                label="Tổng diện tích"
                name={["totalArea"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập diện tích!",
                  },
                ]}
                className="flex-1"
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  addonAfter="m²"
                />
              </Form.Item>
            </div>

            <Form.Item label="Các loại phí">
              <div className="rounded-md border p-4">
                <Form.List name={["fees"]}>
                  {(fields, { add, remove }) => (
                    <div>
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className="mb-2 flex items-center gap-4">
                          <Form.Item
                            {...restField}
                            name={[name, "feeType", "feeTypeId"]}
                            rules={[
                              { required: true, message: "Chọn loại phí" },
                            ]}
                            className="flex-1"
                          >
                            <Select
                              placeholder="Chọn loại phí"
                              options={feeTypeOption}
                              allowClear
                            />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[
                              name,
                              "feePricing",
                              detailForm.getFieldValue([
                                "fees",
                                name,
                                "feePricing",
                              ])?.length - 1 || 0,
                              "priceValue",
                            ]}
                            className="flex-1"
                          >
                            <InputNumber
                              min={0}
                              style={{ width: "100%" }}
                              formatter={(value) => formatCurrency(value)}
                              parser={(value) =>
                                parseCurrency(value) as unknown as 0
                              }
                              addonAfter={
                                <Select
                                  placeholder="Chọn đơn vị"
                                  options={[
                                    {
                                      value: "VND/m²/tháng",
                                      label: "VND/m²/tháng",
                                    },
                                    {
                                      value: "VND/xe/tháng",
                                      label: "VND/xe/tháng",
                                    },
                                    {
                                      value: "VND/tháng",
                                      label: "VND/tháng",
                                    },
                                    { value: "VND/quý", label: "VND/quý" },
                                    { value: "VND/năm", label: "VND/năm" },
                                    { value: "VND/lần", label: "VND/lần" },
                                  ]}
                                  allowClear
                                  showSearch
                                  value={detailForm.getFieldValue([
                                    "fees",
                                    name,
                                    "feePricing",
                                    detailForm.getFieldValue([
                                      "fees",
                                      name,
                                      "feePricing",
                                    ])?.length - 1 || 0,
                                    "priceUnit",
                                  ])}
                                  onChange={(value) => {
                                    const feePricing =
                                      detailForm.getFieldValue([
                                        "fees",
                                        name,
                                        "feePricing",
                                      ]) || [];
                                    feePricing[feePricing.length - 1 || 0] = {
                                      ...feePricing[feePricing.length - 1 || 0],
                                      priceUnit: value,
                                    };
                                    detailForm.setFieldValue(
                                      ["fees", name, "feePricing"],
                                      feePricing,
                                    );
                                  }}
                                  filterOption={(input, option) =>
                                    option?.label
                                      .toLowerCase()
                                      .includes(input.toLowerCase()) ?? false
                                  }
                                />
                              }
                            />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[
                              name,
                              "feePricing",
                              detailForm.getFieldValue([
                                "fees",
                                name,
                                "feePricing",
                              ])?.length - 1 || 0,
                              "description",
                            ]}
                            className="flex-1"
                          >
                            <Input.TextArea
                              placeholder="Nhập mô tả (nếu có)"
                              autoSize={{ minRows: 1, maxRows: 3 }}
                              allowClear
                            />
                          </Form.Item>

                          <Button
                            type="link"
                            onClick={() => remove(name)}
                            className="items-center text-red-500"
                            icon={<PlusOutlined rotate={45} className="mb-5" />}
                          />
                        </div>
                      ))}
                      <Button
                        type="primary"
                        htmlType="button"
                        className="w-full bg-[#3162ad] hover:bg-[#3162ad]"
                        onClick={() => add()}
                        block
                      >
                        + Thêm phí
                      </Button>
                    </div>
                  )}
                </Form.List>
              </div>
            </Form.Item>

            <div className="flex flex-wrap gap-4">
              <Form.Item
                label="Chu kỳ thanh toán"
                name={[
                  "paymentPolicies",
                  detailForm.getFieldValue("paymentPolicies")?.length - 1,
                  "paymentCycle",
                ]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập chu kỳ thanh toán!",
                  },
                ]}
                className="flex-1"
              >
                <Input placeholder="Nhập chu kỳ thanh toán" allowClear />
              </Form.Item>
              <Form.Item
                label="Thời gian đặt cọc"
                name={[
                  "paymentPolicies",
                  detailForm.getFieldValue("paymentPolicies")?.length - 1,
                  "depositTerm",
                ]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập thời gian đặt cọc!",
                  },
                ]}
                className="flex-1"
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  addonAfter="tháng"
                />
              </Form.Item>
            </div>
            <Form.Item label="Nội dung" name={["description"]}>
              <JoditEditor
                value={detailForm.getFieldValue(["description"])}
                onChange={(value) => {
                  const description = value;
                  detailForm.setFieldsValue({ description });
                }}
                config={{
                  //   readonly: false,
                  //   toolbar: false,
                  theme: theme,
                }}
              />
            </Form.Item>
            <Form.Item
              label="Tải hình ảnh"
              name="buildingImg"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
              rules={[
                {
                  required: true,
                  message: "Vui lòng tải lên ít nhất một hình ảnh!",
                },
              ]}
            >
              <Upload
                multiple
                listType="picture-card"
                fileList={fileList}
                beforeUpload={() => false}
                onPreview={handlePreview}
                onChange={handleUploadChange}
              >
                {fileList.length < 10 && (
                  <button
                    style={{ border: 0, background: "none" }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                  </button>
                )}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-[#3162ad] hover:bg-[#3162ad]"
                loading={isUpdating}
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        )}
        {currentTab === "approveAsset" && (
          <Form
            layout="vertical"
            initialValues={{ active: true }}
            form={approveForm}
            onFinish={handleApproveFormFinish}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Thông tin bắt buộc để duyệt thông tin lên hệ thống
              </h2>
            </div>

            <div className="flex flex-wrap gap-4">
              <Form.Item
                label="Xếp hạng"
                name={["buildingLevel", "buildingLevelId"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng xếp hạng!",
                  },
                ]}
                className="flex-1"
              >
                <Select
                  placeholder="Chọn hạng"
                  options={buildingLevelOption}
                  allowClear
                />
              </Form.Item>
              <Form.Item
                className="flex-1"
                label="Trạng thái tài sản"
                name="buildingStatus"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạng thái tài sản!",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn trạng thái tài sản"
                  options={Object.entries(BUILDING_STATUS_TRANSLATION).map(
                    ([value, label]) => ({
                      label,
                      value,
                    }),
                  )}
                  allowClear
                />
              </Form.Item>
            </div>

            <Form.Item label="Danh sách đơn vị tài sản">
              <div className="rounded-md border p-4">
                <Form.List name={["buildingUnits"]}>
                  {(fields, { add, remove }) => (
                    <div>
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className="mb-2 flex flex-wrap gap-4">
                          <Form.Item
                            {...restField}
                            name={[name, "floor"]}
                            label="Tầng"
                            rules={[
                              { required: true, message: "Nhập số tầng!" },
                            ]}
                            className="w-14"
                          >
                            <InputNumber
                              min={1}
                              style={{ width: "100%" }}
                              placeholder="Nhập số tầng"
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "unitName"]}
                            label="Tên đơn vị"
                            rules={[
                              { required: true, message: "Nhập tên đơn vị!" },
                            ]}
                            className="flex-1"
                          >
                            <Input placeholder="Nhập tên đơn vị" allowClear />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[
                              name,
                              "rentalPricing",
                              approveForm.getFieldValue([
                                "buildingUnits",
                                name,
                                "rentalPricing",
                              ])?.length - 1 || 0,
                              "price",
                            ]}
                            label="Giá cho thuê"
                            rules={[
                              {
                                required: true,
                                message: "Giá cho thuê không được để trống!",
                              },
                            ]}
                            className="flex-[2]"
                          >
                            <InputNumber
                              min={0}
                              style={{ width: "100%" }}
                              formatter={(value) => formatCurrency(value)}
                              parser={(value) =>
                                parseCurrency(value) as unknown as 0
                              }
                              addonAfter={
                                <span>
                                  VND/m<sup>2</sup>/tháng
                                </span>
                              }
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "rentAreas"]}
                            label="Diện tích cho thuê"
                            className="flex-1"
                          >
                            <Form.List name={[name, "rentAreas"]}>
                              {(
                                areaFields,
                                { add: addArea, remove: removeArea },
                              ) => (
                                <div>
                                  {areaFields.map(
                                    ({
                                      key: areaKey,
                                      name: areaName,
                                      ...areaRestField
                                    }) => (
                                      <div
                                        key={areaKey}
                                        className="mb-2 flex items-center gap-4"
                                      >
                                        <Form.Item
                                          {...areaRestField}
                                          name={[areaName, "area"]}
                                          rules={[
                                            {
                                              required: true,
                                              message: "Nhập diện tích!",
                                            },
                                          ]}
                                          className="flex-1"
                                        >
                                          <InputNumber
                                            min={0}
                                            style={{ width: "100%" }}
                                            placeholder="Nhập diện tích"
                                            addonAfter="m²"
                                          />
                                        </Form.Item>
                                        <Button
                                          type="link"
                                          onClick={() => removeArea(areaName)}
                                          className="items-center text-red-500"
                                          icon={
                                            <PlusOutlined
                                              rotate={45}
                                              className="mb-5"
                                            />
                                          }
                                        />
                                      </div>
                                    ),
                                  )}
                                  <Button
                                    type="primary"
                                    htmlType="button"
                                    onClick={() => addArea()}
                                    block
                                  >
                                    + Thêm diện tích
                                  </Button>
                                </div>
                              )}
                            </Form.List>
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "status"]}
                            label="Trạng thái"
                            rules={[
                              {
                                required: true,
                                message: "Chọn trạng thái đơn vị!",
                              },
                            ]}
                            className="flex-1"
                          >
                            <Select
                              placeholder="Chọn trạng thái"
                              options={Object.entries(
                                BUILDING_UNIT_STATUS_TRANSLATION,
                              ).map(([value, label]) => ({
                                label,
                                value,
                              }))}
                              allowClear
                            />
                          </Form.Item>
                          <Button
                            type="link"
                            onClick={() => remove(name)}
                            className="items-center text-red-500"
                            icon={<PlusOutlined rotate={45} className="mb-5" />}
                          />
                        </div>
                      ))}
                      <Button
                        type="primary"
                        htmlType="button"
                        className="w-full bg-[#3162ad] hover:bg-[#3162ad]"
                        onClick={() => add()}
                        block
                      >
                        + Thêm đơn vị tài sản
                      </Button>
                    </div>
                  )}
                </Form.List>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-[#3162ad] hover:bg-[#3162ad]"
                loading={isUpdating}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        )}
        {currentTab === "historyConsignmentStatus" && (
          <>
            <h2 className="mb-8 text-xl font-semibold">
              Lịch sử xét duyệt ký gửi
            </h2>
            <div className="flex gap-8">
              <Timeline mode="left" style={{ paddingLeft: "20px" }}>
                {Array.isArray(building?.consignmentStatusHistories) &&
                  building.consignmentStatusHistories.map((history, index) => {
                    const label =
                      CONSIGNMENT_STATUS_TRANSLATION[
                        history.status as ConsignmentStatus
                      ];
                    const color =
                      history.status === ConsignmentStatus.CANCELLED
                        ? "red"
                        : history.status === ConsignmentStatus.INCOMPLETE
                          ? "orange"
                          : history.status === ConsignmentStatus.CONFIRMED
                            ? "green"
                            : history.status ===
                                ConsignmentStatus.ADDITIONAL_INFO
                              ? "purple"
                              : "blue";

                    return (
                      <Timeline.Item
                        key={index}
                        color={color}
                        position={
                          index ===
                          building.consignmentStatusHistories.length - 1
                            ? "right"
                            : "left"
                        }
                      >
                        <div>
                          <span>
                            <strong>
                              <Tooltip
                                title={
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: history.note,
                                    }}
                                  />
                                }
                              >
                                <em>
                                  {index ===
                                  building.consignmentStatusHistories.length - 1
                                    ? `${label} (Đang áp dụng)`
                                    : label}
                                </em>
                              </Tooltip>
                            </strong>
                          </span>
                          <br />
                          <span>
                            {dayjs(history.createdAt).format(
                              "DD/MM/YYYY HH:mm",
                            )}
                          </span>
                          <br />
                          <span>
                            Người thực hiện:{" "}
                            {history.createdBy === "anonymousUser"
                              ? "Khách hàng"
                              : history.createdBy || "Khách hàng"}
                          </span>
                        </div>
                      </Timeline.Item>
                    );
                  })}
              </Timeline>
            </div>
          </>
        )}
        {currentTab === "price" && (
          <>
            <h2 className="mb-8 text-xl font-semibold">Lịch sử giá thuê</h2>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(building?.buildingUnits) &&
                building.buildingUnits.map((unit, unitIndex) => (
                  <div
                    key={unitIndex}
                    className="rounded-lg border p-4 shadow-md"
                  >
                    <h3 className="mb-4 text-lg font-semibold">
                      Đơn vị: {unit.unitName} (Tầng: {unit.floor})
                    </h3>
                    <Timeline mode="left" style={{ paddingLeft: "20px" }}>
                      {Array.isArray(unit.rentalPricing) &&
                        unit.rentalPricing.map((history, index) => (
                          <Timeline.Item
                            key={index}
                            color="blue"
                            position={
                              index === unit.rentalPricing.length - 1
                                ? "right"
                                : "left"
                            }
                          >
                            <div>
                              <span className="block font-medium">
                                Giá thuê:{" "}
                                <span className="">
                                  {formatCurrency(history.price)} VND/m
                                  <sup>2</sup>/tháng
                                </span>
                                {index === unit.rentalPricing.length - 1 && (
                                  <span className="ml-2 text-green-500">
                                    (Đang áp dụng)
                                  </span>
                                )}
                              </span>
                              <span className="block text-sm text-gray-500">
                                Ngày áp dụng:{" "}
                                {dayjs(history.createdAt).format(
                                  "DD/MM/YYYY HH:mm",
                                )}
                              </span>
                            </div>
                          </Timeline.Item>
                        ))}
                    </Timeline>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BuildingDetail;
