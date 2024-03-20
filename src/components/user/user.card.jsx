import { useEffect, useState } from "react";
import {
  Collapse,
  notification,
  message,
  Card,
  Flex,
  Spin,
  Pagination,
  Button,
  Popconfirm,
  Col,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import { deleteUser } from "@/utils/api";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import UpdateUserModal from "./update.user.modal";
dayjs.locale("vi");

const UserCard = (props) => {
  const { listUsers, loading, getData, meta } = props;
  const [updateData, setUpdateData] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  console.log("listUsers", listUsers);

  useEffect(() => {
    getData();
  }, [meta.current, meta.pageSize]);

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

  const handleOnchangeTable = (page, pageSize) => {
    setMeta({
      current: page,
      pageSize: pageSize,
      pages: meta.pages,
      total: meta.total,
    });
  };

  const { Meta } = Card;

  const customExpandIcon = () => {
    // Thay đổi biểu tượng mở rộng ở đây, ví dụ sử dụng CaretRightOutlined
    return (
      <CaretRightOutlined
        style={{
          fontSize: 20,
          marginTop: 10,
        }}
      />
    );
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div>
          {loading ? (
            <div>
              <Spin size="default" />
            </div>
          ) : (
            <Flex wrap="wrap" gap="small">
              {listUsers.map((item) => (
                <Card
                  hoverable
                  key={item._id}
                  style={{ width: 300, margin: "10px" }}
                >
                  <Meta title={item.name} />

                  <hr />
                  <p>Số điện thoại : {item.phone}</p>
                  <p>role : {item.role.name}</p>
                  <p>Giới tính : {item.gender}</p>
                  <p>Đẳng cấp : {item.level}</p>
                  <p>Ngày sinh : {dayjs(item.birthday).format("DD/MM/YYYY")}</p>
                  <Collapse
                    expandIcon={customExpandIcon}
                    accordion
                    size="small"
                    items={[
                      {
                        key: "1",
                        label: (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              alignContent: "center",
                              gap: 10,
                            }}
                          >
                            <div>
                              <Col xs={0} sm={24} md={24} lg={24} xl={24}>
                                Xem chi tiêt
                              </Col>
                            </div>

                            <div style={{ display: "flex", gap: 5 }}>
                              <Popconfirm
                                title={`Bạn muốn xoá ${item.name} không ?`}
                                onConfirm={() => confirmDelete(item)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button icon={<DeleteOutlined />} danger />
                              </Popconfirm>
                              <Button
                                icon={<EditOutlined />}
                                onClick={() => {
                                  setIsUpdateModalOpen(true);
                                  setUpdateData(item);
                                }}
                              />
                            </div>
                          </div>
                        ),
                        children: (
                          <>
                            <p>Trình độ : {item.academic}</p>
                            <p>Kinh nghiệm : {item.experience}</p>
                            <p>Thành tích : {item.achievements}</p>
                            <p>Địa chỉ : {item.address}</p>
                          </>
                        ),
                      },
                    ]}
                  />
                </Card>
              ))}
            </Flex>
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <Pagination
            current={meta.current}
            total={meta.total}
            pageSize={meta.pageSize}
            onChange={(page, pageSize) => handleOnchangeTable(page, pageSize)}
            showSizeChanger={true}
            defaultPageSize={meta.pageSize}
          />
          <UpdateUserModal
            updateData={updateData}
            getData={getData}
            isUpdateModalOpen={isUpdateModalOpen}
            setIsUpdateModalOpen={setIsUpdateModalOpen}
            setUpdateData={setUpdateData}
          />
        </div>
      </div>
    </>
  );
};

export default UserCard;
