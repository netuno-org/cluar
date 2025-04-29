import {
    Button,
    Col,
    notification,
    Row,
    Table,
    Input,
    Switch
} from "antd";

import { EditOutlined, SearchOutlined, ApartmentOutlined } from "@ant-design/icons"

import "./index.less"
import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from "react";
import UserModal from "../Modal";
import OrganizationModal from "../OrganizationModal";
import _service from '@netuno/service-client';
import Cluar from "../../../../common/Cluar";

const debounces = {};

const UserTable = forwardRef(({ }, ref) => {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const userModalRef = useRef();
    const organizationModalRef = useRef();
    const [userData, setUserData] = useState(null);
    const [loadingActive, setLoadingActive] = useState({
        isLoading: false,
        key: ""
    });
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10
    });

    const onActive = ({ uid, active }) => {
        console.log({ uid, active })
        setLoadingActive({
            isLoading: true,
            key: uid
        });
        _service({
            url: "user/active",
            method: "PUT",
            data: {
                uid,
                active: !active
            },
            success: (response) => {
                setItems((prev) => {
                    return prev.map((item) => {
                        if (item.uid === uid) {
                            return ({
                                ...item,
                                active: !active
                            })
                        }
                        return item;
                    })
                })
                setLoadingActive({
                    isLoading: false,
                    key: uid
                });
                notification.success({
                    message: active ? Cluar.plainDictionary('users-table-desactive-success-message') : Cluar.plainDictionary('users-table-active-success-message')
                })
            },
            fail: (error) => {
                setLoadingActive({
                    isLoading: false,
                    key: uid
                });
                console.log(error);
                notification.error({
                    message: active ? Cluar.plainDictionary('users-table-desactive-failed-message') : Cluar.plainDictionary('users-table-active-failed-message')
                });
            }
        })
    }

    const onReloadTable = () => {
        setFilters({});
        setPagination({
            page: 1,
            size: 10
        })
        onLoadData();
    }

    const onLoadData = () => {
        setLoading(true);
        _service({
            url: "user/list",
            method: "POST",
            data: {
                filters,
                pagination
            },
            success: (response) => {
                setLoading(false);
                const { items, totalElements } = response.json.page;
                setTotal(totalElements);
                setItems(items);
            },
            fail: (error) => {
                setLoading(false);
                console.error(error);
                notification.error({
                    message: "Falha ao carregar utilizadores."
                })
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

    useImperativeHandle(ref, () => {
        return {
            onReloadTable
        }
    }, [])

    useEffect(() => {
        onLoadData();
    }, []);


    useEffect(() => {
        onLoadData();
    }, [filters, pagination]);

    const columns = [
        {
            title: Cluar.plainDictionary('users-table-active'),
            dataIndex: 'active',
            key: 'active',
            render: (val, record) => (
                <Switch
                    size="small"
                    checked={val}
                    loading={loadingActive.isLoading && loadingActive.key === record.uid}
                    disabled={loadingActive.isLoading && loadingActive.key === record.uid}
                    onChange={() => {
                        onActive({
                            uid: record.uid,
                            active: record.active
                        })
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
            title: Cluar.plainDictionary('users-table-name'),
            dataIndex: 'name',
            key: 'name',
            ...getTextFilterProps("name")
        },
        {
            title: Cluar.plainDictionary('users-table-user'),
            dataIndex: 'username',
            key: 'username',
            ...getTextFilterProps("username")
        },
        {
            title: Cluar.plainDictionary('users-table-mail'),
            dataIndex: 'email',
            key: 'email',
            ...getTextFilterProps("email")
        },
        {
            title: Cluar.plainDictionary('users-table-actions'),
            dataIndex: 'actions',
            key: 'action',
            render: (val, record) => (
                <Row>
                    <Col>
                        <Button
                            icon={<EditOutlined />}
                            type="text"
                            title={Cluar.plainDictionary('users-table-actions-edit-title')}
                            onClick={() => {
                                setUserData(record);
                                userModalRef.current.openModal()
                            }}
                        />
                    </Col>
                    <Col>
                        <Button
                            icon={<ApartmentOutlined />}
                            type="text"
                            title={"Organizações"}
                            onClick={() => {
                                setUserData(record);
                                organizationModalRef.current.openModal();
                            }}
                        />
                    </Col>
                </Row>
            )
        }
    ];


    return (
        <div>
            <UserModal
                ref={userModalRef}
                userData={userData}
                onReloadTable={onReloadTable}
            />
            <OrganizationModal
                ref={organizationModalRef}
                userData={userData}
            />
            <Table
                columns={columns}
                dataSource={items}
                loading={loading}
                scroll={{ x: 600 }}
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
                pagination={{
                    onChange: (current) => {
                        setPagination({
                            size: pagination.size,
                            page: current
                        })
                    },
                    pageSize: pagination.size,
                    total: total,
                    current: pagination.page,
                    position: ["bottomRight", "topRight"],
                }}
            />
        </div>
    )
})

export default UserTable;