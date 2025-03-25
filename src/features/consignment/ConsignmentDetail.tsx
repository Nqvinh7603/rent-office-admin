import { SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Descriptions,
  Divider,
  Flex,
  Form,
  Image,
  Menu,
  Radio,
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
import { FileType, IBuilding, IBuildingUnit } from "../../interfaces";
import {
  CONSIGNMENT_STATUS_TRANSLATION,
  ORENTATION_TRANSLATIONS,
} from "../../interfaces/common/constants";
import { ConsignmentStatus } from "../../interfaces/common/enums";
import { buildingTypeService } from "../../services";
import { buildingService } from "../../services/building/building-service";
import { feeTypeService } from "../../services/building/fee-type-service";
import { formatCurrency, getBase64, toSnakeCase } from "../../utils";
import ConsignmentBreadcrumb from "./Breadcrumb/ConsignmentBreadcrumb";
import { useGetCitys } from "./hooks";

interface UpdateBuildingArgs {
  buildingId: string;
  updatedBuilding: FormData;
}
export interface BuildingFormValues extends IBuilding {
  buildingImg: UploadFile[];
}

const ConsignmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form] = Form.useForm<BuildingFormValues>();

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
    form.getFieldValue(["consignmentStatusHistories", 0, "status"]),
  );

  const { data, isLoading } = useQuery({
    queryFn: () => buildingService.getBuildingById(id!),
    queryKey: ["buildings", id],
  });

  const building = data?.payload;

  useEffect(() => {
    if (building) {
      form.setFieldsValue({
        ...building,
      });
      setPreviewImage(building.buildingImages?.[0]?.imgUrl ?? undefined);
      setFileList(
        building.buildingImages?.map((image, index) => ({
          uid: `${index}`,
          name: image.imgUrl || `image-${index}`,
          status: "done",
          url: image.imgUrl,
        })) || [],
      );
    }
  }, [building, form]);

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

  // const handleDistrictChange = (value: string) => {
  //   const selectedDistrict = districts.find(
  //     (district) => district.value === value,
  //   );
  //   if (selectedDistrict && selectedDistrict.wards) {
  //     setWards(
  //       selectedDistrict.wards.map((ward) => ({
  //         label: ward.name,
  //         value: ward.name,
  //       })),
  //     );
  //   } else {
  //     setWards([]);
  //   }
  // };

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
    form.setFieldsValue({ buildingImg: fileList });
  };

  const { data: buildingTypesData, isLoading: isBuildingTypesLoading } =
    useQuery({
      queryKey: ["building-types"],
      queryFn: buildingTypeService.getAllBuildingTypes,
    });

  // const buildingTypeOption = buildingTypesData?.payload?.map(
  //   (buildingType) => ({
  //     label: buildingType.buildingTypeName,
  //     value: buildingType.buildingTypeName,
  //   }),
  // );

  const { data: feeTypesData, isLoading: isFeeTypesLoading } = useQuery({
    queryKey: ["fee-types"],
    queryFn: feeTypeService.getAllFeeTypes,
  });

  const feeTypeOptions =
    feeTypesData?.payload?.map((type) => ({
      label: type.feeTypeName,
      value: type.feeTypeId,
    })) || [];

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

  function handleFinish(values: IBuilding) {
    if (building) {
      const updatedBuilding = {
        ...building,
        ...values,
      };
      const formData = new FormData();
      formData.append("customer", JSON.stringify(toSnakeCase(updatedBuilding)));

      if (fileList.length > 0) {
        fileList.forEach((file) => {
          formData.append("buildingImg", file.originFileObj as FileType);
        });
      } else {
        formData.append("buildingImg", "");
      }
      updateBuilding(
        {
          buildingId: building.buildingId.toString(),
          updatedBuilding: formData,
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

  if (isLoading || isBuildingTypesLoading || !building) {
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
                <Tooltip title="Gửi email">
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${form.getFieldValue(["customer", "email"])}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {form.getFieldValue(["customer", "email"])}
                  </a>
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="Tên khách hàng">
                {form.getFieldValue(["customer", "customerName"])}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                <Tooltip title="Liên hệ qua Zalo hoặc gọi điện">
                  <a
                    href={`https://zalo.me/${form.getFieldValue([
                      "customer",
                      "phoneNumber",
                    ])}`}
                    target="_blank"
                    rel="noopener noreferrer"
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

            <Descriptions layout="horizontal" className="mb-4">
              <Descriptions.Item label="Tên tòa nhà">
                {form.getFieldValue("buildingName")}
              </Descriptions.Item>
              <Descriptions.Item label="Loại tòa nhà">
                {form.getFieldValue(["buildingType", "buildingTypeName"])}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Giá sản phẩm ký gửi">
                {formatCurrency(
                  form.getFieldValue([
                    "rentalPricing",
                    building?.rentalPricing?.length - 1 || 0,
                    "price",
                  ]),
                )}{" "}
                VND/m²
              </Descriptions.Item> */}
              <Descriptions.Item label="Tổng số tầng">
                {form.getFieldValue("numberOfFloors")} tầng
              </Descriptions.Item>
              <Descriptions.Item label="Tổng số diện tích sàn">
                {form.getFieldValue("totalArea")} m²
              </Descriptions.Item>
              <Descriptions.Item label="Hướng toà nhà">
                {
                  ORENTATION_TRANSLATIONS[
                    form.getFieldValue(
                      "orientation",
                    ) as keyof typeof ORENTATION_TRANSLATIONS
                  ]
                }
              </Descriptions.Item>
              <Descriptions.Item label="Khu vực">
                {form.getFieldValue("city")}
              </Descriptions.Item>
              <Descriptions.Item label="Quận/Huyện">
                {form.getFieldValue("district")}
              </Descriptions.Item>
              <Descriptions.Item label="Phường/Xã">
                {form.getFieldValue("ward")}
              </Descriptions.Item>
              <Descriptions.Item label="Số nhà">
                {form.getFieldValue("buildingNumber")}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ đường">
                {form.getFieldValue("street")}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Các loại phí"
              layout="horizontal"
              bordered
              className="mb-4"
              column={1}
            >
              <Descriptions.Item label="Chu kỳ thanh toán">
                {form.getFieldValue([
                  "paymentPolicies",
                  form.getFieldValue("paymentPolicies")?.length - 1 || 0,
                  "paymentCycle",
                ])}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian đặt cọc">
                {form.getFieldValue([
                  "paymentPolicies",
                  form.getFieldValue("paymentPolicies")?.length - 1 || 0,
                  "depositTerm",
                ])}{" "}
                tháng
              </Descriptions.Item>
              {form.getFieldValue("fees")?.map(
                (
                  fee: {
                    feeType?: { feeTypeId: string };
                    feePricing?: {
                      priceValue: number;
                      priceUnit: string;
                      description?: string;
                    }[];
                  },
                  index: number,
                ) => (
                  <Descriptions.Item
                    key={index}
                    label={
                      feeTypeOptions.find(
                        (option) =>
                          option.value ===
                          Number(fee.feeType?.feeTypeId?.toString()),
                      )?.label || "Loại phí"
                    }
                  >
                    {fee.feePricing?.[fee.feePricing.length - 1]?.priceValue &&
                    fee.feePricing?.[fee.feePricing.length - 1]?.priceUnit ? (
                      <>
                        {formatCurrency(
                          fee.feePricing?.[fee.feePricing.length - 1]
                            ?.priceValue,
                        )}{" "}
                        {fee.feePricing?.[fee.feePricing.length - 1]?.priceUnit}
                      </>
                    ) : fee.feePricing?.[fee.feePricing.length - 1]
                        ?.description ? (
                      <div>
                        {
                          fee.feePricing?.[fee.feePricing.length - 1]
                            ?.description
                        }
                      </div>
                    ) : null}
                  </Descriptions.Item>
                ),
              )}
            </Descriptions>

            <Descriptions
              title="Giá thuê và diện tích sản phẩm ký gửi"
              layout="horizontal"
              bordered
              className="mb-4"
              column={4}
            >
              {form
                .getFieldValue("buildingUnits")
                ?.map((buildingUnit: IBuildingUnit, index: number) => (
                  <>
                    <Descriptions.Item key={`floor-${index}`} label="Tầng">
                      {buildingUnit.floor || "Không xác định"}
                    </Descriptions.Item>
                    <Descriptions.Item key={`unitName-${index}`} label="Đơn vị">
                      {buildingUnit.unitName || `Đơn vị ${index + 1}`}
                    </Descriptions.Item>
                    <Descriptions.Item key={`area-${index}`} label="Diện tích">
                      {buildingUnit.rentAreas?.length
                        ? `${buildingUnit.rentAreas.map((area) => area.area || "Không xác định").join(", ")} m²`
                        : "Không xác định"}
                    </Descriptions.Item>
                    <Descriptions.Item
                      key={`rentalPricing-${index}`}
                      label="Giá thuê"
                    >
                      {buildingUnit.rentalPricing?.length ? (
                        buildingUnit.rentalPricing.map(
                          (pricing, pricingIndex) => (
                            <div
                              key={pricingIndex}
                              style={{ marginBottom: "8px" }}
                            >
                              {pricing.price ? (
                                <>
                                  {formatCurrency(pricing.price)} VND/m²/tháng
                                </>
                              ) : (
                                <div>Không có thông tin giá thuê</div>
                              )}
                            </div>
                          ),
                        )
                      ) : (
                        <div>Không có thông tin giá thuê</div>
                      )}
                    </Descriptions.Item>
                  </>
                ))}
            </Descriptions>

            {form.getFieldValue("description") && (
              <Form.Item
                label={<span style={{ opacity: 0.6 }}>Mô tả</span>}
                name="description"
              >
                <JoditEditor
                  key={theme}
                  value={form.getFieldValue("description")}
                  config={{
                    readonly: true,
                    toolbar: false,
                    theme: theme,
                  }}
                />
              </Form.Item>
            )}

            <Form.Item
              label={<span style={{ opacity: 0.6 }}>Hình ảnh minh chứng</span>}
              name="buildingImg"
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
                  beforeUpload={() => true}
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
                  {building?.consignmentStatusHistories.map(
                    (history, index) => {
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
                        <Timeline.Item key={index} color={color}>
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
                                  <em>{label}</em>
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
                    name={["consignmentStatusHistories", 0, "status"]}
                    rules={[
                      { required: true, message: "Vui lòng chọn trạng thái" },
                    ]}
                  >
                    <Flex vertical gap="middle">
                      <Radio.Group
                        buttonStyle="solid"
                        block
                        options={Object.entries(CONSIGNMENT_STATUS_TRANSLATION)
                          .filter(
                            ([value]) =>
                              value !== ConsignmentStatus.PENDING &&
                              value !== ConsignmentStatus.ADDITIONAL_INFO,
                          )
                          .map(([value, label]) => ({
                            label,
                            value,
                            // disabled:
                            //   form.getFieldValue([
                            //     "consignmentStatusHistories",
                            //     0,
                            //     "status",
                            //   ]) === ConsignmentStatus.CONFIRMED &&
                            //   (value === ConsignmentStatus.CANCELLED ||
                            //     value === ConsignmentStatus.INCOMPLETE),
                          }))}
                        defaultValue={form.getFieldValue([
                          "consignmentStatusHistories",
                          0,
                          "status",
                        ])}
                        optionType="button"
                        onChange={(e) => {
                          const status = e.target.value;
                          setStatus(status);
                          form.setFieldsValue({
                            consignmentStatusHistories: [
                              { status: status as ConsignmentStatus },
                            ],
                          });
                        }}
                      />
                    </Flex>
                  </Form.Item>

                  {form.getFieldValue([
                    "consignmentStatusHistories",
                    0,
                    "status",
                  ]) === ConsignmentStatus.INCOMPLETE && (
                    <Form.Item
                      label="Bổ sung thông tin ký gửi"
                      name={["consignmentStatusHistories", 0, "note"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập thông tin cần bổ sung",
                        },
                      ]}
                    >
                      <JoditEditor
                        key={theme}
                        value={form.getFieldValue([
                          "consignmentStatusHistories",
                          0,
                          "note",
                        ])}
                        config={{
                          readonly: false,
                          toolbar: true,
                          theme: theme,
                        }}
                      />
                    </Form.Item>
                  )}

                  {form.getFieldValue([
                    "consignmentStatusHistories",
                    0,
                    "status",
                  ]) === ConsignmentStatus.CANCELLED && (
                    <Form.Item
                      label="Lý do từ chối"
                      name={["consignmentStatusHistories", 0, "note"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập lý do từ chối",
                        },
                      ]}
                    >
                      <JoditEditor
                        key={theme}
                        value={form.getFieldValue([
                          "consignmentStatusHistories",
                          0,
                          "note",
                        ])}
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
                    if (building) {
                      form.setFieldsValue({
                        ...building,
                      });
                      setPreviewImage(
                        building.buildingImages?.[0]?.imgUrl ?? "",
                      );
                      setFileList(
                        building.buildingImages?.map((image, index) => ({
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
                  loading={isUpdating}
                  icon={<SaveOutlined />}
                  onClick={() => {
                    form.submit();
                  }}
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
