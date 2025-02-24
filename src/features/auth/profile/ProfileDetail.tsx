import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Image,
  Input,
  Radio,
  Space,
  Upload,
  UploadProps,
} from "antd";
import { UploadFile } from "antd/lib";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FileType, IUser } from "../../../interfaces";
import { useLoggedInUser } from "../hooks/useLoggedInUser";
import { userService } from "../../../services";
import { getBase64, toSnakeCase } from "../../../utils";
const genderOptions = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" },
];

interface UpdateUserArgs {
  userId: string;
  updatedUser: FormData;
}

interface UpdateUserFormValues extends IUser {
  userImg?: UploadFile[];
}

const ProfileDetail: React.FC = () => {
  const { user: currentUser } = useLoggedInUser();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<UpdateUserFormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        ...currentUser,
      });
      setPreviewImage(currentUser.avatarUrl ?? "");
      setFileList(
        currentUser.avatarUrl
          ? [
              {
                uid: "-1",
                name: currentUser.email,
                status: "done",
                url: currentUser.avatarUrl,
              },
            ]
          : [],
      );
    }
  }, [currentUser, form]);

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: ({ userId, updatedUser }: UpdateUserArgs) => {
      return userService.update(userId, updatedUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("users");
        },
      });
    },
  });

  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    return current && dayjs(current).isAfter(dayjs().endOf("day"));
  };

  async function handlePreview(file: UploadFile) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || file.preview || "");
    setPreviewOpen(true);
  }

  const handleUploadChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);
  };

  function handleFinish(values: IUser) {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        ...values,
        firstName: values.firstName.toUpperCase(),
        lastName: values.lastName.toUpperCase(),
      };
      const formData = new FormData();
      formData.append("user", JSON.stringify(toSnakeCase(updatedUser)));

      if (fileList.length > 0) {
        formData.append("userImg", fileList[0].originFileObj as FileType);
      } else {
        formData.append("userImg", "");
      }
      updateUser(
        { userId: currentUser.userId, updatedUser: formData },
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

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      initialValues={{ active: true }}
    >
      <Form.Item
        name="userImg"
        label="Ảnh đại diện"
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
      >
        <Upload
          maxCount={1}
          listType="picture-card"
          fileList={fileList}
          beforeUpload={() => false}
          onPreview={handlePreview}
          onChange={handleUploadChange}
          showUploadList={{
            showRemoveIcon: true,
          }}
        >
          {fileList.length < 1 && (
            <button style={{ border: 0, background: "none" }} type="button">
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
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Form.Item>

      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          label="Họ"
          name="lastName"
          rules={[
            {
              required: false,
              message: "Vui lòng nhập họ",
            },
            {
              pattern: /^[a-zA-Z\s]+$/,
              message: "Họ không chứa ký tự đặc biệt",
            },
          ]}
        >
          <Input
            placeholder="Họ, ví dụ NGUYEN"
            style={{ textTransform: "uppercase" }}
          />
        </Form.Item>
        <Form.Item
          className="flex-1"
          label="Tên đệm & tên"
          name="firstName"
          rules={[
            {
              required: false,
              message: "Vui lòng nhập tên đệm & tên",
            },
            {
              pattern: /^[a-zA-Z\s]+$/,
              message: "Tên đệm & tên không chứa ký tự đặc biệt",
            },
          ]}
        >
          <Input
            placeholder="Tên đệm & tên, ví dụ VAN A"
            style={{ textTransform: "uppercase" }}
          />
        </Form.Item>
      </div>
      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          label="Ngày sinh"
          name="dateOfBirth"
          rules={[
            {
              message: "Ngày sinh không hợp lệ",
            },
          ]}
          getValueProps={(value: string) => ({
            value: value && dayjs(value),
          })}
          normalize={(value: Dayjs) => value && value.tz().format("YYYY-MM-DD")}
        >
          <DatePicker
            className="w-full"
            format="DD/MM/YYYY"
            disabledDate={disabledDate}
            placeholder="Chọn ngày sinh"
          />
        </Form.Item>

        <Form.Item
          className="flex-1"
          label="Giới tính"
          name="gender"
          rules={[
            {
              required: false,
              message: "Vui lòng chọn giới tính",
            },
          ]}
        >
          <Radio.Group className="space-x-4" options={genderOptions} />
        </Form.Item>
      </div>
      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            {
              required: false,
              message: "Vui lòng nhập số điện thoại",
            },
            {
              pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
              message: "Số điện thoại không hợp lệ",
            },
          ]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>
      </div>
      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          label="Email"
          name="email"
          rules={[
            {
              required: false,
              message: "Vui lòng nhập email",
            },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Email không hợp lệ",
            },
          ]}
        >
          <Input placeholder="Email" disabled={true} />
        </Form.Item>
      </div>
      {
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Space>
            <Button
              type="default"
              onClick={() => {
                if (currentUser) {
                  form.setFieldsValue({
                    ...currentUser,
                  });
                  setPreviewImage(currentUser.avatarUrl ?? "");
                  setFileList(
                    currentUser.avatarUrl
                      ? [
                          {
                            uid: "-1",
                            name: currentUser.email,
                            status: "done",
                            url: currentUser.avatarUrl,
                          },
                        ]
                      : [],
                  );
                }
              }}
              disabled={isUpdating}
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
      }
    </Form>
  );
};

export default ProfileDetail;
