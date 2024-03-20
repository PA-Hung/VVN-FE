import {
  Modal,
  Input,
  notification,
  Form,
  Select,
  message,
  Col,
  Row,
  DatePicker,
} from "antd";
import { getRole, postCreateUser } from "../../utils/api";
import { useEffect, useState } from "react";
import _ from "lodash";
import TextArea from "antd/es/input/TextArea";

const CreateUserModal = (props) => {
  const { getData, isCreateModalOpen, setIsCreateModalOpen } = props;
  const [form] = Form.useForm();
  const [role, setRole] = useState([]);

  const resetModal = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const groupBySelectRole = (data) => {
    return data.map((item) => {
      return { value: item._id, label: item.name };
    });
  };

  useEffect(() => {
    const init = async () => {
      const res = await getRole(`current=1&pageSize=100`);
      if (res.data?.result) {
        setRole(groupBySelectRole(res.data?.result));
      }
    };
    init();
  }, []);

  const onFinish = async (values) => {
    const data = {
      name: values.name,
      phone: values.phone,
      password: values.password,
      role: values.role,
      gender: values.gender,
      birthday: values.birthday,
      level: values.level,
      academic: values.academic,
      experience: values.experience,
      achievements: values.achievements,
      address: values.address,
    };

    const res = await postCreateUser(data);
    if (res.data) {
      await getData();
      message.success("Tạo mới người dùng thành công !");
      resetModal();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  return (
    <>
      <Modal
        title="Thêm mới"
        open={isCreateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
        width={"45%"}
      >
        <Form
          name="create-new-user"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <Row gutter={[8, 8]} justify="left" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={12} xl={8} span={8}>
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[{ required: true, message: "Bạn phải nhập họ tên !" }]}
              >
                <Input placeholder="Nhập tên" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={8} span={8}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập số điện thoại !",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={8} span={8}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Bạn phải nhập mật khẩu !" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={8} span={8}>
              <Form.Item
                label="Chọn quyền"
                name="role"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn quyền !" options={role} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={8} span={8}>
              <Form.Item label="Ngày sinh" name="birthday">
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={8} span={8}>
              <Form.Item label="Giới tính" name="gender">
                <Select
                  placeholder="Chọn giới tính"
                  allowClear
                  options={[
                    { value: "Nam", label: "Nam" },
                    { value: "Nữ", label: "Nữ" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={8} span={8}>
              <Form.Item label="Đẳng cấp chuyên môn" name="level">
                <Input placeholder="Nhập khóa thi" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={8} span={8}>
              <Form.Item label="Trình độ học vấn" name="academic">
                <Input placeholder="Nhập trình độ học vấn" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={8} span={8}>
              <Form.Item label="Quá trình tập luyện" name="experience">
                <Input placeholder="Nhập quá trình tập luyện" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={8} span={8}>
              <Form.Item label="Thành tích" name="achievements">
                <Input placeholder="Nhập thành tích" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} span={8}>
              <Form.Item label="Địa chỉ" name="address">
                <TextArea
                  placeholder="Nhập địa chỉ"
                  showCount
                  maxLength={100}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUserModal;
