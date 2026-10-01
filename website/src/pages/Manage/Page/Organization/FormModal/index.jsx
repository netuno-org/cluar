import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  notification
} from "antd";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from "react";
import _service from "@netuno/service-client";
import Cluar from "../../../../../common/Cluar";

const debounces = {}

const OrganizationFormModal = forwardRef(({ onReloadTable, pageData }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState({
    saving: false,
    organization: false
  });
  const [filter, setFilter] = useState("");
  const [formRef] = Form.useForm();

  const onOpenModal = () => {
    setIsModalOpen(true);
  }

  const onLoadOrganizations = () => {
    setLoading({ ...loading, organization: true });
    _service({
      url: "reserved-area/organization/list",
      method: "POST",
      data: {
        pagination: {
          size: 100,
          page: 1
        },
        filters: {
          name: filter
        }
      },
      success: (response) => {
        setLoading({ ...loading, organization: false });
        const { organizations } = response.json.data;
        setOrganizations(organizations);
      },
      fail: (error) => {
        setLoading({ ...loading, organization: false });
        console.error(error);
      }
    })
  }

  const onFilter = (value) => {
    if (debounces["organization"]) {
      clearTimeout(debounces["organization"])
    }

    debounces["organization"] = setTimeout(() => {
      setFilter(value);
    }, 600);
  }

  const onFinish = (values) => {
    setLoading({ ...loading, saving: true });
    _service({
      url: "reserved-area/page/organization",
      method: "POST",
      data: {
        page_uid: pageData.uid,
        organization_uid: values.organization_uid.value
      },
      success: (response) => {
        setLoading({ ...loading, saving: false });
        setIsModalOpen(false);
        onReloadTable();
        notification.success({
          message: Cluar.plainTranslation("member-form-save-success-message")
        });
      },
      fail: (error) => {
        setLoading({ ...loading, saving: false });
        console.error(error);

        if (error?.json?.error_code === "page-already-in-organization") {
          notification.error({
            description: Cluar.plainTranslation("member-form-already-exists-validation-message"),
            message: Cluar.plainTranslation("member-form-save-failed-message")
          });
          return;
        }

        const errorMessage = error?.json?.error || Cluar.plainTranslation("member-form-save-failed-message");
        notification.error({ message: errorMessage });
      }
    })
  }

  useImperativeHandle(ref, () => {
    return {
      onOpenModal
    }
  }, []);

  useEffect(() => {
    onLoadOrganizations();
  }, [filter]);

  return (
    <Modal
      title={Cluar.plainTranslation("member-modal-new-title")}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onClose={() => setIsModalOpen(false)}
      destroyOnHidden
      maskClosable={false}
      afterClose={() => formRef.resetFields()}
      centered
      footer={[
        <Button onClick={() => setIsModalOpen(false)}>
          {Cluar.plainTranslation("member-form-cancel")}
        </Button>,
        <Button type="primary" onClick={() => formRef.submit()} loading={loading.saving} disabled={loading.saving}>
          {Cluar.plainTranslation("member-form-save")}
        </Button>
      ]}
    >
      <Form
        layout="vertical"
        form={formRef}
        onFinish={onFinish}
      >
        <Row justify={"space-between"} align={"middle"} gutter={[10, 0]} >
          <Col span={24}>
            <Form.Item
              name="organization_uid"
              label={Cluar.plainTranslation("member-form-organization")}
              rules={[{ required: true, message: Cluar.plainTranslation("member-form-validate-message-required") }]}
            >
              <Select
                labelInValue
                showSearch
                filterOption={false}
                allowClear
                onSearch={(value) => onFilter(value)}
                loading={loading.organization}
                listHeight={200}
                options={organizations.map((organization) => ({
                  label: organization.name,
                  value: organization.uid
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default OrganizationFormModal;