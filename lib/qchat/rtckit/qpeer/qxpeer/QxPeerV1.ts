import { QxPeerCore } from './QxPeerCore';
import { QxPeerRemoteICEHandler } from './QxPeerRemoteICEHandler';
import { QxPeerOfferHelper } from './QxPeerOfferHelper';
import { QxPeerDataChannelManager } from './QxPeerDataChannelManager';
import { QxPeerStateGuard } from './QxPeerStateGuard';


type qxp_ts = (
    QxPeerCore &
    QxPeerRemoteICEHandler &
    QxPeerOfferHelper &
    QxPeerDataChannelManager &
    QxPeerStateGuard
);

const QxPeerT: new (luser: string, ruser: string) => qxp_ts = <any>
    QxPeerStateGuard(
        QxPeerDataChannelManager(
            QxPeerOfferHelper(
                QxPeerRemoteICEHandler(
                    QxPeerCore
                )
            )
        )
    );
export class QxPeerV1 extends QxPeerT { }
