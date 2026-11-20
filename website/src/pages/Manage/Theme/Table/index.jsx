import {
  Button,
  Input,
  notification,
  Popconfirm,
  Space,
  Switch,
  Table,
} from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import "./index.less";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router";
import ThemeModal from "../Modal";
import _service from "@netuno/service-client";
import Cluar from "../../../../common/Cluar";

const debounces = {};

const ThemeTable = forwardRef(({}, ref) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const themeModalRef = useRef();
  const [themeData, setThemeData] = useState(null);
  const [loadingApplied, setLoadingApplied] = useState({
    isLoading: false,
    key: "",
  });
  const [deleteLoadingUid, setDeleteLoadingUid] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const refreshAppliedTheme = () => {
    navigate({
      pathname: location.pathname,
      search: `?t=${Date.now()}`,
    });
  };

  const onApplied = ({ uid, applied }) => {
    setLoadingApplied({
      isLoading: true,
      key: uid,
    });
    _service({
      url: "reserved-area/theme/active",
      method: "PUT",
      data: {
        uid,
        applied: !applied,
      },
      success: () => {
        const nextApplied = !applied;
        setItems((prev) => {
          return prev.map((item) => {
            if (item.uid === uid) {
              return {
                ...item,
                applied: nextApplied,
              };
            }
            if (nextApplied) {
              return {
                ...item,
                applied: false,
              };
            }
            return item;
          });
        });
        setLoadingApplied({
          isLoading: false,
          key: uid,
        });
        refreshAppliedTheme();
        notification.success({
          message: applied
            ? Cluar.plainTranslation("theme-table-unapplied-success-message")
            : Cluar.plainTranslation("theme-table-applied-success-message"),
        });
      },
      fail: (error) => {
        setLoadingApplied({
          isLoading: false,
          key: uid,
        });
        console.error(error);
        notification.error({
          message: applied
            ? Cluar.plainTranslation("theme-table-unapplied-failed-message")
            : Cluar.plainTranslation("theme-table-applied-failed-message"),
        });
      },
    });
  };

  const onDelete = (uid) => {
    setDeleteLoadingUid(uid);
    _service({
      url: "reserved-area/theme",
      method: "DELETE",
      data: { uid },
      success: () => {
        setDeleteLoadingUid(null);
        notification.success({
          message: Cluar.plainTranslation("theme-table-delete-success-message"),
        });
        onLoadData();
      },
      fail: (error) => {
        setDeleteLoadingUid(null);
        console.error(error);
        const errorCode = error?.json?.error_code;
        const errorMessage =
          (errorCode &&
            Cluar.hasTranslation(errorCode) &&
            Cluar.plainTranslation(errorCode)) ||
          error?.json?.error ||
          Cluar.plainTranslation("theme-table-delete-failed-message");
        notification.error({ message: errorMessage });
      },
    });
  };

  const onReloadTable = () => {
    setFilters({});
    setPagination({
      page: 1,
      size: 10,
    });
    onLoadData();
  };

  const onLoadData = () => {
    setLoading(true);
    _service({
      url: "reserved-area/theme/list",
      method: "POST",
      data: {
        filters,
        pagination,
      },
      success: (response) => {
        setLoading(false);
        const { items, totalElements } = response.json.data;
        setTotal(totalElements);
        setItems(items);
      },
      fail: (error) => {
        setLoading(false);
        console.error(error);
        notification.error({
          message: Cluar.plainTranslation("theme-table-notification-load-fail"),
        });
      },
    });
  };

  const getTextFilterProps = (key) => {
    return {
      filterDropdown: () => (
        <div>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            onChange={(event) => {
              if (debounces[key]) {
                clearTimeout(debounces[key]);
              }

              debounces[key] = setTimeout(() => {
                setFilters({
                  ...filters,
                  [key]: event.target.value,
                });
              }, 700);
            }}
          />
        </div>
      ),
    };
  };

  useImperativeHandle(ref, () => {
    return {
      onReloadTable,
    };
  }, []);

  useEffect(() => {
    onLoadData();
  }, [filters, pagination]);

  const columns = [
    {
      title: Cluar.plainTranslation("theme-table-applied"),
      dataIndex: "applied",
      key: "applied",
      render: (val, record) => (
        <Switch
          size="small"
          checked={val}
          loading={
            loadingApplied.isLoading && loadingApplied.key === record.uid
          }
          disabled={
            loadingApplied.isLoading && loadingApplied.key === record.uid
          }
          onChange={() => {
            onApplied({
              uid: record.uid,
              applied: record.applied,
            });
          }}
        />
      ),
    },
    {
      title: Cluar.plainTranslation("theme-table-title"),
      dataIndex: "title",
      key: "title",
      ...getTextFilterProps("title"),
    },
    {
      title: Cluar.plainTranslation("theme-table-actions"),
      dataIndex: "actions",
      key: "actions",
      render: (val, record) => (
        <Space size={4}>
          <Button
            icon={<EditOutlined />}
            type="text"
            title={Cluar.plainTranslation("theme-table-button-edit")}
            onClick={() => {
              setThemeData(record);
              themeModalRef.current.openModal(record);
            }}
          />
          <Popconfirm
            title={Cluar.plainTranslation(
              "theme-table-popconfirm-delete-title",
            )}
            onConfirm={() => onDelete(record.uid)}
          >
            <Button
              type="text"
              danger
              title={
                record.applied
                  ? Cluar.plainTranslation("theme-in-use")
                  : Cluar.plainTranslation("theme-table-button-delete")
              }
              icon={<DeleteOutlined />}
              loading={deleteLoadingUid === record.uid}
              disabled={record.applied}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <ThemeModal
        ref={themeModalRef}
        themeData={themeData}
        onReloadTable={onReloadTable}
        onThemeSaved={refreshAppliedTheme}
      />
      <Table
        columns={columns}
        dataSource={items}
        loading={loading}
        scroll={{ x: 600 }}
        pagination={{
          onChange: (current) => {
            setPagination({
              size: pagination.size,
              page: current,
            });
          },
          pageSize: pagination.size,
          total: total,
          current: pagination.page,
          position: ["bottomRight", "topRight"],
        }}
      />
    </div>
  );
});

export default ThemeTable;
