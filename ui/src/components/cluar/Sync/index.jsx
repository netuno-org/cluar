import React, { useState } from 'react';

import { Button, notification } from 'antd';

import _service from '@netuno/service-client';

function CluarSync() {
    const [ loading, setLoading ] = useState(false);
    const onClick = () => {
        setLoading(true);
        _service({
            method: 'GET',
            url: "/admin/cluar/sync",
            success: (response) => {
                notification.success({
                    message: 'Sincronização',
                    description: 'A sincronização de todos os dados no website foi realizada.'
                });
                setLoading(false);
            },
            fail: (e) => {
                console.error("Service admin/cluar/images error.", e);
                notification.error({
                    message: 'Sincronização',
                    description: 'Não foi possível sincronizar todos os dados no website.'
                });
                setLoading(false);
            }
        });
    };
    return <Button onClick={onClick} loading={loading}>Sincronizar com o website.</Button>
}

export default CluarSync;