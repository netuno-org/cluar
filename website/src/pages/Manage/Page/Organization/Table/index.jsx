import {
  Button,
  notification,
  Table,
  Popconfirm,
  Space
} from "antd";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from "react";
import { DeleteOutlined } from "@ant-design/icons";
import _service from "@netuno/service-client";
import Cluar from "../../../../../common/Cluar";

const OrganizationTable = forwardRef(({ pageData }, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingUid, setDeleteLoadingUid] = useState(null);

  const onLoadOrganizations = () => {
    setLoading(true);
    _service({
      url: "reserved-area/page/organization/list",
      method: "GET",
      data: {
        page_uid: pageData?.uid
      },
      success: (response) => {
        setLoading(false);
        setData(response.json.data || []);
      },
      fail: (error) => {
        setLoading(false);
        console.error(error);
        const errorMessage = error?.json?.error || Cluar.plainTranslation("member-table-load-failed");
        notification.error({ message: errorMessage });
      }
    })
  }

  const onDelete = (record) => {
    setDeleteLoadingUid(record.uid);
    _service({
      url: "reserved-area/page/organization",
      method: "DELETE",
      data: {
        page_uid: pageData.uid,
        organization_uid: record.uid
      },
      success: (response) => {
        setDeleteLoadingUid(null);
        notification.success({
          message: Cluar.plainTranslation("member-table-delete-success-message")
        });

        if (response.json?.data?.reassigned) {
          notification.info({
            message: Cluar.plainTranslation("page-organization-table-reassigned-message"),
            description: response.json.data.organization?.name
          });
        }

        onLoadOrganizations();
      },
      fail: (error) => {
        setDeleteLoadingUid(null);
        console.error(error);
        const errorMessage = error?.json?.error || Cluar.plainTranslation("member-table-delete-failed-message");
        notification.error({ message: errorMessage });
      }
    })
  }

  const onReloadTable = () => {
    onLoadOrganizations();
  }

  const columns = [
    {
      title: Cluar.plainTranslation("member-table-organization"),
      dataIndex: "name",
      key: "name",
      onHeaderCell: () => ({
        "data-column-key": "name",
      }),
      render: (val) => val
    },
    {
      title: Cluar.plainTranslation("organization-table-code"),
      dataIndex: "code",
      key: "code",
      onHeaderCell: () => ({
        "data-column-key": "code",
      }),
      render: (val) => val
    },
    {
      title: Cluar.plainTranslation("member-table-actions"),
      dataIndex: "Actions",
      key: "actions",
      onHeaderCell: () => ({
        "data-column-key": "actions",
      }),
      render: (val, record) => (
        <Space size={4}>
          <Popconfirm
            title={Cluar.plainTranslation("member-table-popconfirm-delete-title")}
            onConfirm={() => onDelete(record)}
          >
            <Button
              type="text"
              danger
              title={Cluar.plainTranslation("member-table-button-delete")}
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
    if (pageData) {
      onLoadOrganizations();
    }
  }, [pageData?.uid])

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={"uid"}
        scroll={{ x: 600 }}
        pagination={false}
      />
    </div>
  )
})

export default OrganizationTable;