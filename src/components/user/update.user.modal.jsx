import { useEffect, useState } from "react";
import {
  Modal,
  Input,
  notification,
  Form,
  Select,
  message,
  Row,
  Col,
  DatePicker,
} from "antd";
import { getRole, updateUser } from "@/utils/api";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

const UpdateUserModal = (props) => {
  const {
    updateData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    getData,
    setUpdateData,
  } = props;
  const [form] = Form.useForm();
  const [role, setRole] = useState([]);

  useEffect(() => {
    const init = async () => {
      const res = await getRole(`current=1&pageSize=30`);
      if (res.data?.result) {
        setRole(groupBySelectRole(res.data?.result));
      }
    };
    init();
  }, []);

  const groupBySelectRole = (data) => {
    return data.map((item) => ({ value: item._id, label: item.name }));
  };

  useEffect(() => {
    if (updateData) {
      const birthdayDayJS = dayjs(updateData.birthday).isValid()
        ? dayjs(updateData.date)
        : null;
      form.setFieldsValue({
        name: updateData.name,
        phone: updateData.phone,
        role: updateData.role._id,
        gender: updateData.gender,
        birthday: birthdayDayJS,
        level: updateData.level,
        academic: updateData.academic,
        experience: updateData.experience,
        achievements: updateData.achievements,
        address: updateData.address,
      });
    }
  }, [updateData]);

  const onFinish = async (values) => {
    const {
      name,
      phone,
      role,
      gender,
      birthday,
      level,
      academic,
      experience,
      achievements,
      address,
    } = values;
    const data = {
      _id: updateData?._id,
      name,
      phone,
      role,
      gender,
      birthday,
      level,
      academic,
      experience,
      achievements,
      address,
    };

    const res = await updateUser(data);
    if (res.data) {
      await getData();
      message.success("Cập nhật người dùng thành công !");
      resetModal();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };

  const resetModal = () => {
    setIsUpdateModalOpen(false);
    setUpdateData(null);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title="Cập nhật"
        open={isUpdateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
        width={"45%"}
      >
        <Form
          name="update-user"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <Row gutter={[8, 8]} justify="space-between" wrap={true}>
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

export default UpdateUserModal;
