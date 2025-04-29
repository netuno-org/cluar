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
import Cluar from "../../../../../common/Cluar";
import MembersModal from "../Modal";

const debounces = {}

const MembersTable = forwardRef(({ configs, userData }, ref) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const membersModalRef = useRef();
    const [memberEditeData, setMemberEditeData] = useState(null);
    const [activeLoading, setActiveLoading] = useState({
        key: "",
        isLoading: false
    });
    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10
    });
    const [groups, setGroups] = useState([]);

    const onLoadGroups = () => {
        _service({
            url: "user/group/list",
            method: "GET",
            data: {},
            success: (response) => {
                const { groups } = response.json;
                setGroups(groups);
            },
            fail: (error) => {
                console.log(error);
            }
        })
    }

    const onActive = ({ uid, active }) => {
        setActiveLoading({
            key: uid,
            isLoading: true
        });
        _service({
            url: "organization/member/active",
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
                    message: active ? Cluar.plainDictionary('members-table-desactive-success-message') : Cluar.plainDictionary('members-table-active-success-message')
                })
            },
            fail: (error) => {
                setActiveLoading({
                    key: uid,
                    isLoading: false
                });
                console.log(error);
                notification.error({
                    message: active ? Cluar.plainDictionary('members-table-desactive-failed-message') : Cluar.plainDictionary('members-table-active-failed-message')
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

    const onLoadMembers = () => {
        setLoading(true);
        _service({
            url: "organization/member/list",
            method: "POST",
            data: {
                pagination,
                filters: {
                    people_uid: userData.uid,
                    ...filters
                }
            },
            success: (response) => {
                setLoading(false);
                const { members, total } = response.json
                setData(members);
                setTotal(total);
            },
            fail: (error) => {
                setLoading(false);
                console.error(error);
                notification.error({
                    message: Cluar.plainDictionary("members-table-load-failed")
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
            title: Cluar.plainDictionary('members-table-active'),
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
            title: Cluar.plainDictionary('members-table-user'),
            dataIndex: 'user',
            key: 'user',
            ...getTextFilterProps("people_name"),
            onHeaderCell: () => ({
                "data-column-key": "user",
            }),
            render: (val, record) => val?.name
        },
        {
            title: Cluar.plainDictionary('members-table-organization'),
            dataIndex: 'organization',
            ...getTextFilterProps("organization_name"),
            onHeaderCell: () => ({
                "data-column-key": "organization",
            }),
            key: 'organization',
            render: (val, record) => val?.name
        },
        {
            title: Cluar.plainDictionary('members-table-group'),
            dataIndex: 'group',
            onHeaderCell: () => ({
                "data-column-key": "group",
            }),
            key: 'group_codes',
            render: (val, record) => val?.name,
            filtered: filters.group_codes,
            filters: groups.map((group) => ({
                text: group.name,
                value: group.code
            }))

        },
        {
            title: Cluar.plainDictionary('members-table-actions'),
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
                                setMemberEditeData(record);
                                membersModalRef.current.onOpenModal();
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
        if (userData) {
            onLoadMembers();
            onLoadGroups();
        }
    }, [])

    useEffect(() => {
        if (userData) {
            onLoadMembers();
        }
    }, [pagination, filters])

    return (
        <div>
            <MembersModal
                ref={membersModalRef}
                memberData={memberEditeData}
                onReloadTable={onReloadTable}
            />
            <Table
                {...configs}
                columns={columns}
                dataSource={data}
                loading={loading}
                scroll={{ x: 600 }}
                pagination={{
                    total: total,
                    pageSize: pagination.size,
                    current: pagination.page,
                    position: ["bottomRight"],
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

                            newFilters[key] = value;

                        })
                        setFilters(newFilters);
                    }
                }}
            />
        </div>
    )
})

export default MembersTable;