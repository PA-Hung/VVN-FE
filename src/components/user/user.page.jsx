import { useEffect, useState } from "react";
import {
  Table,
  Button,
  notification,
  Popconfirm,
  message,
  Form,
  Input,
  Space,
  Row,
  Col,
} from "antd";
import queryString from "query-string";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import CreateUserModal from "./create.user.modal";
import UpdateUserModal from "./update.user.modal";
import { deleteUser } from "@/utils/api";
import CheckAccess from "@/utils/check.access";
import { ALL_PERMISSIONS } from "@/utils/permission.module";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, userOnchangeTable } from "../../redux/slice/userSlice";
import UserTable from "./user.table";
import SearchUserModal from "./search.user.modal";
import UserCard from "./user.card";

const UserPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchUserModalOpen, setIsSearchUserModalOpen] = useState(false);
  const loading = useSelector((state) => state.user.isFetching);
  const meta = useSelector((state) => state.user.meta);
  const listUsers = useSelector((state) => state.user.result);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, [meta.current, meta.pageSize]);

  const getData = async () => {
    const query = buildQuery();
    dispatch(fetchUser({ query }));
  };

  const [form] = Form.useForm();

  const buildQuery = (
    params,
    sort,
    filter,
    page = meta.current,
    pageSize = meta.pageSize
  ) => {
    const clone = { ...params };
    if (clone.name) clone.name = `/${clone.name}/i`;
    if (clone.phone) clone.phone = `/${clone.phone}/i`;
    if (clone.gender) clone.gender = `/${clone.gender}/i`;
    if (clone.birthday) clone.birthday = `/${clone.birthday}/i`;
    if (clone.level) clone.level = `/${clone.level}/i`;
    if (clone.academic) clone.academic = `/${clone.academic}/i`;
    if (clone.experience) clone.experience = `/${clone.experience}/i`;
    if (clone.achievements) clone.achievements = `/${clone.achievements}/i`;
    if (clone.address) clone.address = `/${clone.address}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.phone) {
      sortBy = sort.phone === "ascend" ? "sort=phone" : "sort=-phone";
    }
    if (sort && sort.gender) {
      sortBy = sort.gender === "ascend" ? "sort=gender" : "sort=-gender";
    }
    if (sort && sort.birthday) {
      sortBy = sort.birthday === "ascend" ? "sort=birthday" : "sort=-birthday";
    }
    if (sort && sort.level) {
      sortBy = sort.level === "ascend" ? "sort=level" : "sort=-level";
    }
    if (sort && sort.academic) {
      sortBy = sort.academic === "ascend" ? "sort=academic" : "sort=-academic";
    }
    if (sort && sort.experience) {
      sortBy =
        sort.experience === "ascend" ? "sort=experience" : "sort=-experience";
    }
    if (sort && sort.achievements) {
      sortBy =
        sort.achievements === "ascend"
          ? "sort=achievements"
          : "sort=-achievements";
    }
    if (sort && sort.address) {
      sortBy = sort.address === "ascend" ? "sort=address" : "sort=-address";
    }

    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
    }

    //mặc định sort theo updatedAt
    if (Object.keys(sortBy).length === 0) {
      temp = `current=${page}&pageSize=${pageSize}&${temp}&sort=-updatedAt`;
    } else {
      temp = `current=${page}&pageSize=${pageSize}&${temp}&${sortBy}`;
    }
    return temp;
  };

  const onSearch = async (value) => {
    const query = buildQuery(value);
    dispatch(fetchUser({ query }));
  };

  return (
    <div style={{ paddingLeft: 30, paddingRight: 30 }}>
      <CheckAccess
        FeListPermission={ALL_PERMISSIONS.USERS.GET_PAGINATE}
        hideChildren
      >
        <div
          style={{
            color: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 20,
          }}
        >
          <div>
            <Row gutter={[8, 8]}>
              <Col xs={0} sm={24} md={24} lg={12} xl={12}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => setIsSearchUserModalOpen(true)}
                >
                  Tìm kiếm
                </Button>
              </Col>
              <Col xs={24} sm={0} md={0} lg={0} xl={0}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => setIsSearchUserModalOpen(true)}
                />
              </Col>
            </Row>
          </div>
          <CheckAccess
            FeListPermission={ALL_PERMISSIONS.USERS.CREATE}
            hideChildren
          >
            <div>
              <Button
                icon={<PlusOutlined />}
                type={"primary"}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Thêm mới
              </Button>
            </div>
          </CheckAccess>
        </div>
        <Row>
          <Col xs={24} sm={24} md={24} lg={0} xl={0}>
            <UserCard
              listUsers={listUsers}
              loading={loading}
              getData={getData}
              meta={meta}
            />
          </Col>
          <Col xs={0} sm={0} md={0} lg={24} xl={24}>
            <UserTable
              listUsers={listUsers}
              loading={loading}
              getData={getData}
              meta={meta}
            />
          </Col>
        </Row>

        <CreateUserModal
          getData={getData}
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />
        <SearchUserModal
          isSearchUserModalOpen={isSearchUserModalOpen}
          setIsSearchUserModalOpen={setIsSearchUserModalOpen}
          onSearch={onSearch}
        />
      </CheckAccess>
    </div>
  );
};

export default UserPage;
