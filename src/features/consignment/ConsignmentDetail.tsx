import { SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Descriptions,
  Divider,
  Form,
  Image,
  InputNumber,
  Menu,
  Radio,
  Select,
  Space,
  Timeline,
  Tooltip,
  Upload,
  UploadProps,
} from "antd";
import { UploadFile } from "antd/lib";
import dayjs from "dayjs";
import JoditEditor from "jodit-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router";
import Loading from "../../common/components/Loading";
import { FileType, IConsignment } from "../../interfaces";
import { CONSIGNMENT_STATUS_TRANSLATION } from "../../interfaces/common/constants";
import { ConsignmentStatus } from "../../interfaces/common/enums";
import { buildingTypeService } from "../../services";
import { consignmentService } from "../../services/consignment/consignment-service";
import {
  formatCurrency,
  getBase64,
  parseCurrency,
  toSnakeCase,
} from "../../utils";
import ConsignmentBreadcrumb from "./Breadcrumb/ConsignmentBreadcrumb";
import { useGetCitys } from "./hooks";

interface UpdateConsignmentArgs {
  consignmentId: string;
  updatedConsignment: FormData;
}
export interface ConsignmentFormValues extends IConsignment {
  consignmentImg: UploadFile[];
}

const ConsignmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form] = Form.useForm<ConsignmentFormValues>();

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined,
  );
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

  const [status, setStatus] = useState<string | undefined>(
    form.getFieldValue("status"),
  );

  const { data, isLoading } = useQuery({
    queryFn: () => consignmentService.getConsignmentById(id!),
    queryKey: ["consignments", id],
  });

  const consignment = data?.payload;

  useEffect(() => {
    if (consignment) {
      form.setFieldsValue({
        ...consignment,
      });
      setPreviewImage(consignment.consignmentImages?.[0]?.imgUrl ?? undefined);
      setFileList(
        consignment.consignmentImages?.map((image, index) => ({
          uid: `${index}`,
          name: image.imgUrl || `image-${index}`,
          status: "done",
          url: image.imgUrl,
        })) || [],
      );
    }
  }, [consignment, form]);

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

  const handlePreview = useCallback(async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || file.preview || "");
    setPreviewOpen(true);
  }, []);

  const handleUploadChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);
    form.setFieldsValue({ consignmentImg: fileList });
  };

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

  const { mutate: updateConsignment, isPending: isUpdating } = useMutation({
    mutationFn: ({
      consignmentId,
      updatedConsignment,
    }: UpdateConsignmentArgs) => {
      return consignmentService.update(consignmentId, updatedConsignment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("users");
        },
      });
    },
  });

  function handleFinish(values: IConsignment) {
    if (consignment) {
      const updatedConsignment = {
        ...consignment,
        ...values,
      };
      const formData = new FormData();
      formData.append(
        "customer",
        JSON.stringify(toSnakeCase(updatedConsignment)),
      );

      // if (fileList.length > 0) {
      //   fileList.forEach((file) => {
      //     formData.append("consignmentImg", file.originFileObj as FileType);
      //   });
      // } else {
      //   formData.append("consignmentImg", "");
      // }
      updateConsignment(
        {
          consignmentId: consignment.consignmentId.toString(),
          updatedConsignment: formData,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật thông tin thành công");
          },
          onError: () => {
            toast.error("Cập nhật thông tin thất bại");
          },
        },
      );
    } else {
      toast.error("User ID is missing");
    }
  }
  const [currentTab, setCurrentTab] = useState<string>("detail");

  if (isLoading || isBuildingTypesLoading || !consignment) {
    return <Loading />;
  }

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center">
        <Tooltip title="Quay lại">
          <Button icon={<GoArrowLeft />} onClick={() => navigate(-1)} />
        </Tooltip>
        <div className="ml-2">
          <ConsignmentBreadcrumb consignmentId={id} />
        </div>
      </div>

      <Menu
        mode="horizontal"
        defaultSelectedKeys={["detail"]}
        onClick={({ key }) => setCurrentTab(key)}
        className="mb-1"
        style={{ borderRadius: "8px" }}
      >
        <Menu.Item key="detail">Chi tiết ký gửi</Menu.Item>
        <Menu.Item key="approval">Xét duyệt ký gửi</Menu.Item>
      </Menu>

      <div className="card pb-1">
        {currentTab === "detail" && (
          <Form layout="vertical" initialValues={{ active: true }} form={form}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Thông tin khách hàng</h2>
            </div>
            <Descriptions column={3}>
              <Descriptions.Item label="Email">
                <a href={`mailto:${form.getFieldValue(["customer", "email"])}`}>
                  {form.getFieldValue(["customer", "email"])}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Tên khách hàng">
                {form.getFieldValue(["customer", "customerName"])}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                <Tooltip title="Liên hệ qua Zalo hoặc gọi điện">
                  <a
                    href={`tel:${form.getFieldValue([
                      "customer",
                      "phoneNumber",
                    ])}`}
                  >
                    {form.getFieldValue(["customer", "phoneNumber"])}
                  </a>
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {form.getFieldValue(["customer", "address"])}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Sản phẩm ký gửi</h2>
            </div>
            <div className="flex gap-8">
              <Form.Item
                label="Loại tòa nhà"
                name="buildingType"
                className="flex-1"
              >
                <Select
                  allowClear
                  showSearch
                  disabled
                  placeholder="Chọn loại toà nhà"
                  options={buildingTypeOption}
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
              <Form.Item
                label="Giá sản phẩm ký gửi"
                name="price"
                className="flex-1"
              >
                <InputNumber
                  min={0}
                  disabled
                  addonAfter="VND/m²"
                  style={{ width: "100%" }}
                  formatter={(value) => formatCurrency(value)}
                  parser={(value) => parseCurrency(value) as unknown as 0}
                />
              </Form.Item>
            </div>
            <div className="flex gap-8">
              <Form.Item name="city" label="Khu vực" className="flex-1">
                <Select
                  disabled
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

              <Form.Item name="district" label="Quận/Huyện" className="flex-1">
                <Select
                  disabled
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

              <Form.Item name="ward" label="Phường/Xã" className="flex-1">
                <Select
                  disabled
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
            <Form.Item label="Mô tả" name="description">
              <JoditEditor
                key={theme}
                value={form.getFieldValue("description")}
                config={{
                  readonly: true,
                  toolbar: false,
                  theme: theme, // Sử dụng state theme từ localStorage
                }}
              />
            </Form.Item>

            <Form.Item
              label="Hình ảnh minh chứng"
              name="consignmentImg"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
            >
              <div style={{ display: "flex", overflowX: "auto" }}>
                <Upload
                  multiple
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={() => false}
                  onPreview={handlePreview}
                  onChange={handleUploadChange}
                  showUploadList={{ showRemoveIcon: false }}
                />
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
              </div>
            </Form.Item>
          </Form>
        )}
        {currentTab === "approval" && (
          <>
            <h2 className="mb-8 text-xl font-semibold">Trạng thái xét duyệt</h2>
            <div className="flex gap-8">
              <div className="flex-1/2">
                <Timeline mode="left" style={{ paddingLeft: "20px" }}>
                  {Object.entries(CONSIGNMENT_STATUS_TRANSLATION).map(
                    ([value, label]) => {
                      const date =
                        value === ConsignmentStatus.PENDING
                          ? consignment?.createdAt
                          : value === ConsignmentStatus.INCOMPLETE
                            ? consignment?.additionalInfoAt
                            : value === ConsignmentStatus.CANCELLED
                              ? consignment?.rejectedReasonAt
                              : value === ConsignmentStatus.CONFIRMED
                                ? consignment?.confirmedAt
                                : null;
                      const color = date
                        ? value === ConsignmentStatus.CANCELLED
                          ? "red"
                          : value === ConsignmentStatus.INCOMPLETE
                            ? "orange"
                            : value === ConsignmentStatus.CONFIRMED
                              ? "green"
                              : "blue"
                        : "gray";

                      return (
                        <Timeline.Item key={value} color={color}>
                          <div>
                            <span>{label}</span>
                            <br />
                            <span>
                              {date
                                ? dayjs(date).format("DD/MM/YYYY HH:mm")
                                : ""}
                            </span>
                          </div>
                        </Timeline.Item>
                      );
                    },
                  )}
                </Timeline>
              </div>
              <Divider type="vertical" style={{ height: "auto" }} />
              <div className="flex-1">
                <Form
                  layout="vertical"
                  initialValues={{ active: true }}
                  form={form}
                  onFinish={handleFinish}
                >
                  <Form.Item
                    name="status"
                    rules={[
                      { required: true, message: "Vui lòng chọn trạng thái" },
                    ]}
                  >
                    <Radio.Group
                      onChange={(e) => {
                        const status = e.target.value;
                        setStatus(status);
                        form.setFieldsValue({
                          status: status as ConsignmentStatus,
                        });
                      }}
                      value={form.getFieldValue("status")}
                    >
                      {Object.entries(CONSIGNMENT_STATUS_TRANSLATION)
                        .filter(
                          ([value]) => value !== ConsignmentStatus.PENDING,
                        )
                        .map(([value, label]) => (
                          <Radio
                            key={value}
                            value={value}
                            disabled={
                              form.getFieldValue("status") ===
                                ConsignmentStatus.CONFIRMED &&
                              (value === ConsignmentStatus.CANCELLED ||
                                value === ConsignmentStatus.INCOMPLETE)
                            }
                          >
                            {label}
                          </Radio>
                        ))}
                    </Radio.Group>
                  </Form.Item>

                  {form.getFieldValue("status") ===
                    ConsignmentStatus.INCOMPLETE && (
                    <Form.Item
                      label="Bổ sung thông tin ký gửi"
                      name="additionalInfo"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập thông tin cần bổ sung",
                        },
                      ]}
                    >
                      <JoditEditor
                        key={theme}
                        value={form.getFieldValue("additionalInfo")}
                        config={{
                          readonly: false,
                          toolbar: true,
                          theme: theme,
                        }}
                      />
                    </Form.Item>
                  )}

                  {form.getFieldValue("status") ===
                    ConsignmentStatus.CANCELLED && (
                    <Form.Item
                      label="Lý do từ chối"
                      name="rejectedReason"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập lý do từ chối",
                        },
                      ]}
                    >
                      <JoditEditor
                        key={theme}
                        value={form.getFieldValue("rejectionReason")}
                        config={{
                          readonly: false,
                          toolbar: true,
                          theme: theme,
                        }}
                      />
                    </Form.Item>
                  )}
                </Form>
              </div>
            </div>
            <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
              <Space>
                <Button
                  type="default"
                  disabled={isUpdating}
                  onClick={() => {
                    if (consignment) {
                      form.setFieldsValue({
                        ...consignment,
                      });
                      setPreviewImage(
                        consignment.consignmentImages?.[0]?.imgUrl ?? "",
                      );
                      setFileList(
                        consignment.consignmentImages?.map((image, index) => ({
                          uid: `${index}`,
                          name: image.imgUrl || `image-${index}`,
                          status: "done",
                          url: image.imgUrl,
                        })) || [],
                      );
                    }
                  }}
                >
                  Huỷ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isUpdating}
                  icon={<SaveOutlined />}
                >
                  Lưu lại
                </Button>
              </Space>
            </Form.Item>
          </>
        )}
      </div>
    </div>
  );
};

export default ConsignmentDetail;
