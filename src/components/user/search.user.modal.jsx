import { Modal, Form, Row, Col, Input, Select, DatePicker } from "antd";
import React from "react";

const SearchUserModal = (props) => {
  const { onSearch, isSearchUserModalOpen, setIsSearchUserModalOpen } = props;
  const resetModal = () => {
    setIsSearchUserModalOpen(false);
    form.resetFields();
  };
  const [form] = Form.useForm();
  const handleSearch = () => {
    form.submit();
    setIsSearchUserModalOpen(false);
  };
  return (
    <>
      <Modal
        title="Tìm kiếm"
        open={isSearchUserModalOpen}
        onCancel={resetModal}
        onOk={handleSearch}
        maskClosable={false}
        width={"50%"}
      >
        <Form
          name="search-form"
          onFinish={onSearch}
          layout="vertical"
          form={form}
        >
          <Row gutter={[8, 8]} justify="center" wrap={true}>
            <Col xs={24} sm={24} md={24} lg={12} xl={8} span={8}>
              <Form.Item label="Họ tên" name="name">
                <Input placeholder="Nhập tên" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={8} span={8}>
              <Form.Item label="Liên hệ" name="phone">
                <Input placeholder="Nhập số điện thoại" />
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
              <Form.Item label="Ngày sinh" name="birthday">
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
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
            <Col xs={24} sm={24} md={24} lg={12} xl={8} span={8}>
              <Form.Item label="Địa chỉ" name="address">
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default SearchUserModal;
