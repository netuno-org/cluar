import { 
    Button,
    notification,
    Table
 } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import _service from "@netuno/service-client";
import ConfigurationModal from "../Modal";

const ConfigurationTable = forwardRef(({}, ref) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(false);
    const [total, setTotal] = useState(false);
    const [filters, setFilters] = useState({});
    const configurationModalRef = useRef();
    const [configurationData, setConfigurationData] = useState(null);
    const [pagination, setPagination] = useState({
        size:10,
        page:1
    });

    const onLoadConfigurations = () => {
        setLoading(true);
        _service({
            url:"configuration/list",
            method:"POST",
            data:{
                filters,
                pagination
            },
            success: (response) => {
                setLoading(false);
                const { totalElements, items } = response.json.page;
                setData(items);
                setTotal(totalElements);
            },
            fail: (error) => {
                setLoading(false);
                console.log(error);
                notification.error({
                    message:"Falha ao carregar configurações."
                })
            }
        });
    }

    const onReloadTable = () => {
        setFilters({});
        setPagination({
            size:10,
            page:1
        });
        onLoadConfigurations();
    }

    useImperativeHandle(ref, () => {
        return {
            onReloadTable
        }
    },[]);

    useEffect(() => {
        onLoadConfigurations();
    },[]);

    const columns = [
        {
            title: 'Idioma',
            dataIndex: 'language',
            key: 'parameter',
            render:(val) => val.description
        },
        {
            title: 'Parâmetro',
            dataIndex: 'parameter',
            key: 'parameter',
            render:(val) => val.description
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: 'Ações',
            dataIndex: 'actions',
            key: 'actions',
            render: (val, record) => (
                <Button
                    type="text"
                    onClick={() => {
                        setConfigurationData(record);
                        configurationModalRef.current.onOpenModal();
                    }}
                    icon={<EditOutlined/>}
                />
            )
        }
    ]; 

    return(
        <div>
            <ConfigurationModal
                ref={configurationModalRef}
                onReloadTable={onReloadTable}
                configurationData={configurationData}
            />
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{
                    onChange: (current) => {setPagination({page:current, size:pagination.size})},
                    total:total,
                    position:["bottomRight", "topRight"],
                    pageSize:pagination.size
                }}
            />
        </div>
    )
})

export default ConfigurationTable;