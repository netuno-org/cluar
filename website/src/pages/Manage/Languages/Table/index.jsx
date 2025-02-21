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
                    message: "Falha ao carregar idiomas."
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
                    message: `Idioma ${active ? "desactivado" : "activado"} com sucesso.`
                })
            },
            fail: (error) => {
                setActiveLoading({
                    key: uid,
                    isLoading: false
                });
                console.log(error);
                notification.error({
                    message: `Falha ao ${active ? "desactivar" : "activar"} idioma.`
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
                        message: `Idioma editado com sucesso.`
                    });
                },
                fail: (error) => {
                    setLoadingChangeDefult({
                        key: data.uid,
                        isLoading: false
                    });
                    console.log(error);
                    notification.error({
                        message: `Falha ao editar idioma.`
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
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
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
            title: 'Descrição',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Código',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Localização',
            dataIndex: 'locale',
            key: 'locale',
        },
        {
            title: 'Padrão',
            dataIndex: 'default',
            key: 'default',
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
            title: 'Ações',
            dataIndex: 'Actions',
            key: 'actions',
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