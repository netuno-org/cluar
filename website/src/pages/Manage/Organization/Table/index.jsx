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
import OrganizationModal from "../Modal";

const debounces = {}

const OrganizationTable = forwardRef(({ }, ref) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const organizationModalRef = useRef();
    const [organizationEditeData, setOrganizationEditeData] = useState(null);
    const [activeLoading, setActiveLoading] = useState({
        key: "",
        isLoading: false
    });
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
            url: "organization/active",
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
            url: "organization/list",
            method: "POST",
            data: {
                pagination,
                filters
            },
            success: (response) => {
                setLoading(false);
                const { organizations, organization_total } = response.json
                setData(organizations);
                setTotal(organization_total);
            },
            fail: (error) => {
                setLoading(false);
                console.error(error);
                notification.error({
                    message: Cluar.plainDictionary("organization-table-load-failed")
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
            title: Cluar.plainDictionary('organization-table-active'),
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
            title: Cluar.plainDictionary('organization-table-name'),
            dataIndex: 'name',
            key: 'name',
            ...getTextFilterProps("name"),
            onHeaderCell: () => ({
                "data-column-key": "name",
            }),
        },
        {
            title: Cluar.plainDictionary('organization-table-code'),
            dataIndex: 'code',
            ...getTextFilterProps("code"),
            onHeaderCell: () => ({
                "data-column-key": "code",
            }),
            key: 'code',
        },
        {
            title: Cluar.plainDictionary('organization-table-parent'),
            dataIndex: 'parent',
            ...getTextFilterProps("parent_name"),
            onHeaderCell: () => ({
                "data-column-key": "parent",
            }),
            key: 'parent',
            render: (val, record) => val?.name
        },
        {
            title: Cluar.plainDictionary('organization-table-actions'),
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
                                setOrganizationEditeData(record);
                                organizationModalRef.current.onOpenModal();
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
        onLoadOrganizations();
    }, [])

    useEffect(() => {
        onLoadOrganizations();
    }, [pagination, filters])

    return (
        <div>
            <OrganizationModal
                ref={organizationModalRef}
                organizationData={organizationEditeData}
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