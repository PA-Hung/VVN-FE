import { useEffect, useState } from "react";
import { Button, notification, Row, Col, Flex } from "antd";
import queryString from "query-string";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { exportExcel, getRole, importExcel } from "../../utils/api";
import CreateModal from "./create.role/create.modal";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import SearchModal from "./search.modal";
import RoleCard from "./role.card";
import RoleTable from "./role.table";
import { setLogoutAction } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

const RolePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [listRole, setListRole] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const isAdmin = useSelector((state) => state.auth.user.role);
  const user = useSelector((state) => state.auth.user);
  //const userId = isAdmin !== "ADMIN" ? user : "";

  const [loadingUpload, setLoadingUpload] = useState(false);

  useEffect(() => {
    getData();
  }, [meta.current, meta.pageSize]);

  const getData = async () => {
    const query = buildQuery();
    setLoading(true);
    const res = await getRole(query);
    if (res.data) {
      setListRole(res.data.result);
      setMeta({
        current: res?.data?.meta?.current,
        pageSize: res?.data?.meta?.pageSize,
        pages: res.data.meta.pages,
        total: res.data.meta.total,
      });
    } else {
      if (res.message === "Token không hợp lệ !") {
        dispatch(setLogoutAction({}));
        navigate("/");
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          placement: "top",
          description: res.message,
        });
      }
    }
    setLoading(false);
  };

  const buildQuery = (
    params,
    sort,
    filter,
    page = meta.current,
    pageSize = meta.pageSize
  ) => {
    const clone = { ...params };

    if (clone.name) clone.name = `/${clone.name}/i`;
    if (clone.description) clone.description = `/${clone.description}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";

    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.description) {
      sortBy =
        sort.description === "ascend"
          ? "sort=description"
          : "sort=-description";
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
      temp = `current=${page}&pageSize=${pageSize}&${temp}&sort=-createdAt`;
    } else {
      temp = `current=${page}&pageSize=${pageSize}&${temp}&${sortBy}`;
    }
    return temp;
  };

  const onSearch = async (value) => {
    const query = buildQuery(value);
    setLoading(true);
    const res = await getRole(query);
    if (res.data) {
      setListRole(res.data.result);
      setMeta({
        current: res.data.meta.current,
        pageSize: res.data.meta.pageSize,
        pages: res.data.meta.pages,
        total: res.data.meta.total,
      });
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ paddingLeft: 30, paddingRight: 30 }}>
      <div style={{ padding: 20 }}>
        <Flex justify="space-between" align="center">
          <Row gutter={[8, 8]}>
            <Col xs={0} sm={24} md={24} lg={12} xl={12}>
              <Button
                icon={<SearchOutlined />}
                onClick={() => setIsSearchModalOpen(true)}
              >
                Tìm kiếm
              </Button>
            </Col>
            <Col xs={24} sm={0} md={0} lg={0} xl={0}>
              <Button
                icon={<SearchOutlined />}
                onClick={() => setIsSearchModalOpen(true)}
              />
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xs={0} sm={24} md={24} lg={12} xl={12}>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Thêm mới
              </Button>
            </Col>
            <Col xs={24} sm={0} md={0} lg={0} xl={0}>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalOpen(true)}
              />
            </Col>
          </Row>
        </Flex>
      </div>
      <Row>
        <Col xs={24} sm={24} md={24} lg={0} xl={0}>
          {/* <RoleCard
            listRole={listRole}
            setListRole={setListRole}
            loading={loading}
            setLoading={setLoading}
            getData={getData}
          /> */}
        </Col>
        <Col xs={0} sm={0} md={0} lg={24} xl={24}>
          <RoleTable listRole={listRole} loading={loading} getData={getData} />
        </Col>
      </Row>
      <CreateModal
        getData={getData}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />
      <SearchModal
        isSearchModalOpen={isSearchModalOpen}
        setIsSearchModalOpen={setIsSearchModalOpen}
        onSearch={onSearch}
      />
    </div>
  );
};

export default RolePage;
