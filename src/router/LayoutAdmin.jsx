import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  ConfigProvider,
  Menu,
  notification,
  theme,
  Row,
  Col,
} from "antd";
import {
  HomeOutlined,
  ExceptionOutlined,
  LogoutOutlined,
  UserOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import Logo from "@/components/admin/logo.jsx";
import ToggleThemeButton from "@/components/admin/toggleTheme.jsx";
import { postLogOut } from "@/utils/api.js";
import { useDispatch, useSelector } from "react-redux";
import { setLogoutAction } from "@/redux/slice/authSlice.js";
import HeaderAdmin from "@/components/admin/header.jsx";
import { setHomeKey } from "@/redux/slice/menuSlice.js";
import { setThemeMode } from "@/redux/slice/themeSlice";
import { ALL_PERMISSIONS } from "@/utils/permission.module";

const { Footer, Sider, Content } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userPermissions = useSelector((state) => state.auth.user.permissions);

  const themeMode = useSelector((state) => state.theme.themeMode);
  const darkConfig = { algorithm: theme.darkAlgorithm };
  const lightConfig = { algorithm: theme.defaultAlgorithm };

  const [activeMenu, setActiveMenu] = useState("");
  const location = useLocation();

  const [menuItems, setMenuItems] = useState(["items"]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleTheme = () => {
    if (themeMode === "light") {
      dispatch(setThemeMode("dark"));
    } else {
      dispatch(setThemeMode("light"));
    }
  };

  const handleLogout = async () => {
    const res = await postLogOut();
    if (res && res.data) {
      dispatch(setLogoutAction({}));
      dispatch(setHomeKey());
      notification.success({
        message: "Đăng xuất thành công !",
      });
      navigate("/");
    }
  };

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

  useEffect(() => {
    if (userPermissions?.length) {
      const viewUser = userPermissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.USERS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
      );

      const viewRole = userPermissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.ROLES.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method
      );

      const viewPermission = userPermissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
      );

      const full = [
        {
          label: <Link to={"/admin"}>Trang chủ</Link>,
          key: "home",
          icon: <HomeOutlined />,
          visible: "true",
        },
        // {
        //   label: <Link to={"/admin/accommodation"}>Quản lý lưu trú</Link>,
        //   key: "accommodation",
        //   icon: <CalendarOutlined />,
        //   visible: "true",
        // },
        ...(viewUser
          ? [
              {
                label: <Link to="/admin/user">Quản lý hội viên</Link>,
                key: "/admin/user",
                icon: <UserOutlined />,
              },
            ]
          : []),
        ...(viewRole
          ? [
              {
                label: <Link to="/admin/role">Role</Link>,
                key: "/admin/role",
                icon: <ExceptionOutlined />,
              },
            ]
          : []),
        ...(viewPermission
          ? [
              {
                label: <Link to="/admin/permission">Permission</Link>,
                key: "/admin/permission",
                icon: <ApiOutlined />,
              },
            ]
          : []),
        {
          label: <Link onClick={() => handleLogout()}>Đăng xuất</Link>,
          key: "logout",
          icon: <LogoutOutlined />,
          visible: "true",
        },
      ];
      setMenuItems(full);
    }
  }, [userPermissions]);

  useEffect(() => {
    const handleResize = () => {
      // Kiểm tra kích thước màn hình ở đây và cập nhật giá trị của collapsed
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    // Thêm sự kiện lắng nghe cho thay đổi kích thước màn hình
    window.addEventListener("resize", handleResize);
    // Gọi handleResize lần đầu tiên để thiết lập giá trị mặc định
    handleResize();
    // Cleanup sự kiện khi component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ConfigProvider theme={themeMode === "dark" ? darkConfig : lightConfig}>
      <Layout hasSider style={{ minHeight: "100vh" }}>
        <Sider
          trigger={null}
          collapsed={collapsed}
          breakpoint="lg" // Định nghĩa điểm phá vỡ (breakpoint) khi Sidebar sẽ tự động thu gọn
          collapsedWidth={0}
          style={{
            overflow: "hidden",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div>
            <Logo />
            <Menu
              onClick={(e) => setActiveMenu(e.key)}
              style={{ height: "100vh" }}
              mode="vertical"
              items={menuItems}
              defaultSelectedKeys={["home"]}
              selectedKeys={activeMenu}
            />
            <ToggleThemeButton toggleTheme={toggleTheme} />
          </div>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? "0px" : "200px" }}>
          <HeaderAdmin
            toggleCollapsed={toggleCollapsed}
            collapsed={collapsed}
          />
          <Content
            style={{
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            <div
              style={{
                minHeight: "100%",
                background:
                  themeMode === "light" ? colorBgContainer : "#141414",
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Row>
            <Col xs={0} sm={0} md={0} lg={24} xl={24}>
              <Footer style={{ textAlign: "center" }}>
                CHP App ©2023 Created by Phan Anh Hùng
              </Footer>
            </Col>
          </Row>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default LayoutAdmin;
