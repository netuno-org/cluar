import {
    Button,
    notification,
    Table,
    Image,
    Space,
    Popconfirm
} from "antd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import _service from "@netuno/service-client";
import ConfigurationModal from "../Modal";
import Cluar from "../../../../common/Cluar";

const ConfigurationTable = forwardRef(({ }, ref) => {
    const [loading, setLoading] = useState({
        configuration: false,
        language: false
    });
    const [data, setData] = useState(false);
    const [total, setTotal] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [filters, setFilters] = useState({});
    const [deleteLoadingUid, setDeleteLoadingUid] = useState(null);
    const configurationModalRef = useRef();
    const [configurationData, setConfigurationData] = useState(null);
    const [pagination, setPagination] = useState({
        size: 10,
        page: 1
    });

    const onLoadConfigurations = () => {
        setLoading({ ...loading, configuration: true });
        _service({
            url: "configuration/list",
            method: "POST",
            data: {
                filters,
                pagination
            },
            success: (response) => {
                setLoading({ ...loading, configuration: false });
                const { totalElements, items } = response.json.page;
                setData(items);
                setTotal(totalElements);
            },
            fail: (error) => {
                setLoading({ ...loading, configuration: false });
                console.error(error);
                notification.error({
                    message: Cluar.plainDictionary('configuration-page-load-failed-message')
                })
            }
        });
    }

    const onLoadLanguages = () => {
        setLoading({ ...loading, language: true });
        _service({
            url: "language/list",
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
            url: "configuration",
            method: "DELETE",
            data: { uid },
            success: () => {
                setDeleteLoadingUid(null);
                notification.success({
                    message: Cluar.plainDictionary("configuration-table-delete-success-message")
                });
                onLoadConfigurations();
            },
            fail: (error) => {
                setDeleteLoadingUid(null);
                console.error(error);
                const errorMessage = error?.json?.error || Cluar.plainDictionary("configuration-table-delete-failed-message");
                notification.error({ message: errorMessage });
            }
        });
    }

    const onReloadTable = () => {
        setFilters({});
        setPagination({
            size: 10,
            page: 1
        });
        onLoadConfigurations();
    }

    useImperativeHandle(ref, () => {
        return {
            onReloadTable
        }
    }, []);

    useEffect(() => {
        onLoadConfigurations();
        onLoadLanguages();
    }, []);

    useEffect(() => {
        onLoadConfigurations();
    }, [pagination, filters]);

    const columns = [
        {
            title: Cluar.plainDictionary('configuration-table-language'),
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
            title: Cluar.plainDictionary('configuration-table-parameter'),
            dataIndex: 'parameter',
            key: 'parameter',
            onHeaderCell: () => ({
                "data-column-key": "parameter",
            }),
            render: (val) => val.description
        },
        {
            title: Cluar.plainDictionary('configuration-table-parameter-type'),
            dataIndex: 'parameter_type',
            key: 'parameter_type_name',
            onHeaderCell: () => ({
                "data-column-key": "parameter_type_name",
            }),
            render: (val) => val.name
        },
        {
            title: Cluar.plainDictionary('configuration-table-value'),
            dataIndex: 'value',
            key: 'value',
            onHeaderCell: () => ({
                "data-column-key": "value",
            }),
        },
        {
            title: Cluar.plainDictionary('configuration-table-value-img'),
            dataIndex: 'image_url',
            key: 'image_url',
            onHeaderCell: () => ({
                "data-column-key": "image_url",
            }),
            render: (val) => val ? (
                <Image src={val} width="120px" />
            ) : null
        },
        {
            title: Cluar.plainDictionary('configuration-table-actions'),
            dataIndex: 'actions',
            key: 'actions',
            onHeaderCell: () => ({
                "data-column-key": "actions",
            }),
            render: (val, record) => (
                <Space size={4}>
                    <Button
                        type="text"
                        onClick={() => {
                            setConfigurationData(record);
                            configurationModalRef.current.onOpenModal();
                        }}
                        icon={<EditOutlined />}
                    />
                    <Popconfirm
                        title={Cluar.plainDictionary("configuration-table-popconfirm-delete-title")}
                        onConfirm={() => onDelete(record.uid)}
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            loading={deleteLoadingUid === record.uid}
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            <ConfigurationModal
                ref={configurationModalRef}
                onReloadTable={onReloadTable}
                configurationData={configurationData}
            />
            <Table
                columns={columns}
                dataSource={data}
                scroll={{ x: 600 }}
                loading={loading.configuration}
                pagination={{
                    onChange: (current) => { setPagination({ page: current, size: pagination.size }) },
                    total: total,
                    position: ["bottomRight", "topRight"],
                    pageSize: pagination.size
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

export default ConfigurationTable;