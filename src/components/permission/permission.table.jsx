import { useEffect, useState } from "react";
import { Table, Button, notification, Popconfirm, message } from "antd";
import { colorMethod } from "@/utils/uils";
import { deleteAccommodation } from "@/utils/api";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import UpdateModal from "./update.modal";
import { permissionOnchangeTable } from "../../redux/slice/permissionSlice";
import { useDispatch } from "react-redux";
import { deletePermission } from "../../utils/api";

const PermissionTable = (props) => {
  const { permissions, isFetching, getData, meta } = props;
  const dispatch = useDispatch();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const confirmDelete = async (permission) => {
    const res = await deletePermission(permission._id);
    if (res.data) {
      getData();
      message.success("Xoá lưu quyền hạn công !");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
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
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (_value, record) => {
        return (
          <div
            style={{
              textDecoration: "underline",
              color: "blueviolet",
            }}
          >
            {record.name}
          </div>
        );
      },
    },
    {
      title: "Chức năng",
      dataIndex: "module",
      key: "module",
    },
    {
      title: "Đường dẫn",
      dataIndex: "apiPath",
      key: "apiPath",
    },
    {
      title: "Phương thức",
      dataIndex: "method",
      key: "method",
      render: (_value, record) => {
        return (
          <p
            style={{
              paddingLeft: 10,
              fontWeight: "bold",
              marginBottom: 0,
              color: colorMethod(record?.method),
            }}
          >
            {record?.method || ""}
          </p>
        );
      },
    },

    {
      title: "Hành động",
      render: (record) => {
        return (
          <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
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
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Table
        size="small"
        scroll={{ x: true }}
        columns={columns}
        dataSource={permissions}
        rowKey={"_id"}
        loading={isFetching}
        bordered={true}
        pagination={{
          position: ["bottomCenter"],
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]} - ${range[1]} of ${total} items`,
          onChange: (page, pageSize) =>
            dispatch(
              permissionOnchangeTable({
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
      <UpdateModal
        updateData={updateData}
        getData={getData}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        setUpdateData={setUpdateData}
      />
    </>
  );
};

export default PermissionTable;
