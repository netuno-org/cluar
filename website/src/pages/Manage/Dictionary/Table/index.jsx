import _service from "@netuno/service-client";
import {
    Button,
    notification,
    Table
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";


const DictionaryTable = () => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState({
        page:1,
        size:10
    });
    const [loading, setLoading] = useState({
        dictionary:false
    });

    const onLoadDictionaries = () => {
        setLoading({...loading, dictionary:true});
        _service({
            url:"dictionary/list",
            method:"POST",
            data:{
                filters,
                pagination
            },
            success: (response) => {
                setLoading({...loading, dictionary:false});
                const { totalElements, items } = response.json.page;
                setData(items);
                setTotal(totalElements);
            },
            fail: (error) => {
                setLoading({...loading, dictionary:false});
                console.log(error);
                notification.error({
                    message:"Falha ao carregar Dicionários."
                });
            }
        })
    }

    const onRelaodTable = () => {
        setFilters({});
        setPagination({
            page:1,
            size:10
        });
        onLoadDictionaries();
    }

    useEffect(() => {
        onLoadDictionaries();
    },[]);

    useEffect(() => {
        onLoadDictionaries();
    }, [pagination]) 

    const columns = [
        {
            title: 'Idioma',
            dataIndex: 'language',
            key: 'language_code',
            render: (val) => val.description
        },
        {
            title: 'Chave',
            dataIndex: 'entry',
            key: 'entry_code',
            render: (val) => val.description
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value'
        },
        {
            title: 'Ações',
            dataIndex: 'actions',
            key: 'actions',
            render: (val, record) => (
                <Button
                    type="text"
                    title="Editar"
                    icon={<EditOutlined/>}
                    onClick={() => {}}
                />
            )
        }
    ]

    return(
        <div>
            <Table
                columns={columns}
                loading={loading.dictionary}
                dataSource={data}
                pagination={{
                    pageSize:pagination.size,
                    total:total,
                    position:["bottomRight", "topRight"],
                    onChange: (current) => {setPagination({...pagination, page:current})} 
                }}
            />
        </div>
    )
}

export default DictionaryTable;