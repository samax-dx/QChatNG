import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { callkit } from 'lib/qchat/callkit';
import { CallManager } from 'lib/qchat/callkit/CallManager';


@Component({
    selector: 'app-call-widget',
    templateUrl: './call-widget.component.html',
    styleUrls: ['./call-widget.component.scss']
})
export class CallWidgetComponent implements OnInit {
    @ViewChild("local_video") localVideoElm: ElementRef<HTMLVideoElement>;
    @ViewChild("remote_video") remoteVideoElm: ElementRef<HTMLVideoElement>;

    user: any;
    calltype: "inbound" | "outbound" = "outbound";
    enablelocalvide: boolean = false;

    ringing: boolean = false;
    incall: boolean = false;

    private _callmanager: CallManager | null = null;

    oncallended = () => {
        console.warn("NOP!! CallWidgetComponent.oncallended")
    };

    constructor(private _elementRef: ElementRef) { }

    ngOnInit() {
        if (this.calltype === "outbound") this.makeCall();
        else this.takeCall();
    }

	makeCall(): void {
        callkit.makeCall(
            this.user.id,
            this.enablelocalvide,
            {
                onunhold: () => {},
                onhold: () => {},
                onringing: () => { this.ringing = true; },
                onstart: () => {
                    this.incall = true;
                    this.ringing = false;
                },
                onhangup: reason => { this.endCallWithReason(reason); },
                onlocalmediastream: stream => {
                    this.localVideoElm.nativeElement.srcObject = stream;
                },
                onremotemediastream: stream => {
                    this.remoteVideoElm.nativeElement.srcObject = stream;
                }
            }
        ).then(callmanager => {
            this._callmanager = callmanager;
        }).catch(err => {
            console.log(err);
            this.endCall();
        });
	}

    takeCall(): void {
        callkit.takeCall(
            this.user.id,
            this.enablelocalvide,
            {
                onhold: () => {},
                onunhold: () => {},
                onstart: () => {
                    this.incall = true;
                },
                onhangup: reason => { this.endCallWithReason(reason); },
                onlocalmediastream: stream => {
                    this.localVideoElm.nativeElement.srcObject = stream;
                },
                onremotemediastream: stream => {
                    this.remoteVideoElm.nativeElement.srcObject = stream;
                }
            }
        ).then(callmanager => {
            this._callmanager = callmanager;
        }).catch(err => {
            console.log(err);
        });
	}

    endCall(): void {
        this.endCallWithReason("hangup");
        if (this._callmanager) this._callmanager.hangup();
    }

    endCallWithReason(reason: any) {
        this.ringing = false;
        this.incall = false;
        this.oncallended();
    }
}
