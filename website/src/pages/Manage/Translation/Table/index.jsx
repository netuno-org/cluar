import _service from "@netuno/service-client";
import {
  Button,
  notification,
  Table,
  Space,
  Popconfirm
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import TranslationModal from "../Modal";
import Cluar from "../../../../common/Cluar";

const TranslationTable = forwardRef(({ }, ref) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [languages, setLanguages] = useState([]);
  const [translationData, setTranslationData] = useState(null);
  const [deleteLoadingUid, setDeleteLoadingUid] = useState(null);
  const translationModalRef = useRef();
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10
  });
  const [loading, setLoading] = useState({
    translation: false,
    language: false
  });

  const onLoadTranslations = () => {
    setLoading({ ...loading, translation: true });
    _service({
      url: "reserved-area/translation/list",
      method: "POST",
      data: {
        filters,
        pagination
      },
      success: (response) => {
        setLoading({ ...loading, translation: false });
        const { totalElements, items } = response.json.page;
        setData(items);
        setTotal(totalElements);
      },
      fail: (error) => {
        setLoading({ ...loading, translation: false });
        console.error(error);
        notification.error({
          message: Cluar.plainTranslation('translation-load-failed-message')
        });
      }
    })
  }

  const onLoadLanguages = () => {
    setLoading({ ...loading, language: true });
    _service({
      url: "reserved-area/language/list",
      method: "POST",
      success: (response) => {
        setLoading({ ...loading, language: false });
        const { items } = response.json.page;
        setLanguages(items);
      },
      fail: (error) => {
        setLoading({ ...loading, language: false });
        console.error(error);
        notification.error({
          message: "Falha ao carregar idiomas."
        })
      }
    })
  }

  const onDelete = (uid) => {
    setDeleteLoadingUid(uid);
    _service({
      url: "reserved-area/translation",
      method: "DELETE",
      data: { uid },
      success: () => {
        setDeleteLoadingUid(null);
        notification.success({
          message: Cluar.plainTranslation("translation-table-delete-success-message")
        });
        onLoadTranslations();
      },
      fail: (error) => {
        setDeleteLoadingUid(null);
        console.error(error);
        const errorMessage = error?.json?.error || Cluar.plainTranslation("translation-table-delete-failed-message");
        notification.error({ message: errorMessage });
      }
    });
  }

  const onReloadTable = () => {
    setFilters({});
    setPagination({
      page: 1,
      size: 10
    });
    onLoadTranslations();
  }

  useImperativeHandle(ref, () => {
    return {
      onReloadTable
    }
  }, []);

  useEffect(() => {
    onLoadTranslations();
    onLoadLanguages();
  }, []);

  useEffect(() => {
    onLoadTranslations();
  }, [pagination, filters])

  const columns = [
    {
      title: Cluar.plainTranslation('translation-table-language'),
      dataIndex: 'language',
      key: 'language_codes',
      onHeaderCell: () => ({
        "data-column-key": "language",
      }),
      render: (val) => val.description,
      filtered: filters.language_codes,
      filters: languages.map((language) => ({
        text: language.description,
        value: language.code
      }))
    },
    {
      title: Cluar.plainTranslation('translation-table-entry'),
      dataIndex: 'entry',
      key: 'entry_code',
      onHeaderCell: () => ({
        "data-column-key": "entry",
      }),
      render: (val) => val.description
    },
    {
      title: Cluar.plainTranslation('translation-table-value'),
      dataIndex: 'value',
      key: 'value',
      onHeaderCell: () => ({
        "data-column-key": "value",
      }),
      render: val => Cluar.plainHTML(val),
    },
    {
      title: Cluar.plainTranslation('translation-table-actions'),
      dataIndex: 'actions',
      key: 'actions',
      onHeaderCell: () => ({
        "data-column-key": "actions",
      }),
      render: (val, record) => (
        <Space size={4}>
          <Button
            type="text"
            title={Cluar.plainTranslation("translation-table-button-edit")}
            icon={<EditOutlined />}
            onClick={() => {
              setTranslationData(record);
              translationModalRef.current.onOpenModal();
            }}
          />
          <Popconfirm
            title={Cluar.plainTranslation("translation-table-popconfirm-delete-title")}
            onConfirm={() => onDelete(record.uid)}
          >
            <Button
              type="text"
              danger
              title={Cluar.plainTranslation("translation-table-button-delete")}
              icon={<DeleteOutlined />}
              loading={deleteLoadingUid === record.uid}
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <TranslationModal
        ref={translationModalRef}
        translationData={translationData}
        onReloadTable={onReloadTable}
      />
      <Table
        columns={columns}
        loading={loading.translation}
        dataSource={data}
        scroll={{ x: 600 }}
        pagination={{
          pageSize: pagination.size,
          total: total,
          position: ["bottomRight", "topRight"],
          onChange: (current) => { setPagination({ ...pagination, page: current }) }
        }}
        onChange={(pagination, currentFilters, currentSorter, { action }) => {
          if (action === "filter") {
            const newFilters = {
              ...filters
            }
            Object.keys(currentFilters).forEach((key) => {
              const value = currentFilters[key];

              newFilters[key] = value;
            })
            setFilters(newFilters);
          }
        }}
      />
    </div>
  )
})

export default TranslationTable;
