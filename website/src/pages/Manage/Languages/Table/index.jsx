import {
    Button,
    Col,
    notification,
    Row,
    Switch,
    Table
} from "antd";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import { EditOutlined } from "@ant-design/icons";
import _service from "@netuno/service-client";
import LanguageModal from "../Modal";
import Cluar from "../../../../common/Cluar";

const LanguageTable = forwardRef(({ }, ref) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const languageModalRef = useRef();
    const [languageEditeData, setLanguageEditeData] = useState(null);
    const [activeLoading, setActiveLoading] = useState({
        key: "",
        isLoading: false
    });
    const [loadingChangeDefult, setLoadingChangeDefult] = useState({
        key: "",
        isLoading: false
    });
    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10
    });

    const onLoadLanguages = () => {
        setLoading(true);
        _service({
            url: "language/list",
            method: "POST",
            data: {
                pagination,
                filters
            },
            success: (response) => {
                setLoading(false);
                const { items, totalElements } = response.json.page;
                setData(items);
                setTotal(totalElements);
            },
            fail: (error) => {
                setLoading(false);
                console.error(error);
                notification.error({
                    message: Cluar.plainDictionary('language-load-failed-message')
                })
            }
        })
    }

    const onActive = ({ uid, active }) => {
        setActiveLoading({
            key: uid,
            isLoading: true
        });
        _service({
            url: "language/active",
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
                    message: active ? Cluar.plainDictionary('language-table-desactive-success-message') : Cluar.plainDictionary('language-table-active-success-message') 
                })
            },
            fail: (error) => {
                setActiveLoading({
                    key: uid,
                    isLoading: false
                });
                console.log(error);
                notification.error({
                    message: active ? Cluar.plainDictionary('language-table-desactive-failed-message') : Cluar.plainDictionary('language-table-active-failed-message') 
                });
            }
        })
    }

    const onChangeDefaultLanguage = (data) => {
        if (data) {
            setLoadingChangeDefult({
                key: data.uid,
                isLoading: true
            });
            _service({
                url: "language",
                method: "PUT",
                data: {
                    ...data,
                    default: !data.default
                },
                success: (response) => {
                    setLoadingChangeDefult({
                        key: data.uid,
                        isLoading: false
                    });
                    setData((prev) => {
                        return prev.map((item) => {
                            if (item.uid === data.uid) {
                                return ({
                                    ...item,
                                    default: !item.default
                                })
                            }
                            return item;
                        })
                    });
                    notification.success({
                        message: Cluar.plainDictionary('language-table-default-success-message')
                    });
                },
                fail: (error) => {
                    setLoadingChangeDefult({
                        key: data.uid,
                        isLoading: false
                    });
                    console.log(error);
                    notification.error({
                        message: Cluar.plainDictionary('language-table-default-failed-message')
                    });
                }
            })
        }
    }

    const onReloadTable = () => {
        setFilters({});
        setPagination({ page: 1, size: 10 });
        onLoadLanguages();
    }

    const columns = [
        {
            title: Cluar.plainDictionary('language-table-active'),
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
            )
        },
        {
            title: Cluar.plainDictionary('language-table-description'),
            dataIndex: 'description',
            key: 'description',
            onHeaderCell: () => ({
                "data-column-key": "description",
            }),
        },
        {
            title: Cluar.plainDictionary('language-table-code'),
            dataIndex: 'code',
            key: 'code',
            onHeaderCell: () => ({
                "data-column-key": "code",
            }),
        },
        {
            title: Cluar.plainDictionary('language-table-locale'),
            dataIndex: 'locale',
            onHeaderCell: () => ({
                "data-column-key": "locale",
            }),
            key: 'locale',
        },
        {
            title: Cluar.plainDictionary('language-table-default'),
            dataIndex: 'default',
            key: 'default',
            onHeaderCell: () => ({
                "data-column-key": "default",
            }),
            render: (val, record) => (
                <Switch
                    size="small"
                    checked={val}
                    loading={loadingChangeDefult.key === record.uid && loadingChangeDefult.isLoading}
                    disabled={loadingChangeDefult.key === record.uid && loadingChangeDefult.isLoading}
                    onChange={() => {
                        onChangeDefaultLanguage(record);
                    }}
                />
            )
        },
        {
            title: Cluar.plainDictionary('language-table-actions'),
            dataIndex: 'Actions',
            key: 'actions',
            onHeaderCell: () => ({
                "data-column-key": "actions",
            }),
            render: (val, record) => (
                <Row>
                    <Col>
                        <Button
                            icon={<EditOutlined />}
                            type="text"
                            title="Editar"
                            onClick={() => {
                                setLanguageEditeData(record);
                                languageModalRef.current.openModal();
                            }}
                        />
                    </Col>
                </Row>
            )
        },
    ]

    useImperativeHandle(ref, () => {
        return {
            onReloadTable
        }
    }, []);

    useEffect(() => {
        onLoadLanguages();
    }, [])

    useEffect(() => {
        onLoadLanguages();
    }, [pagination])

    return (
        <div>
            <LanguageModal
                ref={languageModalRef}
                languageData={languageEditeData}
                onReloadTable={onReloadTable}
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
            />
        </div>
    )
})

export default LanguageTable;