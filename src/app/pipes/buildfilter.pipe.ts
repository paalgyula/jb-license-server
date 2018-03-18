import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'buildfilter'
})
export class BuildfilterPipe implements PipeTransform {
    pattern: RegExp = /(.+)\sBuild\s([a-zA-Z]{2})-([^\s]+)/;

    transform(value: any, args?: any): any {
        if (this.pattern.test(value)) {
            const result = this.pattern.exec(value);

            let edition = result[1];
            let line = result[2].toLowerCase();
            let buildNumber = result[3];

            let product = '';

            if ( line === 'ws' ) {
                product = 'WebStorm';
            }

            //return this._sanitizer.bypassSecurityTrustHtml(strHTML);
            return `<img src="/assets/products/${line}.png" alt="${product} - ${buildNumber}" title="${product} - ${buildNumber}" height="32"/>`
        }

        return value;
    }

}
