import {Pipe, PipeTransform} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Pipe({
    name: 'ipfilter'
})
export class IpfilterPipe implements PipeTransform {

    constructor(private httpClient: HttpClient) {
    }

    transform(value: any, args?: any): any {
        const ip = value.trim().split(',', 1);
        return Observable.create(observer => {
            observer.next(`<b>${ip}</b>`)
            this.httpClient.get<any>('https://freegeoip.net/json/' + ip) // TODO: map the response to avoid any object
                .subscribe(data  => {
                    console.log(data)
                    observer.next(`<img src="/assets/img/flag/16/${data.country_code.toLowerCase()}.png" class="flag"/><b>${ip}</b> - ${data.region_name}`)
                    observer.complete()
                });
        });
    }

}
