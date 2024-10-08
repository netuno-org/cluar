import React, { useEffect, useState, useRef } from 'react';

import { Table, Input, Button, notification, Modal } from 'antd';

import { SearchOutlined } from '@ant-design/icons';

import Highlighter from 'react-highlight-words';

import _service from '@netuno/service-client';

const { Column } = Table;

const pageSize = 10;

const columnsNames = [ 'name', 'email', 'subject', 'moment', 'actions' ];

const columnsTitles = {
    name: 'Nome',
    email: 'E-mail',
    subject: 'Título',
    moment: 'Momento',
    actions: "Ações"
};

function ContactTable() {
    const [ uid, setUID ] = useState(null);
    const [ dataSource, setDataSource ] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [currentDetails, setCurrentDetails] = useState({});
    const [ loading, setLoading ] = useState(true);
    const [ filter, setFilter ] = useState({
        name: '',
        email: '',
        subject: '',
        moment: ''
    });
    const [ pagination, setPagination ] = useState({
        current: 1,
        pageSize,
        total: 0
    });
    const [ sorter, setSorter ] = useState({
        field: '',
        order: ''
    });

    const searchInput = useRef();

    const loadTable = (settings) => {
        if (settings == null || typeof settings == "undefined") {
            settings = { state: null };
        }
        if (typeof settings.filter == 'undefined') {
            settings.filter = filter;
        }
        if (typeof settings.pagination == 'undefined') {
            settings.pagination = pagination;
        }
        if (typeof settings.sorter == 'undefined') {
            settings.sorter = sorter;
        }
        setFilter(settings.filter);
        setSorter(settings.sorter);
        setPagination(settings.pagination);
        setLoading(true);
        _service({
            method: 'POST',
            url: "/admin/contact/list",
            data: { filter, pagination, sorter },
            success: (response) => {
                setDataSource(response.json.resultados.map(item => {
                    const momentArr = item.moment.split(" ");
                    const dateArr = momentArr[0].split("-");
                    const timeArr = momentArr[1].slice(0, 5);
                    const moment = `${dateArr[2]}/${dateArr[1]}/${dateArr[0]} ${timeArr}`;
                    return {
                        ...item,
                        moment,
                        actions: (
                            <Button 
                                onClick={() => {
                                    setCurrentDetails({...item, moment});
                                    setShowDetails(true);
                                }}
                            >
                                Detalhes
                            </Button>
                        )
                    };
                }));
                setPagination({
                    ...pagination,
                    total: response.json.total
                });
                setLoading(false);
            },
            fail: (e) => {
                console.error("Service admin/tabela error.", e);
                notification.error({
                    message: 'Tabela',
                    description: 'Não foi possível carregar os dados.'
                });
                setDataSource([]);
                setLoading(false);
            }
        });
    };
    
    const handleTableChange = (pagination, filters, sorter) => {
        loadTable({ pagination, filters, sorter: { field: sorter.field, order: sorter.order } });
    };
    
    const handleSearch = (selectedKeys, confirm, value, dataIndex) => {
        if (value != null && value != '') {
            filter[dataIndex] = value;
        }
        confirm();
        loadTable({ filter });
    };

    const handleReset = (clearFilters, dataIndex) => {
        filter[dataIndex] = '';
        clearFilters();
        loadTable({ filter });
    };

    const getColumnSearchProps = (dataIndex) => {
        return {
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                let field = null;
                let width = 200;
                let filterValue = '';
                let buttons = [];
                buttons.push(
                    <Button
                      key={buttons.length}
                      type="primary"
                      onClick={() => handleSearch(selectedKeys, confirm, selectedKeys.length > 0 ? selectedKeys[0] : '', dataIndex)}
                      icon={<SearchOutlined />}
                      size="small"
                      style={{ width: 90, marginRight: 8 }}
                    >
                      Filtrar
                    </Button>
                );
                buttons.push(
                    <Button key={buttons.length} onClick={() => handleReset(clearFilters, dataIndex)} size="small" style={{ width: 90 }}>
                      Limpar
                    </Button>
                );
                field = (
                    <Input
                      ref={searchInput}
                      placeholder={ `${columnsTitles[dataIndex]}...`}
                      value={selectedKeys[0]}
                      onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                      onPressEnter={() => handleSearch(selectedKeys, confirm, selectedKeys.length > 0 ? selectedKeys[0] : '', dataIndex)}
                    />
                );
                return (
                    <div style={{ padding: 8 }}>
                      <div style={{ width, marginBottom: 8, display: 'block' }}>
                        { field }
                      </div>
                      { buttons }
                    </div>
                );
            },
            filterIcon: filtered => {
                return (
                    <SearchOutlined 
                      style={{ color: filtered ? '#dc1c2e' : undefined }}
                    />
                );
            },
            onFilter: (value, record) => {
                return record;
            },
            onFilterDropdownOpenChange: visible => {
                if (visible && searchInput.current) {
                    window.setTimeout(() => searchInput.current.select());
                }
            },
            render: text => {
                if (text && filter != null && filter[dataIndex] != null && filter[dataIndex] != '') {
                    return (
                        <Highlighter
                          highlightStyle={{ backgroundColor: '#dc1c2e', color: '#ffffff', padding: 0 }}
                          searchWords={ [ filter[dataIndex] ] }
                          autoEscape
                          textToHighlight={text.toString()}
                        />
                    );
                }
                return text;
            },
        };
    };

    useEffect(() => {
        loadTable();
        const handleNavigationLoad = () => {
            $('[netuno-navigation]').find('a').on('netuno:click', (e) => {
                const link = $(e.target);
                if (link.is('[netuno-navigation-dashboard]')) {
                    // Memu > Dashboard > Clicked!
                    loadTable();
                }
            });
        };
        netuno.addNavigationLoad(handleNavigationLoad);
        return () => {
            netuno.removeNavigatoinLoad(handleNavigationLoad);
        };
    }, []);
    return (
        <>
             <Modal 
                title="Detalhes do contacto"
                open={showDetails}
                onOk={() => setShowDetails(false)}
                onCancel={() => setShowDetails(false)}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <p><strong>Nome:</strong> {currentDetails?.name}</p>
                <p><strong>E-mail:</strong> {currentDetails?.email}</p>
                <p><strong>Data:</strong> {currentDetails?.moment}</p>
                <p><strong>Assunto:</strong> {currentDetails?.subject}</p>
                <p style={{whiteSpace: "pre-wrap"}}>{currentDetails?.message}</p>
            </Modal>
            <Table
        size="small"
        loading={loading}
        pagination={pagination}
        dataSource={dataSource}
        onChange={handleTableChange}
        >
        {columnsNames.map(
            (columnName) =>
                <Column
                    title={columnsTitles[columnName]}
                    dataIndex={columnName}
                    key={columnName}
                    sorter={true}
                    { ...getColumnSearchProps(columnName) }
                />
        )}
        </Table>
        </>
    );
}

export default ContactTable;
