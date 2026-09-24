import {
  Button,
  Col,
  notification,
  Row,
  Switch,
  Table,
  Input,
  Popconfirm,
  Space
} from "antd";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { DeleteOutlined, EditOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import _service from "@netuno/service-client";
import Cluar from "../../../../common/Cluar";
import OrganizationModal from "../Modal";
import MemberModal from "../Member";

const debounces = {}

const OrganizationTable = forwardRef(({ }, ref) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const organizationModalRef = useRef();
  const membersModalRef = useRef();
  const [organizationData, setOrganizationData] = useState(null);
  const [activeLoading, setActiveLoading] = useState({
    key: "",
    isLoading: false
  });
  const [deleteLoadingUid, setDeleteLoadingUid] = useState(null);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10
  });

  const onActive = ({ uid, active }) => {
    setActiveLoading({
      key: uid,
      isLoading: true
    });
    _service({
      url: "reserved-area/organization/active",
      method: "PUT",
      data: {
        uid,
        active: !active
      },
      success: (response) => {
        setActiveLoading({
          key: uid,
          isLoading: false
        });
        setData((prev) => {
          return prev.map((item) => {
            if (item.uid === uid) {
              return ({
                ...item,
                active: !active
              })
            }
            return item;
          })
        });
        notification.success({
          message: active ? Cluar.plainTranslation('organization-table-desactive-success-message') : Cluar.plainTranslation('organization-table-active-success-message')
        })
      },
      fail: (error) => {
        setActiveLoading({
          key: uid,
          isLoading: false
        });
        console.error(error);
        notification.error({
          message: active ? Cluar.plainTranslation('organization-table-desactive-failed-message') : Cluar.plainTranslation('organization-table-active-failed-message')
        });
      }
    })
  }

  const onDelete = (uid) => {
    setDeleteLoadingUid(uid);
    _service({
      url: "reserved-area/organization",
      method: "DELETE",
      data: { uid },
      success: () => {
        setDeleteLoadingUid(null);
        notification.success({
          message: Cluar.plainTranslation("organization-table-delete-success-message")
        });
        onLoadOrganizations();
      },
      fail: (error) => {
        setDeleteLoadingUid(null);
        console.error(error);
        const errorMessage = error?.json?.error || Cluar.plainTranslation("organization-table-delete-failed-message");
        notification.error({ message: errorMessage });
      }
    });
  }

  const getTextFilterProps = (key) => {
    return ({
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
                  [key]: event.target.value
                });
              }, 700);
            }}
          />
        </div>
      )
    });
  };

  const onLoadOrganizations = () => {
    setLoading(true);
    _service({
      url: "reserved-area/organization/list",
      method: "POST",
      data: {
        pagination,
        filters
      },
      success: (response) => {
        setLoading(false);
        const { organizations, organization_total } = response.json.data
        setData(organizations);
        setTotal(organization_total);
      },
      fail: (error) => {
        setLoading(false);
        console.error(error);
        notification.error({
          message: Cluar.plainTranslation("organization-table-load-failed")
        })
      }
    })
  }

  const onReloadTable = () => {
    setFilters({});
    setPagination({ page: 1, size: 10 });
  }

  const columns = [
    {
      title: Cluar.plainTranslation('organization-table-active'),
      dataIndex: 'active',
      key: 'active',
      onHeaderCell: () => ({
        "data-column-key": "active",
      }),
      render: (val, record) => (
        <Switch
          size="small"
          checked={val}
          loading={activeLoading.key === record.uid && activeLoading.isLoading}
          disabled={activeLoading.key === record.uid && activeLoading.isLoading}
          onChange={() => {
            onActive({ uid: record.uid, active: val });
          }}
        />
      ),
      filtered: filters.active,
      filters: [
        {
          text: "Activo",
          value: true
        },
        {
          text: "Inactivo",
          value: false
        }
      ]
    },
    {
      title: Cluar.plainTranslation('organization-table-name'),
      dataIndex: 'name',
      key: 'name',
      ...getTextFilterProps("name"),
      onHeaderCell: () => ({
        "data-column-key": "name",
      }),
    },
    {
      title: Cluar.plainTranslation('organization-table-code'),
      dataIndex: 'code',
      ...getTextFilterProps("code"),
      onHeaderCell: () => ({
        "data-column-key": "code",
      }),
      key: 'code',
    },
    {
      title: Cluar.plainTranslation('organization-table-parent'),
      dataIndex: 'parent',
      ...getTextFilterProps("parent_name"),
      onHeaderCell: () => ({
        "data-column-key": "parent",
      }),
      key: 'parent',
      render: (val, record) => val?.name
    },
    {
      title: Cluar.plainTranslation('organization-table-actions'),
      dataIndex: 'Actions',
      key: 'actions',
      onHeaderCell: () => ({
        "data-column-key": "actions",
      }),
      render: (val, record) => (
        <Space size={4}>
          <Button
            icon={<EditOutlined />}
            type="text"
            title={Cluar.plainTranslation("organization-table-button-edit")}
            onClick={() => {
              setOrganizationData(record);
              organizationModalRef.current.onOpenModal();
            }}
          />
          <Button
            icon={<UserOutlined />}
            type="text"
            title={Cluar.plainTranslation("organization-table-button-members")}
            onClick={() => {
              setOrganizationData(record);
              membersModalRef.current.openModal();
            }}
          />
          <Popconfirm
            title={Cluar.plainTranslation("organization-table-popconfirm-delete-title")}
            onConfirm={() => onDelete(record.uid)}
          >
            <Button
              type="text"
              danger
              title={Cluar.plainTranslation("organization-table-button-delete")}
              icon={<DeleteOutlined />}
              loading={deleteLoadingUid === record.uid}
            />
          </Popconfirm>
        </Space>
      )
    },
  ]

  useImperativeHandle(ref, () => {
    return {
      onReloadTable
    }
  }, []);

  useEffect(() => {
    onLoadOrganizations();
  }, [])

  useEffect(() => {
    onLoadOrganizations();
  }, [pagination, filters])

  return (
    <div>
      <OrganizationModal
        ref={organizationModalRef}
        organizationData={organizationData}
        onReloadTable={onReloadTable}
      />
      <MemberModal
        ref={membersModalRef}
        organizationData={organizationData}
      />
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 600 }}
        pagination={{
          total: total,
          pageSize: pagination.size,
          current: pagination.page,
          position: ["topRight", "bottomRight"],
          onChange: (current) => { setPagination({ page: current, size: pagination.size }) }
        }}
        onChange={(pagination, currentFilters, currentSorter, { action }) => {
          if (action === "filter") {
            const filtersModify = ['active'];
            const newFilters = {
              ...filters
            }
            Object.keys(currentFilters).forEach((key) => {
              const value = currentFilters[key];
              if (filtersModify.includes(key)) {
                newFilters[key] = value;
              }
            })
            setFilters(newFilters);
          }
        }}
      />
    </div>
  )
})

export default OrganizationTable;
