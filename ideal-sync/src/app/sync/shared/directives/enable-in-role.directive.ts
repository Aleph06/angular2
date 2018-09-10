import { Directive, ElementRef, OnInit, Input, Renderer2 } from '@angular/core';
import { SessionService } from 'app/shared';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[iSyncEnableInRole]'
})
export class EnableInRoleDirective implements OnInit {

    private defaultRole = 'Operativo';
    roleName: string;
    additional = false;
    @Input() set enableInRole(roleName: string) {
        this.roleName = roleName || this.defaultRole;
    }

    @Input() set enableInRoleAnd(additional: boolean) {
        this.additional = (additional !== undefined) ? additional : false;
        this.doValidation();
    }

    constructor(private el: ElementRef, private renderer: Renderer2,
        private _sesionInfoSrv: SessionService) {
    }

    ngOnInit() {
        this.doValidation();
    }

    doValidation(): void {
        const up = this._sesionInfoSrv.principal as any;
        if ((this.roleName === 'Administrador' && !up.EsAdministrador) || this.additional) {
            this.renderer.setProperty(this.el.nativeElement, 'disabled', true);
        } else if ((this.roleName === 'Supervisor' && up.EsOperativo) || this.additional) {
            this.renderer.setProperty(this.el.nativeElement, 'disabled', true);
        } else {
            this.renderer.setProperty(this.el.nativeElement, 'disabled', false);
        }
    }

}
