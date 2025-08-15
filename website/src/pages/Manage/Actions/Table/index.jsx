import {
    Button,
    Col,
    notification,
    Row,
    Switch,
    Table,
    Input
} from "antd";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import _service from "@netuno/service-client";
import Cluar from "../../../../common/Cluar";
import ActionsModal from "../Modal";

const debounces = {}

const ActionsTable = forwardRef(({ }, ref) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const actionModalRef = useRef();
    const [actionEditeData, setActionEditeData] = useState(null);
    const [activeLoading, setActiveLoading] = useState({
        key: "",
        isLoading: false
    });
    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10
    });
    const [languages, setLanguages] = useState([]);

    const onLoadLanguages = () => {
        const languagesList = Cluar.languages() || [];
        console.log("languagesList", languagesList);

        setLanguages(languagesList);
    }

    const onActive = ({ uid, active }) => {
        setActiveLoading({
            key: uid,
            isLoading: true
        });
        _service({
            url: "actions/active",
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
                    message: active ? Cluar.plainDictionary('actions-table-desactive-success-message') : Cluar.plainDictionary('actions-table-active-success-message')
                })
            },
            fail: (error) => {
                setActiveLoading({
                    key: uid,
                    isLoading: false
                });
                console.log(error);
                notification.error({
                    message: active ? Cluar.plainDictionary('actions-table-desactive-failed-message') : Cluar.plainDictionary('actions-table-active-failed-message')
                });
            }
        })
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

    const onLoadActions = () => {
        setLoading(true);
        const actionsData = Cluar.actions() || {};

        const startIndex = (pagination.page - 1) * pagination.size;
        const paginatedActions = actionsData.slice(startIndex, startIndex + pagination.size);

        setData(paginatedActions);
        
        setTotal(actionsData.length);
        setLoading(false);
    }

    const onReloadTable = () => {
        setFilters({});
        setPagination({ page: 1, size: 10 });
        onLoadActions();
    }

    const columns = [
        {
            title: Cluar.plainDictionary('actions-table-active'),
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
            title: Cluar.plainDictionary("actions-table-language"),
            dataIndex: "language",
            key: "language_code",
            onHeaderCell: () => ({
                "data-column-key": "language",
            }),
            render: (val, record) => {
                const language = languages.find(
                    (lang) => lang.code === record.language_code
                );
                return language ? language.description : record.language_code || "-";
            },
            filtered: filters.language_code,
            filters: languages.map((language) => ({
                text: language.description,
                value: language.code,
            })),
        },
        {
            title: Cluar.plainDictionary("actions-table-title"),
            dataIndex: "title",
            key: "title",
            ...getTextFilterProps("title"),
            onHeaderCell: () => ({
                "data-column-key": "title",
            }),
        },
        {
            title: Cluar.plainDictionary("actions-table-content"),
            dataIndex: "content",
            key: "content",
            ...getTextFilterProps("content"),
            onHeaderCell: () => ({
                "data-column-key": "content",
            }),
        },
        {
            title: Cluar.plainDictionary("actions-table-indication"),
            dataIndex: "indication",
            key: "indication",
            ...getTextFilterProps("indication"),
            onHeaderCell: () => ({
                "data-column-key": "indication",
            }),
        },
        {
            title: Cluar.plainDictionary("actions-table-link"),
            dataIndex: "link",
            key: "link",
            onHeaderCell: () => ({
                "data-column-key": "link",
            }),
        },
        {
            title: Cluar.plainDictionary("actions-table-actions"),
            dataIndex: "actions",
            key: "actions",
            onHeaderCell: () => ({
                "data-column-key": "actions",
            }),
            render: (val, record) => (
                <Button
                    type="text"
                    title="Editar"
                    icon={<EditOutlined />}
                    onClick={() => {
                        setActionEditeData(record);
                        actionModalRef.current.openModal();
                    }}
                />
            ),
        },
    ];

    useImperativeHandle(ref, () => {
        return {
            onReloadTable
        }
    }, []);

    useEffect(() => {
        onLoadLanguages();
        onLoadActions();
    }, []);

    useEffect(() => {
        onLoadActions();
    }, [pagination, filters]);

    return (
        <div>
            <ActionsModal
                ref={actionModalRef}
                actionData={actionEditeData}
                onReloadTable={onReloadTable}
            />
            <Table
                columns={columns}
                loading={loading}
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

export default ActionsTable;