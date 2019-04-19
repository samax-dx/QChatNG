import { qmpeer } from '..';


qmpeer.setOnMessageListener((msg, sender) => {});
qmpeer.setOnCallListener((trackinfolist, stream) => Promise.resolve());
