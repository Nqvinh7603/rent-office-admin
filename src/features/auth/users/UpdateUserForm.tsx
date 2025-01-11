import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Switch,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Loading from "../../../common/components/Loading";
import { IUser } from "../../../interfaces";
import { roleService, userService } from "../../../services";

interface UpdateUserFormProps {
  userToUpdate?: IUser;
  onCancel: () => void;
  viewOnly?: boolean;
}

const genderOptions = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" },
];

interface UpdateUserArgs {
  userId: string;
  updatedUser: IUser;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({
  userToUpdate,
  onCancel,
  viewOnly = false,
}) => {
  const [form] = Form.useForm<IUser>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (userToUpdate) {
      form.setFieldsValue({
        ...userToUpdate,
      });
    }
  }, [userToUpdate, form]);

  const { data: rolesData, isLoading: isRolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: roleService.getAllRoles,
  });

  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("users");
        },
      });
    },
  });

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

  const roleOptions = rolesData?.payload?.map((role) => ({
    value: role.roleId,
    label: role.roleName,
  }));

  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    return current && dayjs(current).isAfter(dayjs().endOf("day"));
  };

  function handleFinish(values: IUser) {
    if (userToUpdate) {
      const updatedUser = {
        ...userToUpdate,
        ...values,
        firstName: values.firstName.toUpperCase(),
        lastName: values.lastName.toUpperCase(),
      };
      updateUser(
        { userId: userToUpdate.userId, updatedUser },
        {
          onSuccess: () => {
            toast.success("Cập nhật người dùng thành công");
            onCancel();
            form.resetFields();
          },
          onError: () => {
            toast.error("Cập nhật người dùng thất bại");
          },
        },
      );
      //console.log("updateUser", { userId: userToUpdate.userId, updatedUser });
    } else {
      const newUser = {
        ...values,
        firstName: values.firstName.toUpperCase(),
        lastName: values.lastName.toUpperCase(),
      };
      createUser(newUser, {
        onSuccess: () => {
          toast.success("Thêm mới người dùng thành công");
          onCancel();
          form.resetFields();
        },
        onError: () => {
          toast.error("Thêm mới người dùng thất bại");
        },
      });
    }
  }

  if (isRolesLoading) {
    return <Loading />;
  }

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      initialValues={{ active: true }}
    >
      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          label="Họ"
          name="lastName"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập họ",
            },
            {
              pattern: /^[a-zA-Z\s]+$/,
              message: "Họ không chứa ký tự đặc biệt",
            },
          ]}
        >
          <Input
            readOnly={viewOnly}
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
              required: true,
              message: "Vui lòng nhập tên đệm & tên",
            },
            {
              pattern: /^[a-zA-Z\s]+$/,
              message: "Tên đệm & tên không chứa ký tự đặc biệt",
            },
          ]}
        >
          <Input
            readOnly={viewOnly}
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
              required: true,
              message: "Ngày sinh không hợp lệ",
            },
          ]}
          getValueProps={(value: string) => ({
            value: value && dayjs(value),
          })}
          normalize={(value: Dayjs) => value && value.tz().format("YYYY-MM-DD")}
        >
          <DatePicker
            disabled={viewOnly}
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
              required: true,
              message: "Vui lòng chọn giới tính",
            },
          ]}
        >
          <Radio.Group
            disabled={viewOnly}
            className="space-x-4"
            options={genderOptions}
          />
        </Form.Item>
      </div>
      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điện thoại",
            },
            {
              pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
              message: "Số điện thoại không hợp lệ",
            },
          ]}
        >
          <Input readOnly={viewOnly} placeholder="Số điện thoại" />
        </Form.Item>
      </div>
      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          label="Vai trò"
          name={["role", "roleId"]}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn vai trò",
            },
          ]}
        >
          <Select
            disabled={viewOnly}
            placeholder="Chọn vai trò"
            options={roleOptions}
          />
        </Form.Item>
        <Form.Item
          className="flex-1"
          label="Trạng thái"
          name="active"
          valuePropName="checked"
        >
          <Switch
            disabled={viewOnly}
            checkedChildren="ACTIVE"
            unCheckedChildren="INACTIVE"
          />
        </Form.Item>
      </div>
      <div className="flex gap-8">
        <Form.Item
          className="flex-1"
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email",
            },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Email không hợp lệ",
            },
          ]}
        >
          <Input readOnly={viewOnly} placeholder="Email" />
        </Form.Item>
      </div>
      {!userToUpdate && (
        <div className="flex gap-8">
          <Form.Item
            className="flex-1"
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu",
              },
              {
                min: 6,
                message: "Mật khẩu phải chứa ít nhất 6 ký tự",
              },
            ]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
        </div>
      )}
      {!viewOnly && (
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Space>
            <Button onClick={onCancel} loading={isCreating || isUpdating}>
              Hủy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
            >
              {userToUpdate ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default UpdateUserForm;
