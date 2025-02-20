import { notification, Switch, Table } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import _service from "@netuno/service-client";

const LanguageTable = forwardRef(({}, ref) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [activeLoading, setActiveLoading] = useState({
        key:"",
        isLoading:false
    });
    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState({
        page:1,
        size:10
    });

    const onLoadLanguage = () => {
        setLoading(true);
        _service({
            url:"language/list",
            method:"POST",
            data:{
                pagination,
                filters
            },
            success: (response) => {
                setLoading(false);
                const {items, totalElements} = response.json.page;
                setData(items);
                setTotal(totalElements);
            },
            fail: (error) => {
                setLoading(false);
                console.error(error);
                notification.error({
                    message:"Falha ao carregar idiomas."
                })
            }
        })
    }

    const onActive = ({uid, active}) => {
        setActiveLoading({
            key:uid,
            isLoading:true
        });
        _service({
            url:"language/active",
            method:"PUT",
            data:{
                uid,
                active:!active
            },
            success: (response) => {
                setActiveLoading({
                    key:uid,
                    isLoading:false
                });
                setData((prev) => {
                    return prev.map((item) => {
                        if (item.uid === uid) {
                            return ({
                                ...item,
                                active:!active
                            })
                        }
                        return item;
                    })
                });
            },
            fail: (error) => {
                setActiveLoading({
                    key:uid,
                    isLoading:false
                });
                console.log(error);
                notification.error({
                    message:`Falha ao ${active ? "desactivar" : "activar"} idioma.`
                });
            }
        })
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
                        onActive({uid:record.uid, active:val});
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
                />
            )
        },
    ]

    useImperativeHandle(ref, () => {
        return {

        }
    }, []);

    useEffect(() => {
        onLoadLanguage();
    },[])

    return (
        <div>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                scroll={{ x: 600 }}
            />
        </div>
    )
})

export default LanguageTable;