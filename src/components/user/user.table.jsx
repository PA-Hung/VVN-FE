import {
  Button,
  Descriptions,
  Popconfirm,
  Space,
  Table,
  message,
  notification,
} from "antd";
import React, { useState } from "react";
import CheckAccess from "@/utils/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { deleteUser } from "@/utils/api";
import UpdateUserModal from "./update.user.modal";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

const UserTable = (props) => {
  const { listUsers, loading, getData, meta } = props;
  const [updateData, setUpdateData] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const confirmDelete = async (user) => {
    const res = await deleteUser(user._id);
    if (res.data) {
      await getData();
      message.success("Xoá người dùng thành công !");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 50,
      align: "center",
      render: (text, record, index) => {
        return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
      },
      hideInSearch: true,
    },
    {
      title: "Họ Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (_value, record) => {
        return <div>{dayjs(record.birthday).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      title: "Liên hệ",
      dataIndex: "phone",
      key: "phone",
      render: (_value, record) => {
        return <div>{record.phone}</div>;
      },
    },
    {
      title: "Quyền hạn",
      dataIndex: "role",
      key: "role",
      render: (_value, record) => {
        return <div>{record?.role?.name}</div>;
      },
    },
    {
      title: "Hành động",
      render: (record) => {
        return (
          <Space>
            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <CheckAccess
                FeListPermission={ALL_PERMISSIONS.USERS.UPDATE}
                hideChildren
              >
                <div>
                  <Button
                    danger
                    onClick={() => {
                      setIsUpdateModalOpen(true);
                      setUpdateData(record);
                    }}
                  >
                    Cập nhật
                  </Button>
                </div>
              </CheckAccess>
              <CheckAccess
                FeListPermission={ALL_PERMISSIONS.USERS.DELETE}
                hideChildren
              >
                <div>
                  <Popconfirm
                    title={`Bạn muốn xoá ${record.name} không ?`}
                    onConfirm={() => confirmDelete(record)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type={"primary"} danger>
                      Xoá
                    </Button>
                  </Popconfirm>
                </div>
              </CheckAccess>
            </div>
          </Space>
        );
      },
    },
  ];

  const expandableTable = (record) => (
    <Descriptions
      title="Thông tin chi tiết"
      bordered
      size="small"
      labelStyle={{ fontWeight: "bold" }}
    >
      <Descriptions.Item label="Đẳng cấp chuyên môn / Khóa thi">
        {record.level}
      </Descriptions.Item>
      <Descriptions.Item label="Trình độ học vấn">
        {record.academic}
      </Descriptions.Item>
      <Descriptions.Item label="Quá trình tập luyện">
        {record.experience}
      </Descriptions.Item>
      <Descriptions.Item label="Thành tích">
        {record.achievements}
      </Descriptions.Item>
      <Descriptions.Item label="Địa chỉ thường trú">
        {record.address}
      </Descriptions.Item>
    </Descriptions>
  );

  return (
    <>
      <Table
        size="small"
        columns={columns}
        dataSource={listUsers}
        rowKey={"_id"}
        loading={loading}
        bordered={true}
        expandable={{
          expandedRowRender: expandableTable,
          expandRowByClick: true,
        }}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]} - ${range[1]} of ${total} items`,
          onChange: (page, pageSize) =>
            dispatch(
              userOnchangeTable({
                current: page,
                pageSize: pageSize,
                pages: meta.pages,
                total: meta.total,
              })
            ),
          showSizeChanger: true,
          defaultPageSize: meta.pageSize,
        }}
      />
      <UpdateUserModal
        updateData={updateData}
        getData={getData}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        setUpdateData={setUpdateData}
      />
    </>
  );
};

export default UserTable;
