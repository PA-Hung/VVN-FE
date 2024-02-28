import { useEffect, useState } from "react";
import { Button, notification, Row, Col, Flex } from "antd";
import queryString from "query-string";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import CreateModal from "./create.role/create.modal";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import { useDispatch, useSelector } from "react-redux";
import SearchModal from "./search.modal";
import RoleCard from "./role.card";
import RoleTable from "./role.table";
import { fetchRole } from "../../redux/slice/roleSlice";

const RolePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const isFetching = useSelector((state) => state.role.isFetching);
  const meta = useSelector((state) => state.role.meta);
  const listRole = useSelector((state) => state.role.result);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, [meta.current, meta.pageSize]);

  const getData = async () => {
    const query = buildQuery();
    dispatch(fetchRole({ query }));
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

    let temp = queryString.stringify(clone);

    let sortBy = "";

    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
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
    dispatch(fetchRole({ query }));
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
          <RoleTable
            listRole={listRole}
            isFetching={isFetching}
            getData={getData}
            meta={meta}
          />
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
